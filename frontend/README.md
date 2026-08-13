# Librarien

A static, cookie-free reading catalogue app.

## What this version does

- Shows the embedded book catalogue from `books.js`
- Requires no sign-in
- Requires no cookies
- Requires no browser storage
- Can be published with GitHub Pages
- Lets the user search, filter, mark liked/favorite, change reading status, edit notes/tags/series, save changes to a new `books.js`, export backup, and load saved files

## How saving works

Because this version intentionally uses no cookies and no browser storage, the page itself does not silently store changes.

To keep changes permanently in GitHub Pages:

1. Click **Save changes** in the app.
2. The browser downloads a fresh `books.js` file.
3. Upload that downloaded `books.js` to the repository root, replacing the old `books.js`.
4. GitHub Pages will then show the updated catalogue.

For a personal backup, click **Export backup** and save the JSON file somewhere safe.

## Files

- `index.html`: the app
- `books.js`: the embedded catalogue
- `.nojekyll`: makes GitHub Pages serve the static files as-is

## Privacy note

This version includes the book list in `books.js`. If the repository is public, the book list is public. Keep the repository private unless you are comfortable with that.
