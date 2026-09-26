# Meet the world’s tiniest pencil

A complete, original code-drawn explanation of a classic analog oscilloscope.

## Watch

The finished export is `../oscilloscope-how-it-works.mp4`: 1920 × 1080, 24 fps, H.264 video with AAC narration, optional English subtitles and chapter markers. Runtime is approximately 3 minutes 18 seconds.

Every visual frame is drawn from Canvas geometry: the tube, electrodes, electron paths, moving particles, focus control, deflection, phosphor trails and trigger demonstrations. No stock footage, generated illustration or baked storyboard image appears in the video. The whiteboard palette and Caveat lettering follow the selected samples.

The full 505-word narration uses **Christopher — Gentle and Trustworthy**, British, generated with ElevenLabs Multilingual v2 at speed 1.08. The source generation used stability 0.40, similarity 0.50, style 0.22 and speaker boost. A one-second lead-in and 0.7-second chapter pauses were added. The voice was normalized to approximately −16 LUFS with a −1.5 dB true-peak ceiling. No background music obscures the explanation.

## Re-render

Install Node.js and `@napi-rs/canvas`, and make FFmpeg available. Keep this directory alongside the bundled `font-assets/caveat/`, `video-narration.wav` and `oscilloscope-captions.srt` files.

```sh
cd outputs/video-source
npm install
FFMPEG_PATH=/absolute/path/to/ffmpeg npm run render
```

The scripts load Canvas from the installed npm dependency and use `ffmpeg` from your command-line `PATH`, or the executable specified by `FFMPEG_PATH`. The preserved audio and `timeline.json` are sufficient to reproduce the film without connecting to ElevenLabs or running speech recognition again.

- `video-style.cjs`: palette, actual Caveat font, drawing helpers and word-cue lookup.
- `scene-overview.cjs`: tube overview and the four electron-gun functions.
- `scenes-gun.cjs`: heater/cathode, grid bias and acceleration.
- `scene-focus.cjs`: electrostatic focusing.
- `scenes-screen.cjs`: electrostatic deflection, timebase/phosphor and triggering.
- `timeline.json`: chapter boundaries and narration word timings.
- `chapters.ffmetadata`: player chapter markers.
- `render-video.cjs`: 1080p Canvas frame generation and FFmpeg encoding.
- `prepare-timeline.py`: optional audio/timing preparation; requires numpy, imageio-ffmpeg and the bundled `narration-word-timestamps.json`. This preparation input is bundled with the source archive.

From that source directory, use `npm run stills` for visual checks, or `node render-video.cjs frame 80 output.png` to render a specific time. Scratch checks are written into `work/video/` at the archive root.

## Credits and references

The diagram geometry and narration are original. Scientific references informed the explanation; their illustrations were not copied or traced.

- **Caveat**, Impallari Type, [official Google Fonts source](https://github.com/google/fonts/tree/main/ofl/caveat) and [specimen](https://fonts.google.com/specimen/Caveat). The unmodified font and SIL Open Font License are bundled.
- **Narration:** ElevenLabs, Christopher — Gentle and Trustworthy, [Text to Speech documentation](https://elevenlabs.io/docs/eleven-creative/playground/text-to-speech).
- **Heater, cathode, control grid and blanking:** Tektronix, [Cathode Ray Tubes: Getting Down to Basics (1989)](https://usermanual.wiki/m/fc136b16b15b162b65d10abdf983e39384b92f958ff66780e1174d1131677057.pdf), printed pages 4–6 and 10–11.
- **Acceleration and electrostatic focusing:** Tektronix, Chuck DeVere, [Cathode-Ray Tubes, second edition (1969)](https://w140.com/tekwiki/images/6/62/062-0852-01.pdf), printed pages 3–13 and 25–26.
- **Deflection, timebase and triggering:** [Tektronix 2215 service manual](https://download.tek.com/manual/tek_2215_service.pdf), Theory of Operation.
- **Phosphor persistence:** Tektronix, [Fundamentals of Real-Time Spectrum Analysis](https://download.tek.com/document/37W_17249_4.pdf), printed page 26.
- **Presentation reference:** [RSA Animate: 21st Century Enlightenment](https://www.thersa.org/videos/rsa-animate-21st-century-enlightenment/), for a progressively drawn explanation.
- **Local timing preparation:** [faster-whisper](https://github.com/SYSTRAN/faster-whisper), using word timestamps as timing anchors while preserving the original script for captions.
- **Encoding and audio processing:** [FFmpeg](https://ffmpeg.org/ffmpeg-filters.html).

The illustrations are schematic. Particle motion is slowed, dimensions and voltages are illustrative, and the visible paths inside the tube are explanatory overlays. Visible light is emitted at the phosphor screen. In ordinary swept operation, vertical position represents voltage and horizontal position represents time.
