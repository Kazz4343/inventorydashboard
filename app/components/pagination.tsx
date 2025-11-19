// interface PaginationProps {
//     currentPage: number;
//     totalPages: number;
//     baseUrl: string;
//     searchParams: Record<string, string>;
// }

import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function Pagination ({
    currentPages, 
    totalPages,
    baseUrl,
    searchParams
    }: {
        currentPages : number,
        totalPages : number,
        baseUrl: string,
        searchParams : Record<string, string>
}) {
    if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams({ ...searchParams, page: String(page) });
    return `${baseUrl}?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPages - delta);
      i <= Math.min(totalPages - 1, currentPages + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPages - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPages + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="flex items-center justify-center gap-1">
      <Link
        href={getPageUrl(currentPages - 1)}
        className={`flex items-center px-3 py-2 text-sm font-meium rounded-lg ${
          currentPages <= 1
            ? "text-gray-400 cursor-not-allowed bg-gray-100"
            : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
        }`}
        aria-disabled={currentPages <= 1}
      >
        <ChevronLeft /> Prevous
      </Link>

      {visiblePages.map((page, key) => {
        if (page === "...") {
          return (
            <span key={key} className="px-3 py-2 text-sm text-gray-500">
              ...
            </span>
          );
        }

        const pageNumber = page as number;
        const isCurrentPage = pageNumber === currentPages;

        return (
          <Link
            key={key}
            href={getPageUrl(pageNumber)}
            className={`px-3 py-2 text-sm font-medium rounded-lg ${
              isCurrentPage
                ? "bg-purple-600 text-white"
                : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
            }`}
          >
            {pageNumber}
          </Link>
        );
      })}

      <Link
        href={getPageUrl(currentPages + 1)}
        className={`flex items-center px-3 py-2 text-sm font-meium rounded-lg ${
          currentPages >= totalPages
            ? "text-gray-400 cursor-not-allowed bg-gray-100"
            : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
        }`}
        aria-disabled={currentPages >= totalPages}
      >
        Next
        <ChevronRight />
      </Link>
    </nav>
  );
}