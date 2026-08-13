# Librarien App Plan

## Goal

Create a private reading catalogue that works on phone and desktop, with a Librarian assistant that recommends from the user's own catalogue by default.

## Core principles

1. Every imported CSV row is a catalogue item.
2. Enrichment failure must not remove catalogue status.
3. Missing details should be shown as `Needs details`.
4. API keys must only exist on the backend, never in browser code.
5. External recommendations are separate from library recommendations.

## Future data fields

- title
- author
- status: unread, reading, finished
- liked
- favorite
- series
- seriesIndex
- tags
- goodreadsRating
- goodreadsUrl
- matchConfidence
- detailsStatus
- blurb
