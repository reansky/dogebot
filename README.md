# DOGEBOT PACK

Modular static website for GitHub Pages.

## Structure

```text
.
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── images/
│   │   ├── bankr-logo.webp
│   │   ├── dogebot-hero.webp
│   │   └── dogebot-logo.webp
│   └── js/
│       ├── app.js
│       └── config.js
└── README.md
```

## Quick Setup

1. Create a new GitHub repository.
2. Upload the contents of this folder.
3. Open **Settings > Pages**.
4. Select **Deploy from a branch**, choose `main`, and select `/root`.
5. Save and open the GitHub Pages URL.

No build command, package manager, or server is required.

## Quick Configuration

Edit `assets/js/config.js` before publishing:

- `contractAddress`
- `buyUrl`
- `xUrl`
- `bankrSkillUrl`
- `network`

The contract copy button, buy link, social links, Bankr links, and network label use this configuration.

## Editing Guide

- Edit layout and content in `index.html`.
- Edit colors, spacing, and responsive styles in `assets/css/styles.css`.
- Edit interactions, forum, Meme Pool, and AI responses in `assets/js/app.js`.
- Edit project links and contract details in `assets/js/config.js`.
- Replace images inside `assets/images/` while keeping the same filenames.

## Notes

- The page is a static demo and stores forum and Meme Pool data in the current browser.
- The market readout is informational and does not connect a wallet or execute transactions.
- The Bankr fee model and `$DOGEBOT` buyback copy are project messaging displayed by the page.
