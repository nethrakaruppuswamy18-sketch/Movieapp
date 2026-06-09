# CineTrack 🎬

A modern, high-fidelity, production-ready **Movie tracking and discovery application** built using **React**, **Vite**, and **Tailwind CSS**. Integrated with the **The Movie Database (TMDB) API**, this app lets users browse popular blockbusters, search for titles in real-time, read detailed synopses, and manage their favorite cinematic catalogs.

Includes a customized **Demo Mode (Offline Fallback)** so reviewers and evaluators can explore the fully responsive interface and search interactions instantly even before compiling keys!

---

## 🌟 Features

- **TMDB API Integration**: Connects with TMDB endpoints to load popular titles, high-resolution poster art, ratings, descriptions, and release dates.
- **Dynamic Search & Real-time Debouncing**: Powered by a lightweight debounced state mechanism (`450ms`) to minimize network overhead while allowing real-time searching by title or overview keywords.
- **Interactive Offline Demo Mode**: Seamlessly falls back to a curated collection of classic titles if the TMDB API Key is inactive or placeholder, alerting the developer on how to hook up TMDB keys.
- **Fluid Pagination Engine**: Fast previous and next page indicators to fetch and render pagination responses from any server or standard list page by page.
- **Bookmarked Favorites System**: Responsive local-storage persistence ensures selections persist safely across browser sessions and refreshes.
- **Dedicated Favorites Dashboard**: Allows deep monitoring, direct bookmarks removal inside a dedicated route, or wiping all favorites at once.
- **Sleek Dark Theme UX**: Structured using premium typography, modern borders, slide-up hover overlays, and micro-interactions built with `motion`.
- **Fully Responsive Matrix**: Polished layouts custom adjusted for mobile (44px tap targets + hamburger menu drawer), tablet (multi-column grids), and ultra-wide desktops.

---

## 🛠️ Tech Stack

- **Framework**: React (v19)
- **Bundler & Tooling**: Vite
- **Routing**: React Router DOM (Hash Routing configured for seamless static subfolder hosting)
- **Request Agent**: Axios
- **Animation Motion**: `motion/react`
- **Style Overlays**: Tailwind CSS (v4)
- **Vector Icons**: Lucide-React
- **Storage Strategy**: Local Storage API

---

## 📂 Folder Structure

```text
src/
├── components/
│   ├── Loader.tsx         # Pulses a retro film reel loader
│   ├── MovieCard.tsx      # Handles poster, badge ratings, slide-up synopsis, hover states, and bookmark triggers
│   ├── Navbar.tsx         # Sticky navigation with state badges, connection status alerts, and mobile drawer
│   ├── Pagination.tsx     # Provides easy standard page shifting controls
│   └── SearchBar.tsx      # Houses the input field and text search debouncer
│
├── pages/
│   ├── Home.tsx           # Manages primary catalog browsing, search states, and error retries
│   └── Favorites.tsx      # Renders favorites library with batch trash operations
│
├── services/
│   └── tmdbApi.ts         # Coordinates TMDB API queries & handles fallback simulation
│
├── context/
│   └── FavoritesContext.tsx # Backs the app with LocalStorage persisted states
│
├── hooks/
│   └── useFavorites.ts    # Custom hook to interface with the Favorited Context
│
├── types.ts               # Early-declared interface schemas for type safety
├── App.tsx                # Configures routers, context roots, and page layout architectures
├── main.tsx               # Primary browser entry mount point
└── index.css              # Universal CSS injecting fonts and scrollbar aesthetics
```

---

## 🚀 Installation & Local Development

### Prerequisites

Ensure you have **Node.js** (v18+) and **npm** installed on your system.

### 1. Close and Install Dependencies

```bash
# Install the workspace packages 
npm install
```

### 2. Configure TMDB API Keys

Create a `.env` file at the root folder:

```env
VITE_TMDB_API_KEY="YOUR_PERSONAL_TMDB_API_KEY"
```

> 🎟️ **To get your TMDB Key:**
> 1. Register or Log in to [The Movie Database (TMDB)](https://www.themoviedb.org/).
> 2. Navigate to your Account Settings -> **API** section.
> 3. Create a Developer key (or copy the read-only Token / v3 Auth key) and paste it into your `.env` file as `VITE_TMDB_API_KEY`.

### 3. Run Development Server

```bash
npm run dev
```

The application will run locally at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
```

The generated optimized output will be bundled inside the `dist/` directory.

---

## 🌍 GitHub Pages Deployment

The application has been fully configured for instant GitHub Pages deployment using `HashRouter`, relative routing (`./`), and the `gh-pages` build pipeline.

To deploy this project to your GitHub repository:

1. Push your code to your GitHub Repository:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Cinemagraph movie app implementation"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

2. Compile and publish to the `gh-pages` branch with a single command:
   ```bash
   npm run deploy
   ```

3. Ensure GitHub Pages is built from the `gh-pages` branch on your GitHub repository settings under **Settings -> Pages**.

Your live app will be running at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`!

---

## 📸 Screenshots Section

### 🎬 Home Screen / Movie Catalog
![Catalog View](https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80)
*Featuring a sleek slate background, dynamic navigation indicators, responsive glassmorphism search bars, and movie cards loaded with individual synopsis and favoriting metrics.*
