import React from "react";
import { Star, Heart, Calendar } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { getPosterUrl } from "../services/tmdbApi";
import { motion } from "motion/react";

export function MovieCard({ movie }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(movie.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (favorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  // Extract year from release date
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  // Format rating to 1 decimal place
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "0.0";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 shadow-xl transition-all duration-300 hover:border-red-500/30 hover:shadow-2xl hover:shadow-red-950/10"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-950">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={`${movie.title} Poster`}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900/80 border border-gray-800 backdrop-blur-sm text-gray-300 transition-all hover:bg-gray-900 hover:scale-110 active:scale-95"
        >
          <motion.div
            animate={{ scale: favorite ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                favorite ? "fill-rose-500 stroke-rose-400 text-rose-500" : "text-gray-300 hover:text-rose-400"
              }`}
            />
          </motion.div>
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 rounded-lg bg-gray-950/90 border border-gray-800 px-2.5 py-1 text-xs font-bold font-mono text-amber-400 backdrop-blur-xs">
          <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-450" />
          <span>{rating}</span>
        </div>

        {/* Overview Slide-up Panel on Hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full transform bg-gradient-to-t from-gray-950 via-gray-950 p-4 transition-transform duration-300 ease-out group-hover:translate-y-0 max-h-[75%] overflow-y-auto custom-scrollbar">
          <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1.5">Synopsis</h4>
          <p className="text-xs leading-relaxed text-gray-300">
            {movie.overview || "No overview available for this cinematic masterpiece."}
          </p>
        </div>
      </div>

      {/* Meta Text details container */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="line-clamp-1 font-sans text-base font-semibold leading-snug text-white group-hover:text-red-400 transition-colors duration-200" title={movie.title}>
          {movie.title}
        </h3>
        
        <div className="mt-2 flex items-center justify-between text-xs font-mono text-gray-400">
          <span className="flex items-center space-x-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{releaseYear}</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-gray-800 border border-gray-700/60">
            Movie
          </span>
        </div>
      </div>
    </motion.div>
  );
}
