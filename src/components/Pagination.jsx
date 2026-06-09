import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-6 py-10">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-gray-800 bg-gray-900 text-sm font-medium text-gray-300 transition-all hover:bg-gray-800 hover:text-white disabled:opacity-40 disabled:hover:bg-gray-900 disabled:hover:text-gray-300 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Prev</span>
      </button>

      {/* Pages indicator */}
      <div className="flex items-center space-x-2">
        <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">Page</span>
        <span className="font-sans text-sm font-semibold text-white px-3 py-1.5 rounded-lg bg-gray-950 border border-gray-800/80">
          {currentPage}
        </span>
        <span className="font-mono text-xs text-gray-500">of</span>
        <span className="font-sans text-sm font-medium text-gray-400">
          {totalPages}
        </span>
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-gray-800 bg-gray-900 text-sm font-medium text-gray-300 transition-all hover:bg-gray-800 hover:text-white disabled:opacity-40 disabled:hover:bg-gray-900 disabled:hover:text-gray-300 disabled:cursor-not-allowed"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
