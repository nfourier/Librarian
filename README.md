# Librarian Vercel Version

This version adds the backend step needed for GitHub OAuth saving.

## Why this version exists

GitHub Pages is static. The browser-only version cannot reliably exchange the OAuth code for a GitHub token. This version uses a Vercel Function at `/api/github-token` for that backend token step.

## Files

- `index.html` - app frontend
- `books.js` - embedded book catalogue
- `config.js` - GitHub repository and OAuth Client ID
- `api/github-token.js` - Vercel backend function
- `package.json` - basic Vercel project file

## Vercel setup

1. Upload this package to the root of the GitHub repository.
2. Create/import the repository in Vercel.
3. In Vercel project settings, add environment variable:

```text
GITHUB_CLIENT_SECRET = your GitHub OAuth app Client Secret
```

4. Update the GitHub OAuth App callback URL to your Vercel app URL, for example:

```text
https://your-vercel-project.vercel.app/
```

5. Open the Vercel app URL.
6. Click **Connect GitHub**.
7. Approve GitHub.
8. Click **Save to GitHub** after editing books.

## Details labels

- `CSV details` means the app has title/author/series/tags from the CSV.
- `Needs Goodreads` means Goodreads rating, URL, and match confidence are not enriched yet.

## Fallback

If GitHub save fails, click **Save file** and manually upload the downloaded `books.js` to GitHub.
