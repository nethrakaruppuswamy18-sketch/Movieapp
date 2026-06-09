import express from "express";
import path from "path";
import axios from "axios";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import "dotenv/config";

const app = express();
const PORT = 3000;

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Helper to check if a string is a valid looking TMDB v3 API key (32 character hex)
function isValidTmdbKey(key) {
  if (!key) return false;
  const clean = key.trim().replace(/['"]/g, "");
  // Standard TMDB v3 key is a 32-character hex string
  return /^[0-9a-fA-F]{32}$/.test(clean);
}

// 1. Direct file parsing of .env (bypasses any OS proxy environment overrides)
let fileKey;
try {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    const match = content.match(/^\s*VITE_TMDB_API_KEY\s*=\s*(.*)$/m);
    if (match && match[1]) {
      fileKey = match[1].trim();
    }
  }
} catch (e) {
  console.warn("Failed to read .env file directly:", e);
}

// 2. Select key with precedence: valid .env key -> valid process.env key -> fallback hardcoded key
let rawKey = "67cfa52efc825adaa1c4452ea8da77d0";
if (isValidTmdbKey(fileKey)) {
  rawKey = fileKey;
} else if (isValidTmdbKey(process.env.VITE_TMDB_API_KEY)) {
  rawKey = process.env.VITE_TMDB_API_KEY;
}

let API_KEY = rawKey.trim();
if (API_KEY.startsWith('"') && API_KEY.endsWith('"')) {
  API_KEY = API_KEY.slice(1, -1);
}
if (API_KEY.startsWith("'") && API_KEY.endsWith("'")) {
  API_KEY = API_KEY.slice(1, -1);
}

// Global flag to track whether active API Key failed with a 401/status error
let isKeyInvalid = false;

// High-quality backup catalog for offline fallback / invalid key demo mode
const FALLBACK_MOVIES = [
  {
    id: 15239678,
    title: "Dune: Part Two",
    poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
    release_date: "2024-03-01",
    vote_average: 8.3,
    overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee."
  },
  {
    id: 816692,
    title: "Interstellar",
    poster_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
    release_date: "2014-11-07",
    vote_average: 8.4,
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage."
  },
  {
    id: 468569,
    title: "The Dark Knight",
    poster_path: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    release_date: "2008-07-18",
    vote_average: 8.5,
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker."
  },
  {
    id: 1375666,
    title: "Inception",
    poster_path: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    release_date: "2010-07-16",
    vote_average: 8.3,
    overview: "Cobb, a skilled thief who is the absolute best in the dangerous art of extraction, steals valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive."
  },
  {
    id: 4633694,
    title: "Spider-Man: Into the Spider-Verse",
    poster_path: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    release_date: "2018-12-14",
    vote_average: 8.4,
    overview: "Miles Morales is juggling his life between being a high school student and being a spider-man. When Wilson 'Kingpin' Fisk uses a super collider, others from across the Spider-Verse are pulled into this dimension."
  },
  {
    id: 245429,
    title: "Spirited Away",
    poster_path: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    release_date: "2001-07-20",
    vote_average: 8.5,
    overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family."
  },
  {
    id: 1856101,
    title: "Blade Runner 2049",
    poster_path: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?auto=format&fit=crop&w=1200&q=80",
    release_date: "2017-10-06",
    vote_average: 7.5,
    overview: "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos."
  },
  {
    id: 6710474,
    title: "Everything Everywhere All at Once",
    poster_path: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    release_date: "2022-03-24",
    vote_average: 7.8,
    overview: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led."
  },
  {
    id: 15398776,
    title: "Oppenheimer",
    poster_path: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=1200&q=80",
    release_date: "2023-07-21",
    vote_average: 8.1,
    overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb, changed the course of history forever."
  },
  {
    id: 172495,
    title: "Gladiator",
    poster_path: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1510519138101-570d1dca3d66?auto=format&fit=crop&w=1200&q=80",
    release_date: "2000-05-01",
    vote_average: 8.2,
    overview: "In the year 180, the death of Emperor Marcus Aurelius throws the Roman Empire into chaos. Maximus Decimus Meridius is one of the Roman army's most capable and trusted generals and a key advisor to Marcus Aurelius. As Marcus' devious son Commodus ascends to the throne, Maximus is condemned to death and becomes a gladiator gladiating in the Colosseum."
  },
  {
    id: 3829266,
    title: "Whiplash",
    poster_path: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    release_date: "2014-10-10",
    vote_average: 8.4,
    overview: "Under the direction of a ruthless instructor, a talented young drummer begins his pursuit of perfection at an elite conservatory, pushing himself to the brink of sanity."
  },
  {
    id: 2096627,
    title: "Inside Out",
    poster_path: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
    release_date: "2015-06-17",
    vote_average: 7.9,
    overview: "After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions - Joy, Fear, Anger, Disgust and Sadness - conflict on how best to navigate a new city, house and school."
  }
];

// Server-side Logging
console.log("TMDB Proxy Initialized.");
console.log("Using API Key (masked):", API_KEY ? `${API_KEY.substring(0, 4)}...${API_KEY.slice(-4)}` : "None");

// Endpoint to status check the API key from frontend
app.get("/api/movies/status", (req, res) => {
  res.json({
    isConfigured: !!API_KEY && API_KEY !== "YOUR_API_KEY" && isValidTmdbKey(API_KEY) && !isKeyInvalid,
    maskedKey: API_KEY ? `${API_KEY.substring(0, 4)}...${API_KEY.slice(-4)}` : "None"
  });
});

// Server API Routes
app.get("/api/movies/popular", async (req, res) => {
  const page = parseInt(req.query.page || "1", 10);
  
  if (isKeyInvalid || !API_KEY || API_KEY === "YOUR_API_KEY" || !isValidTmdbKey(API_KEY)) {
    // Return backup offline paginated results
    const itemsPerPage = 8;
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedResults = FALLBACK_MOVIES.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(FALLBACK_MOVIES.length / itemsPerPage);
    return res.json({
      page: page,
      results: paginatedResults,
      total_pages: totalPages,
      total_results: FALLBACK_MOVIES.length,
      fallback: true
    });
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
        language: "en-US",
        page: page,
      },
    });
    res.json({
      ...response.data,
      fallback: false
    });
  } catch (err) {
    const errCode = err.response?.status;
    const errData = err.response?.data ? JSON.stringify(err.response.data) : "";
    const errMsg = err.message || err;
    const errorLogDetails = err.response 
      ? `status: ${errCode}${errData ? `, body: ${errData}` : ""}` 
      : `message: ${errMsg}`;

    console.warn(`Gracefully proxying popular movies error to warn level: ${errorLogDetails}`);
    
    const isAuthError = errCode === 401 || errCode === 403;
    if (isAuthError) {
      isKeyInvalid = true;
      console.warn("API token evaluated as invalid on TMDB server. Falling back to offline fallback data.");
    }
    
    // Smooth fallback instead of crashing with a 401
    const itemsPerPage = 8;
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedResults = FALLBACK_MOVIES.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(FALLBACK_MOVIES.length / itemsPerPage);
    res.json({
      page: page,
      results: paginatedResults,
      total_pages: totalPages,
      total_results: FALLBACK_MOVIES.length,
      fallback: true,
      error_occurred: errMsg
    });
  }
});

app.get("/api/movies/search", async (req, res) => {
  const query = req.query.query || "";
  const page = parseInt(req.query.page || "1", 10);
  
  const getOfflineSearchFallback = () => {
    const lowerQuery = query.toLowerCase().trim();
    const filtered = FALLBACK_MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(lowerQuery) ||
        m.overview.toLowerCase().includes(lowerQuery)
    );
    const itemsPerPage = 8;
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedResults = filtered.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    return {
      page: page,
      results: paginatedResults,
      total_pages: totalPages,
      total_results: filtered.length,
      fallback: true
    };
  };

  if (!query) {
    return res.json({ page: 1, results: [], total_pages: 1, total_results: 0, fallback: false });
  }

  if (isKeyInvalid || !API_KEY || API_KEY === "YOUR_API_KEY" || !isValidTmdbKey(API_KEY)) {
    return res.json(getOfflineSearchFallback());
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
        language: "en-US",
        page: page,
        include_adult: false,
      },
    });
    res.json({
      ...response.data,
      fallback: false
    });
  } catch (err) {
    const errCode = err.response?.status;
    const errData = err.response?.data ? JSON.stringify(err.response.data) : "";
    const errMsg = err.message || err;
    const errorLogDetails = err.response 
      ? `status: ${errCode}${errData ? `, body: ${errData}` : ""}` 
      : `message: ${errMsg}`;

    console.warn(`Gracefully proxying search movies error to warn level: ${errorLogDetails}`);
    
    const isAuthError = errCode === 401 || errCode === 452 /* or 403 */;
    if (isAuthError || errCode === 403) {
      isKeyInvalid = true;
      console.warn("API token evaluated as invalid on TMDB search. Falling back to search fallback offline.");
    }
    res.json({
      ...getOfflineSearchFallback(),
      error_occurred: errMsg
    });
  }
});

// Vite Integration
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
