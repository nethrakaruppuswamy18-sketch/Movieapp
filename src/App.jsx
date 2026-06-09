import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { FavoritesProvider as FavProv } from "./context/FavoritesContext";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Favorites } from "./pages/Favorites";
import { Film } from "lucide-react";

export default function App() {
  return (
    <FavProv>
      <Router>
        <div className="flex min-h-screen flex-col bg-gray-950 text-gray-100 selection:bg-rose-500/30 selection:text-white font-sans antialiased">
          {/* Header Bar */}
          <Navbar />

          {/* Active Route Render Content */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          {/* Core Footer Segment */}
          <footer className="border-t border-gray-900 bg-gray-950 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Film className="h-4 w-4 text-red-500/70" />
                  <span className="text-xs font-mono tracking-wider">
                    © 2026 CineTrack. All rights reserved.
                  </span>
                </div>
                <div className="text-center sm:text-right">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 block">
                    Data provided by TMDB API.
                  </span>
                  <span className="text-[10px] text-gray-600 block mt-0.5">
                    Not endorsed or certified by TMDB.
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </FavProv>
  );
}
