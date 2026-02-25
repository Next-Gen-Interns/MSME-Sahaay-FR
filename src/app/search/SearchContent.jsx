"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/app/components/Products/ProductCard";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState([]);

  const fetchFavouriteIds = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/favourites/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        const ids = data.map((f) => f.listing_id);
        setFavourites(ids);
      }
    } catch (error) {
      console.error("Failed to load favourites", error);
    }
  };

  useEffect(() => {
    if (!query) return;

    fetchFavouriteIds();

    const fetchResults = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/search?q=${query}`,
        );

        const data = await res.json();

        if (data.success) {
          setResults(data.results);
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
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6">
          Search Results for: <span className="text-indigo-600">{query}</span>
        </h1>

        {loading && (
          <div className="text-center py-10 text-gray-500">Searching...</div>
        )}

        {!loading && results.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No services found.
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((listing) => (
              <ProductCard
                key={listing.listing_id}
                listing={listing}
                favourites={favourites}
                setFavourites={setFavourites}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
