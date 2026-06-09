import { createContext, useState, useEffect } from "react";

export const FavoritesContext = createContext(undefined);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("movie_favorites");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse favorites from local storage", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("movie_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (movie) => {
    setFavorites((prev) => {
      if (prev.some((item) => item.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const isFavorite = (id) => {
    return favorites.some((item) => item.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
