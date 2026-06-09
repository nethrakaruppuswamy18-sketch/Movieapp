import axios from "axios";

// Create an Axios instance pointing to our local server-side API proxy
const tmdbClient = axios.create({
  baseURL: "/api/movies"
});

// Real-time API status tracked client-side
let apiLive = true;

export const isApiConfigured = () => {
  return apiLive;
};

// Dispatches a visual alert state to components when key validity changes
const setApiLiveStatus = (status) => {
  if (apiLive !== status) {
    apiLive = status;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("api-key-status-changed"));
    }
  }
};

// Run a background task to fetch current configuration on initialization
const initConfig = async () => {
  try {
    const response = await axios.get("/api/movies/status");
    setApiLiveStatus(!!response.data.isConfigured);
  } catch (err) {
    console.warn("Failed to retrieve TMDB status config, default to live mode:", err);
  }
};
initConfig();

/**
 * Resolves a movie's poster path fully.
 */
export const getPosterUrl = (path) => {
  if (!path) {
    return "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=80";
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `https://image.tmdb.org/t/p/w500${path}`;
};

/**
 * Resolves a movie's backdrop path fully.
 */
export const getBackdropUrl = (path) => {
  if (!path) {
    return "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80";
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `https://image.tmdb.org/t/p/original${path}`;
};

/**
 * Fetches popular movies from local proxy.
 * @param {number} page page number
 */
export async function fetchPopularMovies(page = 1) {
  try {
    const response = await tmdbClient.get("/popular", {
      params: { page }
    });

    // Toggle badge live/demo state depending on backend response
    if (response.data.fallback) {
      setApiLiveStatus(false);
    } else {
      setApiLiveStatus(true);
    }

    return {
      page: response.data.page,
      results: response.data.results,
      total_pages: Math.min(response.data.total_pages, 500),
      total_results: response.data.total_results
    };
  } catch (err) {
    console.error("Error fetching popular movies from proxy:", err);
    setApiLiveStatus(false);
    throw new Error(
      err.response?.data?.status_message || 
      err.message ||
      "Failed to load movies. Please check your network connection."
    );
  }
}

/**
 * Searches for movies by query string from local proxy.
 * @param {string} query text to search for
 * @param {number} page page number
 */
export async function searchMovies(query, page = 1) {
  if (!query || query.trim() === "") {
    return fetchPopularMovies(page);
  }
  try {
    const response = await tmdbClient.get("/search", {
      params: {
        query: query,
        page: page
      }
    });

    if (response.data.fallback) {
      setApiLiveStatus(false);
    } else {
      setApiLiveStatus(true);
    }

    return {
      page: response.data.page,
      results: response.data.results,
      total_pages: response.data.total_pages,
      total_results: response.data.total_results
    };
  } catch (err) {
    console.error("Error searching movies via proxy:", err);
    setApiLiveStatus(false);
    throw new Error(
      err.response?.data?.status_message || 
      err.message ||
      "Failed to search movies. Please check your network connection."
    );
  }
}
