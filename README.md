# Vishnu Sahasranama Learning

A responsive web app for learning Śrī Viṣṇu Sahasranāma from the Braja Beats recording.

## Run locally

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Features

- Section-by-section playback
- Select and play individual sections
- Continuous next-section playback
- Playback speed control from 0.5× to 1.5×
- Optional repeat for the current section
- Local progress tracking

The source is embedded from YouTube. The passage list is divided at detected visual scene changes in the recording, with one numbered passage per scene and approximate timestamps. The first five boundaries were checked against the video: 0:11, 0:23, 0:35, 0:47, and 0:59. The dedication/intro and closing subscribe card are excluded. Passage text is not transcribed yet; use the source video to read each verse.
