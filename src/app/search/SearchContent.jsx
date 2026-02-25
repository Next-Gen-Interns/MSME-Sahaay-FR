"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/app/components/Products/ProductCard";
import FiltersSidebar from "./FiltersSidebar";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || 1);

  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/search?${searchParams.toString()}`,
        );

        const data = await res.json();

        if (data.success) {
          setResults(data.results);
          setTotalPages(data.totalPages || 1);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search fetch error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams, query]);

  const changePage = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6">
          Search Results for: <span className="text-indigo-600">{query}</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FiltersSidebar />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading && (
              <div className="text-center py-10 text-gray-500">
                Searching...
              </div>
            )}

            {!loading && results.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="text-4xl mb-3">🔍</div>

                <h2 className="text-lg font-semibold mb-2">
                  No services found
                </h2>

                {(searchParams.get("city") ||
                  searchParams.get("state") ||
                  searchParams.get("country")) && (
                  <p className="text-gray-600 mb-4">
                    No services found in{" "}
                    <span className="font-medium text-indigo-600">
                      {[
                        searchParams.get("city"),
                        searchParams.get("state"),
                        searchParams.get("country"),
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                    .
                  </p>
                )}

                <p className="text-sm text-gray-500 mb-6">
                  Try removing location filters or expanding your search.
                </p>

                {(searchParams.get("city") ||
                  searchParams.get("state") ||
                  searchParams.get("country")) && (
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(
                        searchParams.toString(),
                      );

                      params.delete("city");
                      params.delete("state");
                      params.delete("country");
                      params.set("page", "1");

                      router.push(`/search?${params.toString()}`);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  >
                    Remove Location Filters
                  </button>
                )}
              </div>
            )}

            {!loading && results.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {results.map((listing) => (
                    <ProductCard
                      key={listing.listing_id}
                      listing={listing}
                      favourites={favourites}
                      setFavourites={setFavourites}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => changePage(i + 1)}
                        className={`px-4 py-2 text-sm rounded border ${
                          page === i + 1
                            ? "bg-indigo-600 text-white"
                            : "bg-white"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
