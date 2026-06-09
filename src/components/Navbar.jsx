import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Film, Heart, Menu, X, Globe, Key } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { isApiConfigured } from "../services/tmdbApi";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const { favorites } = useFavorites();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [keyConfigured, setKeyConfigured] = useState(isApiConfigured());

  useEffect(() => {
    const handleStatusChange = () => {
      setKeyConfigured(isApiConfigured());
    };
    window.addEventListener("api-key-status-changed", handleStatusChange);
    return () => {
      window.removeEventListener("api-key-status-changed", handleStatusChange);
    };
  }, []);

  const navLinks = [
    { name: "Browse Movies", path: "/" },
    { name: "My Favorites", path: "/favorites", badge: favorites.length },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-lg shadow-red-950/30 transition-transform group-hover:scale-105">
              <Film className="h-5 w-5" />
            </div>
            <span className="font-sans text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              CineTrack
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-900"
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    {link.name === "My Favorites" && (
                      <Heart
                        className={`h-4 w-4 ${
                          isActive ? "fill-rose-500 stroke-rose-500" : "text-gray-400"
                        }`}
                      />
                    )}
                    <span>{link.name}</span>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-gray-950">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-rose-500 to-red-500"
                    />
                  )}
                </Link>
              );
            })}

            {/* API Status Badge */}
            <div className="pl-4 border-l border-gray-800 ml-4">
              {keyConfigured ? (
                <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-950/40 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-900/30">
                  <Globe className="h-3.5 w-3.5 animate-pulse" />
                  <span>TMDB Live</span>
                </span>
              ) : (
                <span
                  title="Running in Demo Mode with offline fallback movies. Add VITE_TMDB_API_KEY to connect live TMDB database!"
                  className="inline-flex items-center space-x-1 rounded-full bg-amber-950/40 px-2.5 py-1 text-xs font-medium text-amber-400 border border-amber-900/30 cursor-help"
                >
                  <Key className="h-3.5 w-3.5" />
                  <span>Demo Mode</span>
                </span>
              )}
            </div>
          </div>

          {/* User Email & Hamburger */}
          <div className="flex items-center space-x-4">
            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-900 hover:text-white focus:outline-none md:hidden"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-gray-800 bg-gray-950"
          >
            <div className="space-y-1 px-4 py-3 pb-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium ${
                      isActive
                        ? "bg-gray-900 text-white border-l-4 border-rose-500"
                        : "text-gray-400 hover:bg-gray-900 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      {link.name === "My Favorites" && (
                        <Heart className="h-5 w-5 stroke-rose-500 fill-rose-500" />
                      )}
                      <span>{link.name}</span>
                    </span>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-xs font-bold text-white">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Mobile API Status Indicators */}
              <div className="px-4 py-3 border-t border-gray-800 mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-400">Connection Status</span>
                {keyConfigured ? (
                  <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-950/40 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-900/30">
                    <Globe className="h-3 w-3 animate-pulse" />
                    <span>TMDB Live</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 rounded-full bg-amber-950/40 px-2.5 py-1 text-xs font-medium text-amber-400 border border-amber-900/30">
                    <Key className="h-3 w-3" />
                    <span>Demo Mode (Fallback active)</span>
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
