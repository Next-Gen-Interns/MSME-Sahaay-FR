"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "../components/Products/ProductCard";

export default function FavoritesPage() {
  const router = useRouter();
  const [favourites, setFavourites] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async (pageNumber = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/favourites/detailed?page=${pageNumber}&limit=6`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      console.log("Favorites response:", data);

      if (res.ok) {
        setFavourites(data.favourites);
        setPagination(data.pagination);
        setPage(pageNumber);
      }
    } catch (err) {
      console.error("Failed to fetch favourites", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites(1);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!localStorage.getItem("token")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please login to view favourites
      </div>
    );
  }

  if (!Array.isArray(favourites) || favourites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        You haven’t saved anything yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Favourites</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {favourites.map((fav) => (
            <div key={fav.favourite_id}>
              <ProductCard
                listing={fav.listing}
                favourites={favourites.map((f) => f.listing.listing_id)}
                setFavourites={() => fetchFavorites(page)}
              />

              <p className="text-xs text-gray-400 mt-1">
                Saved on {new Date(fav.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pagination.pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => fetchFavorites(i + 1)}
                className={`px-3 py-1 text-sm rounded ${
                  page === i + 1 ? "bg-blue-600 text-white" : "bg-white border"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
