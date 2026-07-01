# Frontend (React + Vite)

This folder now contains a React application (Vite) migrated from the original static HTML pages. The original CSS files and `assets/` were preserved and are imported into the React app.

Quick dev

```bash
cd frontend
npm install
npm run dev
```

The dev server runs at `http://localhost:5173/` by default.

Build for production

```bash
npm run build
```

Environment

- `VITE_API_URL` (optional) — base URL for backend API (defaults to `http://localhost:3000`).

Notes

- Legacy static pages (`index.html`, `dashboard.html`, `admin.html`) were replaced/redirected to the SPA routes. Keep the `assets/`, `styles.css`, and `responsive.css` files here for compatibility.
