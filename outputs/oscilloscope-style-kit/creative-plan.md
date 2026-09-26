# The electron's drawing lesson

A proposed 90-second explainer about a classic analog oscilloscope, with original procedural line drawings and a cultivated British voice. These samples establish the visual direction; narrated audio and the finished video have not yet been created.

## Four art directions

| Sample | Look | Animation character |
|---|---|---|
| A — Inventor's notebook | Cream paper, ink contours, amber electron beam | Gentle line wobble, handwritten annotations and small marginal discoveries |
| B — Whiteboard doodle | Heavy playful black marker, coral and mint accents | Brisk draw-ons, elastic arrows and clear, friendly visual jokes |
| C — Chalkboard lecture | Dark green board, pale chalk and a bright phosphor trace | Powdery strokes, soft erasures and a luminous travelling spot |
| D — Vintage technical engraving | Fine hatching, cream paper and restrained teal | Precise cutaways assembled in layers, slow camera moves and crisp labels |

The sample frame files are `a-notebook.svg` / `.png`, `b-whiteboard.svg` / `.png`, `c-chalkboard.svg` / `.png` and `d-engraving.svg` / `.png`. The supplied `render-frames.cjs` generates these drawings and renders their PNG previews. All sample art is original procedural code drawing. References inform presentation and physical principles; their images are not copied into the frames.

## Proposed 90-second sequence

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
