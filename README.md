# Count on Me, Love ♡

A personalized, responsive comfort website built with plain HTML, CSS, and JavaScript. It includes an opening screen, optional background music, eight themed comfort sections, editable appreciation cards, photo gallery with lightbox, memory timeline, interactive love letter, and final message buttons.

## Run it

**Quickest option:** open `index.html` in a modern browser. Most features work locally. For the most reliable experience, use a small local server:

1. Install Node.js if you don't already have it.
2. Open a terminal in this project folder.
3. Run `npx serve .` (or use the Live Server extension in VS Code).
4. Open the local address shown in the terminal.

No build step or project dependencies are required.

## Add your photographs

Put your own photos in `public/images/` with these filenames:

- `cover.jpg` — hero photo / main couple photo
- `memory-01.jpg` through `memory-08.jpg` — section photos and memory slots

Use JPG, PNG, or WebP if you update the corresponding filename in `data.js`. If a photo is missing, the website displays a styled placeholder instead of a broken image icon.

## Add background music

Place a copy of the track that you are authorized to use at:

`public/music/count-on-me.mp3`

The website does **not** include the copyrighted song file. Music playback is attempted only after the visitor clicks the opening button because browsers may block autoplay. If the file is missing or playback is blocked, the site remains usable and the music controls show a helpful status.

## Personalize the website

Open `data.js` in a text editor. It contains one central configuration object for:

- Your nickname/signature and her nickname
- All eight comfort section headings, messages, photo filenames, and captions
- Optional short lyric excerpts (leave blank unless you provide an excerpt you are authorized to use)
- Appreciation cards
- Gallery captions
- Six timeline entries
- The complete love letter
- Final response messages

Replace the sample timeline dates and descriptions with real memories. The current examples are clearly placeholders; no actual relationship dates or events are assumed.

## Deploy it and share a link

You can publish the folder using a static hosting provider such as GitHub Pages, Netlify, or Cloudflare Pages:

1. Create a new site/project with your hosting provider.
2. Upload the project files while preserving the folder structure, or connect a repository containing them.
3. Ensure `index.html`, `styles.css`, `data.js`, `app.js`, and the `public/` folder are all included.
4. Open the published site and test it on both desktop and mobile.
5. Share the published URL with your girlfriend.

If you use GitHub Pages, the project must be published from a repository/branch supported by your Pages settings. Hosting-provider steps and free-tier terms can change, so follow the current instructions from your chosen host.

## Copyright and privacy

- The website does not bundle Bruno Mars's audio or the full lyrics.
- Only add audio and lyric excerpts that you have permission or authorization to use.
- Replace the image slots with photographs you have permission to share.
- The site is static; it does not submit her responses to a server or store them remotely.

## Accessibility and interactions

- Keyboard-accessible controls and visible focus states
- Escape closes the lightbox or letter
- Arrow keys navigate the photo lightbox
- Reduced-motion preferences are respected
- Responsive layouts for phones, tablets, and desktops
- Graceful missing-image and missing-audio handling
