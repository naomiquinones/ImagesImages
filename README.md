# ImagesImages

An image search API and app built for freeCodeCamp's **Image Search Abstraction Layer** project. It searches openly licensed images through the [Openverse API](https://openverse.org/) and remembers recent searches.

**Live demo:** 

## API

### `GET /query/:search?page=N`

Returns up to 20 images for a search term.

- `page` is optional and defaults to 1. It must be a whole number from 1 to 12; anything else returns a `400` error.
- Each image looks like this:

```json
{
  "imageUrl": "https://…",
  "thumbnailUrl": "https://…",
  "description": "Image title",
  "pageUrl": "https://… (the page the image came from)",
  "creator": "Creator name",
  "creatorUrl": "https://…",
  "license": "by 2.0",
  "licenseUrl": "https://creativecommons.org/…",
  "attribution": "Full attribution text"
}
```

Example: `/query/lolcats%20funny?page=2`

### `GET /recent`

Returns the 10 most recent searches, newest first:

```json
[{ "term": "lolcats funny", "searchedAt": "2026-10-25T18:30:00.000Z" }]
```

Only first-page searches are recorded, so paging through results doesn't add duplicates.

## Features

- **Abstraction layer:** the server calls Openverse and reshapes its large response into the 9 fields above.
- **Recent searches** are stored in Postgres. Search terms are trimmed and lowercased first.
- **Accessible UI:** a labeled search field, results in a list, image titles as alt text, and an `aria-live` status that announces loading and results.

## Tech stack

React (Vite) · Node.js / Express · PostgreSQL (Neon) · deployed on Render

## Run it locally

1. Install dependencies:

   ```sh
   npm install
   npm install --prefix server
   npm install --prefix client
   ```

2. Copy `server/.env.example` to `server/.env` and add your Postgres connection string.
3. Run `server/schema.sql` against your database. With Neon, you can paste it into the SQL editor.
4. Start both servers with `npm run dev`, then open `http://localhost:5173`.

## Known limits

- Openverse only includes openly licensed images, so results differ from a general web image search.
- Without an API key, Openverse returns at most 240 results per search (12 pages of 20).
- Image titles are used as alt text and are sometimes just filenames.
