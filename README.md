# Librarian

A static reading catalogue app with optional GitHub save.

## Files to upload to the repository root

Upload these files directly to the main/root level of the repository:

- `index.html`
- `books.js`
- `config.js`
- `README.md`
- `.nojekyll`

Do not upload the containing folder. The files must sit next to `.gitignore` on the main repository page.

## What works

- Search and filter catalogue
- Mark liked/favorite
- Change unread/reading/finished
- Edit notes, tags, and series
- Save a replacement `books.js` file manually
- Load a saved `books.js` or JSON backup
- Optional GitHub save button

## GitHub save setup

`config.js` is already configured for:

```js
owner: "nfourier"
repo: "Librarian"
clientId: "Ov23litRJBwJcm1ugyJ7"
```

If the OAuth app callback URL is:

```text
https://nfourier.github.io/Librarian/
```

then the Connect GitHub button should redirect to GitHub and return to the app.

## Fallback

If GitHub save fails, click **Save file**. The app downloads a fresh `books.js`. Upload that downloaded file to GitHub manually, replacing the old one.
