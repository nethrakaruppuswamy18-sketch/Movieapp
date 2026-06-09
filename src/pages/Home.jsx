import { useState, useEffect, useCallback } from "react";
import { fetchPopularMovies, searchMovies, isApiConfigured } from "../services/tmdbApi";
import { SearchBar } from "../components/SearchBar";
import { MovieCard } from "../components/MovieCard";
import { Loader } from "../components/Loader";
import { Pagination } from "../components/Pagination";
import { AlertCircle, AlertTriangle, Key, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasKey, setHasKey] = useState(isApiConfigured());

  useEffect(() => {
    const handleStatusChange = () => {
      setHasKey(isApiConfigured());
    };
    window.addEventListener("api-key-status-changed", handleStatusChange);
    return () => {
      window.removeEventListener("api-key-status-changed", handleStatusChange);
    };
  }, []);

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (query.trim() === "") {
        data = await fetchPopularMovies(page);
      } else {
        data = await searchMovies(query, page);
      }
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err.message || "Something went wrong while loading movies.");
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  // Memoized search handler
  const handleSearch = useCallback((newQuery) => {
    setQuery(newQuery);
    setPage(1); // Reset to first page on search
  }, []);

  // Memoized page alteration
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-red-950/40 text-red-400 px-3 py-1 text-xs font-semibold border border-red-900/30 mb-4 select-none">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Discover your next cinematic obsession</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400">
            Unlimited Movies to Track
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Browse through trending blockbusters, search for all-time favorites, and instantly bookmark movies you want to save.
          </p>
        </motion.div>
      </div>

      {/* API Key Missing - Warning Alert */}
      {!hasKey && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-amber-950/20 border border-amber-900/30 p-4 max-w-2xl mx-auto"
        >
          <div className="flex items-start space-x-3 text-amber-400">
            <Key className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm">Demo Mode Active</h3>
              <p className="text-xs text-amber-300/80 mt-1 leading-relaxed">
                No active TMDB API key was found in your environment. We are loading a curated selection of movies so you can preview the app immediately! To browse live global movies, add your key to <strong>VITE_TMDB_API_KEY</strong> in your <code>.env</code> file.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Interactive Search Bar */}
      <div className="py-2">
        <SearchBar onSearch={handleSearch} initialValue={query} />
      </div>

      {/* Error & Retry Fallback */}
      {error && !loading && (
        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6 text-center max-w-xl mx-auto space-y-4">
          <div className="flex justify-center text-red-500">
            <AlertCircle className="h-12 w-12 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">Failed to retrieve data</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{error}</p>
          </div>
          <button
            onClick={loadMovies}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Main Movie Output */}
      {!error && (
        <div>
          {loading ? (
            <Loader />
          ) : movies.length > 0 ? (
            <div className="space-y-8">
              {/* Grid Layout of Cards */}
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-x-6 sm:gap-y-8"
              >
                <AnimatePresence mode="popLayout">
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Page Navigator */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            /* No Results Found State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-gray-900/20 border border-gray-950 rounded-3xl"
            >
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-600 mb-4 stroke-[1.5]" />
              <h3 className="text-lg font-semibold text-white">No Movies Found</h3>
              <p className="max-w-xs mx-auto text-gray-400 text-sm mt-1 leading-relaxed">
                Could not find any matches for &ldquo;<span className="text-red-400 italic">{query}</span>&rdquo;. Check the spelling or browse standard categories instead.
              </p>
              <button
                onClick={() => handleSearch("")}
                className="mt-5 text-sm font-semibold text-red-500 hover:text-red-400 transition-colors"
              >
                Clear search query
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
