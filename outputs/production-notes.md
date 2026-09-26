# Voltage, made visible — narration and storyboard

Current selected visual direction (revision 4): original B whiteboard palette and content, **Caveat** for all instructional titles, subtitles and detailed component labels, and A’s detailed component labels. Small production metadata stays monospaced. Label sizes and placements are adjusted for Caveat’s proportions; no chalk texture is applied. All diagrams are original procedural drawings. The PNGs are 1600 × 900; the matching SVGs contain outlined lettering and editable vector paths. The sample audio is synthetic speech. The complete film is `oscilloscope-how-it-works.mp4` (1080p, 24 fps, about 3 minutes 18 seconds), with ElevenLabs Christopher narration, optional captions and chapter markers. Code and complete film references are in `video-source/README.md`. The images below are the earlier planning storyboard; the film uses animated Canvas geometry.

## Narration and audition

Latest audition: `narration-sample-elevenlabs-christopher.mp3`, using **Christopher — Gentle and Trustworthy** (British), Eleven Multilingual v2, speed setting 1.08. It runs 45.37 seconds. Generated through the account’s signed-in Safari session; no API connector is installed. This voice is used in the completed full film, following the user’s instruction to proceed. Settings and source notes are in `voice-elevenlabs-settings.json` and `voice-and-font-audition.md`. The earlier Ryan audition below is retained for comparison.


- `narration-script.md`: the complete 505-word narration, estimated scene timings, and technical references.
- `narration-full.txt`: spoken words only.
- `narration-sample-ryan.mp3`: a 60.84-second audition of the opening, heater, and control-grid explanation.
- `narration-sample.txt`: the exact 124-word audition text. It is a condensed excerpt, not the complete film.
- Voice: Microsoft `en-GB-RyanNeural`, rate `-10%`, pitch `-2Hz`. The intended delivery is cultivated British English, warm, precise, and lightly amused. The sample is for judging the voice and pace.
- `voice-settings.json`: settings and decoded-audio verification. The file decodes to 24 kHz mono audio with a nonzero signal and no full-scale sample peaks.

Voice identity and service references: [Microsoft voice catalogue](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support) and the [edge-tts project](https://github.com/rany2/edge-tts). Synthesis sends the original audition text to Microsoft's online speech service. The earlier local macOS voice route returned empty files; none of those failed files is included in this package.

## Frame order and proposed motion

| Scene | File basename | Animation cue |
|---|---|---|
| 1 | whiteboard-caveat-v4 | Draw on B's original title, reveal the cutaway, then follow a single beam to the screen. |
| 2 | 02-cathode | Warm the separate heater; reveal electrons escaping the coated cathode into the vacuum. Keep the heater and cathode distinct. |
| 3 | 03-control-grid | Vary the grid bias and particle flow. The physical aperture stays fixed. At cutoff, the beam disappears while the cathode remains hot. |
| 4 | 04-acceleration | Increase particle speed through the accelerating fields. The +500 V and +1000 V values are illustrative and measured relative to the cathode. |
| 5 | 05-focusing | Adjust the trajectories until they converge on a small spot. Electrode shape and potential form the lens; the focus control changes a lens voltage. |
| 6 | 06-steering | Bend the path locally between the plates, then continue along a straight trajectory. Show vertical and horizontal steering as separate steps. |
| 7 | 07-sweep | Animate one bright spot with a fading phosphor trail. Use a linear horizontal sweep, then blank the beam during the rapid return. |
| 8 | 08-trigger | Let repeated traces drift, then align them by starting each sweep at the same rising threshold crossing. |

`storyboard-all-eight.png` is the full contact sheet. `electron-gun-frames.png` is the four-frame close-up preview. The electron-gun section accounts for 57% of the spoken script. The old script timing marks remain historical estimates. The film’s final measured timing is stored in `video-source/timeline.json`.

## Reproduce the assets

Install `@napi-rs/canvas` for Node.js and `edge-tts` for Python. Keep all rendering scripts together. Caveat is bundled in `font-assets/caveat/`, including its original SIL Open Font License. The renderer loads that file directly. Small metadata uses local Menlo; outlined SVGs need no fonts to display.

```sh
node render-whiteboard-caveat.cjs
node render-gun-sequence.cjs
node render-screen-sequence.cjs
python render-contact-sheets.py
# Optional: regenerate the earlier Ryan comparison sample
python render-voice.py
```

These scripts use `render-frames.cjs` as the shared drawing library. The original four style explorations remain available through that library's standalone entry point.

## References

Technical sources and exact source notes are in `narration-script.md`, including Tektronix's CRT, triggering, and phosphor explanations. Visual inspiration remains [RSA Animate](https://www.thersa.org/videos/rsa-animate-21st-century-enlightenment/) for drawn explanation and [TekTalk, July 1963](https://vintagetek.org/wp-content/uploads/2020/03/TekTalk_July1963.pdf) for technical illustration. No reference artwork is embedded or traced. The selected smooth handwriting is [Caveat](https://fonts.google.com/specimen/Caveat), by Impallari Type, sourced from the [official Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/caveat). The original font and licence are bundled; no reference artwork is embedded or traced.
