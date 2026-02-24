"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Star } from "lucide-react";

export default function SearchResultCard({
  listing,
  favourites = [],
  setFavourites,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const listingId = Number(listing.listing_id);
  const isSaved = favourites.includes(listingId);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const firstImage =
    listing.listing_media?.find((m) => m.file_type === "image") || null;

  const bannerImageUrl = firstImage
    ? `${baseUrl}${firstImage.file_path}`
    : null;

  const formatPrice = () =>
    listing.pricing_model === "custom_quote"
      ? "Custom Quote"
      : `₹${listing.max_price?.toLocaleString() || "0"}`;

  const handleFavourite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to save favourites");
      return;
    }

    try {
      if (isSaved) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/favourites/${listingId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFavourites((prev) => prev.filter((id) => id !== listingId));
      } else {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/favourites/${listingId}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFavourites((prev) => [...prev, listingId]);
      }
    } catch (error) {
      console.error("Favourite error:", error);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative w-full md:w-60 h-40 bg-gray-100">
          {bannerImageUrl ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gray-200" />
              )}
              <img
                src={bannerImageUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-3xl">
              📦
            </div>
          )}

          {/* Favourite Button */}
          <button
            onClick={handleFavourite}
            className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow"
          >
            <svg
              className={`w-4 h-4 ${
                isSaved ? "text-red-500" : "text-gray-400"
              }`}
              fill={isSaved ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4 4 0 015.657 0L12 8.343l2.025-2.025a4 4 0 015.657 5.657L12 20.657 4.318 11.975a4 4 0 010-5.657z"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <h3 className="text-lg font-semibold mb-1 line-clamp-2">
            {listing.title}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {listing.description}
          </p>

          <p className="text-indigo-600 font-semibold mb-2">
            {formatPrice()}
          </p>

          {listing.service_cities && (
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <MapPin className="w-3 h-3 mr-1" />
              {Array.isArray(listing.service_cities)
                ? listing.service_cities.join(", ")
                : listing.service_cities}
            </div>
          )}

          <Link
            href={`/listings/${listing.listing_id}`}
            className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded"
          >
            <Phone className="w-4 h-4" />
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}