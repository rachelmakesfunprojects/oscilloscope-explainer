"""Render the original audition text with Microsoft's British English Ryan voice.

Install dependency: python -m pip install edge-tts
Run from any directory: python render-voice.py
This sends narration-sample.txt to Microsoft's online speech service.
"""
import asyncio
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
try:
    import edge_tts
except ImportError:
    sys.path.insert(0, str(ROOT.parent / 'work' / 'tts-deps'))
    import edge_tts

async def main():
    voice = 'en-GB-RyanNeural'
    available = await edge_tts.list_voices()
    selected = next((v for v in available if v['ShortName'] == voice), None)
    if selected is None:
        raise RuntimeError(f'The requested voice is unavailable: {voice}')
    narration = (ROOT / 'narration-sample.txt').read_text().strip()
    settings = dict(voice=voice, rate='-10%', pitch='-2Hz')
    await edge_tts.Communicate(narration, **settings).save(str(ROOT / 'narration-sample-ryan.mp3'))
    metadata = dict(provider='Microsoft Edge online speech service', voice=selected,
                    rate=settings['rate'], pitch=settings['pitch'], words=len(narration.split()),
                    output='narration-sample-ryan.mp3', input='narration-sample.txt')
    (ROOT / 'voice-settings.json').write_text(json.dumps(metadata, indent=2)+'\n')
    print(json.dumps(dict(voice=voice, words=len(narration.split()),
                         bytes=(ROOT / 'narration-sample-ryan.mp3').stat().st_size)))

if __name__ == '__main__':
    asyncio.run(main())
