# 조찬현 — A Museum of Memories

A personal photo museum with a white and black interface, Times New Roman typography, a locally hosted Korean logo font, and subtle Fujifilm-inspired photo colours.

## Run locally

Open `index.html` directly, or run `python -m http.server 8000` in the project directory and visit `http://localhost:8000`.

The site is plain HTML, CSS, and JavaScript. No installation or build step is needed. Upload the project files to any static hosting service to deploy it.

## Features

- A ribbon-hung entrance photograph and subtle film-style background details.
- Three equally sized photographs in pale wooden keepsake frames.
- A collection of 33 photographs with category filters, keyboard-accessible image viewing, and a slideshow.
- A coastal postcard that opens into a three-page personal letter, with Previous, Next, and Close controls.
- Responsive layouts and reduced-motion support.

## Photographs and assets

`assets/` contains 33 JPEG photographs, numbered consecutively 001–033. Photographs 001–031 use `.jpg`; photographs 032 and 033 use `.jpeg`. The `entries` list in `app.js` defines their titles, categories, and optional file extensions. No frames are created for missing photographs.

The photo colour treatment is applied through CSS; source image files are unchanged. The supplied postcard artwork is `assets/decor/postcard-coast.png`. The Korean logo uses Nanum Brush Script, included with its SIL Open Font License in `assets/fonts/`.

Local preview screenshots and unused design experiments are excluded through `.gitignore`.

Designed and built by [Lacdong](https://github.com/Lacdong).
