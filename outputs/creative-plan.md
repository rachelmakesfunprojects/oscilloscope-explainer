# The electron's drawing lesson

An explainer about a classic analog oscilloscope, with original procedural line drawings and a cultivated British voice. The expanded 505-word narration and eight-frame storyboard provide a thorough electron-gun explanation. Two narration auditions exist; the finished moving video is `oscilloscope-how-it-works.mp4`. See `production-notes.md` for the current production state.

## Current selected direction — revision 4

Use **Caveat throughout the instructional titles, subtitle and detailed labels**. Preserve B’s original whiteboard doodle palette, title (“Meet the world’s tiniest pencil.”), subtitle (“No lead. Just electrons.”), content and A’s detailed component labels. Caveat’s smooth strokes have no chalk texture. Increase label sizes and adjust placements for readability. The selected opening frame is `whiteboard-caveat-v4.png` / `.svg`; scenes 02–08 and `storyboard-all-eight.png` now use the same typography. Render with `render-whiteboard-caveat.cjs`, `render-gun-sequence.cjs` and `render-screen-sequence.cjs`.

The font is [Caveat by Impallari Type](https://fonts.google.com/specimen/Caveat), from the official Google Fonts repository; the font and SIL Open Font License are bundled in `font-assets/caveat/`. The earlier Caveat/Patrick Hand pairing remains a historical comparison only.

## Earlier direction — revision 3

Restore B's original title (“Meet the world's tiniest pencil.”), subtitle (“No lead. Just electrons.”), three numbered actions, waveform inset, and voltage/time mapping. Use smooth Chalkboard lettering, which has a similarly rounded handwritten character to C without Chalkduster's grain. Retain A's detailed heated-cathode, focus/acceleration, steering-plate, and phosphor-screen labels, plus the beam-visibility note. The revised files are `whiteboard-smooth-v3.png` / `.svg`; reproduce them with `node render-whiteboard-smooth.cjs` alongside `render-frames.cjs`. Labels occupy separate spaces above and below the tube, with the front-view trace in its own right-hand column. This supersedes revision 2. The visual and technical references below continue to apply; no additional reference artwork is used.

## Earlier exploration — revision 2

B's whiteboard doodle is the chosen base, with C's chalk-textured lettering and A's title, subtitle, and explanatory callouts. The revised frame is `whiteboard-chalk-v2.png` / `.svg`; reproduce it with `node render-hybrid.cjs` alongside `render-frames.cjs`. It keeps B's off-white background, irregular marker contours, coral accents, and mint beam. The title and component labels use the same locally installed Chalkduster font as C, while the smaller supporting sentences retain handwriting for readability. The chalk texture is in the lettering; the background stays light. All references and technical principles below continue to apply; no additional reference artwork is used.

## Four art directions

| Sample | Look | Animation character |
|---|---|---|
| A — Inventor's notebook | Cream paper, ink contours, amber electron beam | Gentle line wobble, handwritten annotations and small marginal discoveries |
| B — Whiteboard doodle | Heavy playful black marker, coral and mint accents | Brisk draw-ons, elastic arrows and clear, friendly visual jokes |
| C — Chalkboard lecture | Dark green board, pale chalk and a bright phosphor trace | Powdery strokes, soft erasures and a luminous travelling spot |
| D — Vintage technical engraving | Fine hatching, cream paper and restrained teal | Precise cutaways assembled in layers, slow camera moves and crisp labels |

The sample frame files are `a-notebook.svg` / `.png`, `b-whiteboard.svg` / `.png`, `c-chalkboard.svg` / `.png` and `d-engraving.svg` / `.png`. The supplied `render-frames.cjs` generates these drawings and renders their PNG previews. All sample art is original procedural code drawing. References inform presentation and physical principles; their images are not copied into the frames.

## Original 90-second sequence concept (superseded by the expanded narration)

| Time | Picture and explanation |
|---|---|
| 0–10 s | An oscilloscope draws itself. A green trace wakes up: a changing voltage has become a visible shape. |
| 10–25 s | Peel away the case to reveal the evacuated glass tube. A heater warms the cathode, releasing electrons; grid and electrodes control, accelerate and focus the beam. |
| 25–40 s | Zoom into the two perpendicular pairs of deflection plates. The incoming signal changes the vertical electric field, shifting the spot up and down. |
| 40–57 s | Introduce the timebase. Its ramp voltage sweeps the spot steadily left to right; the beam is blanked during the rapid return. |
| 57–70 s | Combine vertical signal and horizontal sweep. A moving spot leaves a fading phosphor trail, building the waveform on the screen. |
| 70–82 s | Repeated traces initially drift. The trigger starts each sweep at a consistent signal crossing, making the repeating waveform settle. |
| 82–90 s | Pull back to the instrument. Labels resolve to “height = voltage” and “across = time”; the trace completes one last elegant sweep. |

## Voice direction and original sample

Received Pronunciation: warm, precise and lightly amused, approximately 140–150 words per minute. Use a distinct narrator voice with measured pauses and dry humour.

> “Inside this rather unassuming box, a tiny beam of electrons is being persuaded to draw. A heated cathode supplies the electrons; electric fields focus and steer them. The signal determines the spot's height, while a steady sweep carries it across the screen. A little phosphor supplies the glow. And there we are: voltage, made visible. A remarkably civilised arrangement.”

## References and credits

Visual references: [RSA Animate: 21st Century Enlightenment](https://www.thersa.org/videos/rsa-animate-21st-century-enlightenment/) for draw-on explanation and annotation pacing; [TekTalk, July 1963, preserved by vintageTEK](https://vintagetek.org/wp-content/uploads/2020/03/TekTalk_July1963.pdf) for period technical-publication presentation; [Royal Institution: Michael Faraday's iron filings](https://www.rigb.org/explore-science/explore/collection/michael-faradays-iron-filings) for laboratory-notebook presentation. The Faraday reference concerns presentation only: the oscilloscope diagram uses electrostatic plates, not magnetic steering.

Technical references: [CERN-hosted Science in School: Build your own particle accelerator](https://scienceinschool.web.cern.ch/article/2014/accelerator/) for electron-gun and screen principles; [Tektronix 2215 service manual](https://download.tek.com/manual/tek_2215_service.pdf) for vertical deflection, timebase and triggering; [Tektronix persistence explanation, page 26](https://download.tek.com/document/37W_17249_4.pdf) for phosphor afterglow and trace intensity.

The tube drawing is schematic. A visible beam inside the vacuum is an explanatory overlay; the physical beam strikes one screen location at a time. The sine wave is the accumulated screen trace, not the beam's instantaneous shape inside the tube.
