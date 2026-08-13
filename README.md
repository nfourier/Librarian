# Librarien

Private reading catalogue web app project.

## Current status

This repository is for the app code only. Do **not** commit personal catalogue exports, API keys, `.env` files, Dropbox paths, or private reading notes.

## Prototype

Open `prototype/reading-catalog-prototype.html` in a browser to see the safe starter prototype.

## Data rule

Imported CSV rows are always treated as **in the catalogue**. Missing Goodreads/blurb/cover data means **Needs details**, not "not catalogued".

## Next build direction

- Frontend: React/Vite PWA
- Backend: small API server
- Database: hosted database such as Supabase
- AI features: enrichment and Librarian recommendations through the backend only
