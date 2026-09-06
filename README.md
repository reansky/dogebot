# DOGEBOT PACK

Standalone DOGEBOT PACK community website for GitHub Pages.

## Contents

- `index.html` - complete self-contained website.

## Quick Setup

1. Create a new GitHub repository.
2. Upload `index.html` and this `README.md`.
3. Open **Settings > Pages**.
4. Select **Deploy from a branch**, choose `main`, and select `/root`.
5. Save and open the GitHub Pages URL.

No build command, package manager, or server is required.

## Quick Configuration

Open `index.html` and find the `DOGEBOT_CONFIG` block near the end of the file. Update these values before publishing:

- `contractAddress`
- `buyUrl`
- `xUrl`
- `bankrSkillUrl`
- `network`

The contract copy button, buy link, social links, Bankr links, and network label use this configuration.

## Notes

- The page is a static demo and stores forum and Meme Pool data in the current browser.
- The market readout is informational and does not connect a wallet or execute transactions.
- The Bankr fee model and `$DOGEBOT` buyback copy are project messaging displayed by the page.
