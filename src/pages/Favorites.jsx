import { useFavorites } from "../hooks/useFavorites";
import { MovieCard } from "../components/MovieCard";
import { HeartOff, Library, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all your saved favorites?")) {
      favorites.forEach((movie) => removeFavorite(movie.id));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header section with back button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to="/"
            className="inline-flex items-center space-x-1 text-sm font-medium text-gray-400 hover:text-white transition-colors mb-2 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Browse</span>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1.5 font-sans">
            My Saved Favorites
          </h1>
          <p className="text-gray-400 text-sm">
            You have saved{" "}
            <span className="text-red-500 font-bold">{favorites.length}</span>{" "}
            {favorites.length === 1 ? "movie" : "movies"} to watch.
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center justify-center space-x-1.5 rounded-xl border border-red-500/20 bg-red-950/20 px-4 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-650 hover:text-white hover:border-red-600 focus:outline-none"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All Favorites</span>
          </button>
        )}
      </div>

      {/* Main Grid display area */}
      <AnimatePresence mode="popLayout">
        {favorites.length > 0 ? (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-x-6 sm:gap-y-8"
          >
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </motion.div>
        ) : (
          /* Empty State Section */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center border border-gray-900 bg-gray-900/10 rounded-3xl py-24 px-4 text-center max-w-xl mx-auto space-y-5"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-rose-500 border border-gray-800 shadow-inner">
              <HeartOff className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">No Favorite Movies Yet</h2>
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                Start building your personalized library! Click the heart badge on any poster image while exploring the homepage.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/20 transition-all hover:brightness-110"
            >
              <Library className="h-4 w-4" />
              <span>Browse Catalog</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
