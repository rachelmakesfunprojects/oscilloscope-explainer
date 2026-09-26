#!/usr/bin/env python3
"""Align the approved narration to ASR anchors and build a sample-accurate film track.

Only the approved script supplies subtitle words. ASR substitutions are timing
hints; ASR insertions (including possible hallucinated words) are never captioned.
Run with the bundled Python, or any Python with numpy and imageio-ffmpeg.
"""
from __future__ import annotations
import argparse
import difflib
import json
from pathlib import Path
import re
import subprocess
import sys
import textwrap
import wave

ROOT = Path(__file__).resolve().parents[2]
DEPS = ROOT / 'work/video-deps'
if DEPS.exists():
    sys.path.insert(0, str(DEPS))
import numpy as np
import imageio_ffmpeg

RATE = 48000
LEAD_IN = 1.0
CHAPTER_GAP = 0.7
END_HOLD = 4.0


def norm(word):
    return re.sub(r'[^a-z0-9]', '', word.lower())


def run_ffmpeg(args):
    return subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-hide_banner', '-y', *map(str, args)],
                          check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)


def wav_read(path):
    with wave.open(str(path), 'rb') as f:
        assert f.getnchannels() == 1 and f.getsampwidth() == 2 and f.getframerate() == RATE
        return np.frombuffer(f.readframes(f.getnframes()), dtype='<i2').copy()


def wav_write(path, samples):
    with wave.open(str(path), 'wb') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(RATE)
        f.writeframes(np.asarray(samples, dtype='<i2').tobytes())


def align(script_words, asr_words, audio_duration):
    matcher = difflib.SequenceMatcher(None, [norm(w) for w in script_words],
                                     [norm(w['word']) for w in asr_words], autojunk=False)
    aligned = [None] * len(script_words)
    changes = []
    matched = 0
    for kind, a, b, c, d in matcher.get_opcodes():
        if kind == 'equal':
            for i, j in zip(range(a, b), range(c, d)):
                aligned[i] = {'word': script_words[i], 'start': float(asr_words[j]['start']),
                              'end': float(asr_words[j]['end']), 'alignment': 'exact'}
                matched += 1
            continue
        changes.append({'kind': kind, 'scriptIndex': a,
                        'script': ' '.join(script_words[a:b]),
                        'asr': ' '.join(w['word'] for w in asr_words[c:d]),
                        'start': asr_words[c]['start'] if c < len(asr_words) else audio_duration})
        if a == b:
            continue  # An ASR-only insertion never becomes a caption.
        # Replacement words inherit the interval between the neighboring exact
        # anchors, narrowed to the ASR replacement when it has usable timing.
        left = float(asr_words[c-1]['end']) if c else 0.0
        right = float(asr_words[d]['start']) if d < len(asr_words) else audio_duration
        if d > c:
            left = max(left, float(asr_words[c]['start']))
            right = min(right, float(asr_words[d-1]['end']))
        if right <= left:
            right = max(left, float(asr_words[d]['start']) if d < len(asr_words) else audio_duration)
        right = max(left, right)
        interpolate_a = a
        # An ASR deletion can collapse to zero time because the recognizer has
        # stretched a preceding word across the omitted phrase. Borrow only a
        # small immediate neighborhood, bounded by an earlier exact anchor.
        if kind == 'delete':
            while (right-left < .06*(b-interpolate_a) and interpolate_a > max(0, a-3)):
                interpolate_a -= 1
                left = aligned[interpolate_a]['start']
            if interpolate_a < a:
                matched -= a-interpolate_a
                changes[-1]['interpolationIncludesPreviousWords'] = ' '.join(script_words[interpolate_a:a])
        weights = [max(2, len(norm(w))) for w in script_words[interpolate_a:b]]
        weight_sum = sum(weights)
        elapsed = 0.0
        for i, weight in zip(range(interpolate_a, b), weights):
            start = left + (right-left) * elapsed / weight_sum
            elapsed += weight
            end = left + (right-left) * elapsed / weight_sum
            aligned[i] = {'word': script_words[i], 'start': start, 'end': end,
                          'alignment': 'interpolated'}
    assert all(w is not None for w in aligned)
    # Whisper may give adjacent tokens identical or slightly overlapping bounds.
    # Keep starts monotonic without moving a token past its following word.
    for i, w in enumerate(aligned):
        w['start'] = min(audio_duration, max(0, w['start']))
        w['end'] = min(audio_duration, max(w['start'], w['end']))
        if i and w['start'] < aligned[i-1]['start']:
            w['start'] = aligned[i-1]['start']
            w['end'] = max(w['start'], w['end'])
    for i in range(len(aligned)-1):
        aligned[i]['end'] = min(aligned[i]['end'], aligned[i+1]['start'])
    report = {'originalWords': len(script_words), 'asrWords': len(asr_words),
              'exactMatchedWords': matched, 'exactWordRatio': matched/len(script_words),
              'sequenceRatio': matcher.ratio(), 'changes': changes,
              'lowConfidenceAsr': [{k: w[k] for k in ('word', 'start', 'end', 'probability') if k in w}
                                   for w in asr_words if w.get('probability', 1) < .15]}
    return aligned, report


def split_lines(text):
    if len(text) <= 42:
        return text
    words = text.split()
    options = []
    for i in range(1, len(words)):
        left, right = ' '.join(words[:i]), ' '.join(words[i:])
        if max(len(left), len(right)) <= 42:
            options.append((abs(len(left)-len(right)), left, right))
    if options:
        _, left, right = min(options)
        return left + '\n' + right
    return '\n'.join(textwrap.wrap(text, 42, break_long_words=False, break_on_hyphens=False))


def srt_time(t):
    ms = max(0, int(round(t * 1000)))
    hours, ms = divmod(ms, 3600000)
    minutes, ms = divmod(ms, 60000)
    seconds, ms = divmod(ms, 1000)
    return f'{hours:02}:{minutes:02}:{seconds:02},{ms:03}'


def captions_for(scenes):
    captions = []
    for scene in scenes:
        words = scene['words']
        i = 0
        while i < len(words):
            j = i + 1
            while j < len(words):
                proposed = ' '.join(w['word'] for w in words[i:j+1])
                span = words[j]['end'] - words[i]['start']
                current = ' '.join(w['word'] for w in words[i:j])
                current_span = words[j-1]['end'] - words[i]['start']
                if len(proposed) > 80 or span > 5 or len(split_lines(proposed).splitlines()) > 2:
                    break
                if re.search(r'[.!?][\'\"]?$', words[j-1]['word']) and len(current) >= 22 and current_span >= .8:
                    break
                j += 1
            start = scene['start'] + words[i]['start']
            end = scene['start'] + words[j-1]['end']
            next_start = scene['start'] + words[j]['start'] if j < len(words) else scene['start'] + scene['duration']
            end = min(next_start - .025, max(end + .1, start + .8))
            end = max(start + .04, end)
            text = split_lines(' '.join(w['word'] for w in words[i:j]))
            assert len(text.splitlines()) <= 2 and len(text.replace('\n', ' ')) <= 80
            captions.append({'start': start, 'end': end, 'text': text})
            i = j
    return captions


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--transcription', type=Path, default=Path(__file__).with_name('narration-word-timestamps.json'))
    parser.add_argument('--audio', type=Path, default=ROOT/'outputs/narration-full-elevenlabs.mp3')
    parser.add_argument('--skip-normalize', action='store_true', help='Only for quick alignment previews.')
    args = parser.parse_args()
    scratch = ROOT/'work/video'
    scratch.mkdir(parents=True, exist_ok=True)
    decoded_path = scratch/'narration-decoded.wav'
    run_ffmpeg(['-i', args.audio, '-vn', '-ac', '1', '-ar', RATE, '-c:a', 'pcm_s16le', decoded_path])
    audio = wav_read(decoded_path)
    audio_duration = len(audio)/RATE
    script = (ROOT/'outputs/narration-full.txt').read_text().strip()
    paragraphs = [p.split() for p in re.split(r'\n\s*\n', script)]
    if len(paragraphs) != 8:
        raise ValueError(f'Expected 8 narration paragraphs; found {len(paragraphs)}')
    original = [w for p in paragraphs for w in p]
    transcription = json.loads(args.transcription.read_text())
    asr = [w for segment in transcription['segments'] for w in segment.get('words', []) if norm(w['word'])]
    aligned, report = align(original, asr, audio_duration)
    if report['exactWordRatio'] < .85:
        raise ValueError(f'Alignment is too weak ({report["exactWordRatio"]:.1%}); review before rendering.')

    # Every cut is an integer sample at the midpoint of the pause separating
    # the two chapter boundary words; all original PCM samples are retained.
    boundaries = [0]
    word_index = 0
    for p in paragraphs[:-1]:
        word_index += len(p)
        left, right = aligned[word_index-1]['end'], aligned[word_index]['start']
        boundaries.append(round((left+right)*.5*RATE))
    boundaries.append(len(audio))
    assert all(a < b for a, b in zip(boundaries, boundaries[1:]))
    lead_samples, gap_samples, tail_samples = (round(s*RATE) for s in (LEAD_IN, CHAPTER_GAP, END_HOLD))
    blocks, scenes = [], []
    output_sample = 0
    word_index = 0
    for n, paragraph in enumerate(paragraphs):
        cut_start, cut_end = boundaries[n:n+2]
        lead = lead_samples if n == 0 else 0
        tail = tail_samples if n == len(paragraphs)-1 else gap_samples
        scene_start = output_sample/RATE
        duration_samples = lead + cut_end-cut_start + tail
        if lead:
            blocks.append(np.zeros(lead, dtype='<i2'))
        blocks.append(audio[cut_start:cut_end])
        blocks.append(np.zeros(tail, dtype='<i2'))
        local_words = []
        for w in aligned[word_index:word_index+len(paragraph)]:
            local_words.append({'word': w['word'],
                                'start': round((round(w['start']*RATE)-cut_start+lead)/RATE, 6),
                                'end': round((round(w['end']*RATE)-cut_start+lead)/RATE, 6)})
        scenes.append({'id': n+1, 'start': scene_start, 'duration': duration_samples/RATE,
                       'sourceStart': cut_start/RATE, 'sourceEnd': cut_end/RATE,
                       'words': local_words})
        word_index += len(paragraph)
        output_sample += duration_samples
    combined = np.concatenate(blocks)
    assert len(combined) == output_sample
    padded_path = scratch/'narration-with-pauses.wav'
    wav_write(padded_path, combined)
    final_audio = ROOT/'outputs/video-narration.wav'
    loudness = None
    if args.skip_normalize:
        wav_write(final_audio, combined)
    else:
        first = run_ffmpeg(['-i', padded_path, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'])
        loudness = json.loads(first.stderr[first.stderr.rfind('{'):first.stderr.rfind('}')+1])
        normalize = ('loudnorm=I=-16:TP=-1.5:LRA=11:linear=true:'
                     f'measured_I={loudness["input_i"]}:measured_TP={loudness["input_tp"]}:'
                     f'measured_LRA={loudness["input_lra"]}:measured_thresh={loudness["input_thresh"]}:'
                     f'offset={loudness["target_offset"]},aresample={RATE},'
                     f'apad=whole_len={output_sample},atrim=end_sample={output_sample}')
        run_ffmpeg(['-i', padded_path, '-af', normalize, '-ar', RATE, '-ac', '1', '-c:a', 'pcm_s16le', final_audio])
        assert len(wav_read(final_audio)) == output_sample, 'Normalized audio duration changed.'
    timeline = {'sampleRate': RATE, 'totalSamples': output_sample, 'totalDuration': output_sample/RATE,
                'leadIn': LEAD_IN, 'chapterGap': CHAPTER_GAP, 'endHold': END_HOLD,
                'audio': '../video-narration.wav', 'scenes': scenes}
    (ROOT/'outputs/video-source/timeline.json').write_text(json.dumps(timeline, indent=2)+'\n')
    captions = captions_for(scenes)
    srt = '\n\n'.join(f'{i}\n{srt_time(c["start"])} --> {srt_time(c["end"])}\n{c["text"]}'
                        for i, c in enumerate(captions, 1))+'\n'
    (ROOT/'outputs/oscilloscope-captions.srt').write_text(srt)
    report.update({'sourceDuration': audio_duration, 'outputDuration': timeline['totalDuration'],
                   'sourceCutSamples': boundaries, 'captions': len(captions), 'loudnessAnalysis': loudness})
    (scratch/'alignment-report.json').write_text(json.dumps(report, indent=2)+'\n')
    print(json.dumps({'exactWordRatio': report['exactWordRatio'], 'duration': timeline['totalDuration'],
                      'sceneDurations': [round(s['duration'], 3) for s in scenes],
                      'captions': len(captions), 'changes': report['changes'],
                      'report': str(scratch/'alignment-report.json')}, indent=2))

if __name__ == '__main__':
    main()
