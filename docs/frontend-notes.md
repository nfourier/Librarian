# Frontend Notes

This update adds the first clean React/Vite frontend structure for Librarien.

## What is included

- `frontend/package.json`
- `frontend/index.html`
- `frontend/public/manifest.json`
- `frontend/src/main.jsx`
- `frontend/src/App.jsx`
- `frontend/src/styles.css`

## Important data rule

Imported books should always be treated as **In catalog**. If Goodreads, cover, blurb, or keywords are missing, the book should be marked **Needs details**, not removed from the catalogue.

## Run locally later

From the `frontend` folder:

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Do not commit

- Personal CSV catalogue exports
- API keys
- `.env` files
- Private notes
- Local Dropbox paths
