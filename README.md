# Shelvy – Self‑Hosted Goodreads‑Style Tracker

A self‑hosted bookshelf app that lets you track your books, organize them into shelves, and browse them in a visual “books on a shelf” view. It’s built with React, Material UI, Tailwind CSS v4, a FastAPI backend, and MongoDB, and runs via Docker Compose.

---

## Features

- Visual bookshelf UI with horizontal, scrollable shelves showing book covers.
- Custom shelves (Want to Read, Reading, Read, plus your own).
- Add books via Open Library search (title/author/ISBN) with automatic metadata and covers.
- Per‑book shelf assignment and editing via a mobile‑friendly bottom navigation and dialogs.
- Self‑hosted stack:
  - React + Vite + Material UI + Tailwind CSS v4 for the frontend.
  - FastAPI backend with MongoDB (FARM‑style stack).
  - Docker Compose for one‑command local deployment.

---

## Tech Stack

- **Frontend**
  - React (Vite)
  - Material UI (MUI) for components (BottomNavigation, Dialogs, ImageList).
  - Tailwind CSS v4 (via `@tailwindcss/vite`) for utility styling.

- **Backend**
  - FastAPI (Python)
  - Motor (async MongoDB driver)
  - REST endpoints for managing books (and later shelves).

- **Database**
  - MongoDB running in Docker, document‑based storage for books.

- **External APIs**
  - Open Library Search API for book metadata and cover URLs.

---
