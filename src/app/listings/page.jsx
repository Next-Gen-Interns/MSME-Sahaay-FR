"use client";

import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import SearchFilters from "../components/Products/SearchFilters";
import { smartSearchListings } from "../api/smartSearchAPI";
import { getCategories } from "../api/productsAPI";
import ProductCard from "../components/Products/ProductCard";
import {
  Search,
  FilterList,
  MyLocation,
  AddCircleOutline,
  Storefront,
  TrendingUp,
  Verified,
} from "@mui/icons-material";
import { detectUserLocation } from "../api/homeAPI";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCity, setCurrentCity] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [favourites, setFavourites] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    serviceType: "",
    city: "",
    category: "",
    featured: "",
    sortBy: "relevance",
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const locationFetched = useRef(false);

  const convertFiltersToApiParams = (filterObj) => {
    const apiParams = {};
    if (filterObj.search) apiParams.search = filterObj.search;
    if (filterObj.minPrice) apiParams.min_price = filterObj.minPrice;
    if (filterObj.maxPrice) apiParams.max_price = filterObj.maxPrice;
    if (filterObj.serviceType) apiParams.service_type = filterObj.serviceType;
    if (filterObj.city) apiParams.city = filterObj.city;
    if (filterObj.category) apiParams.category_id = filterObj.category;
    if (filterObj.featured) apiParams.featured = filterObj.featured;
    if (filterObj.sortBy) apiParams.sort_by = filterObj.sortBy;
    return apiParams;
  };

  useEffect(() => {
    const fetchFavourites = async () => {
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

        if (res.ok) {
          const favIds = data.map((fav) => Number(fav.listing_id));
          setFavourites(favIds);
        }
      } catch (error) {
        console.error("Failed to fetch favourites:", error);
      }
    };

    fetchFavourites();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const fetchListings = async (page = 1, filterParams = {}) => {
    try {
      setLoading(true);
      const searchParams = { page, limit: 12, ...filterParams };
      Object.keys(searchParams).forEach((key) => {
        if (
          searchParams[key] === "" ||
          searchParams[key] === null ||
          searchParams[key] === undefined
        ) {
          delete searchParams[key];
        }
      });
      const response = await smartSearchListings(searchParams);
      const data = response.data;
      setListings(data.listings || []);
      setPagination(data.pagination);
      setCurrentPage(page);
      setError("");
      if (data.detectedCity) {
        setCurrentCity(data.detectedCity);
        setFilters((prev) => ({ ...prev, city: data.detectedCity }));
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load listings.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationDetect = async (latitude, longitude) => {
    try {
      setLocationLoading(true);
      const response = await detectUserLocation({ latitude, longitude });
      const locationData = response.data?.data;
      const detectedCity = locationData.city || locationData.detectedCity;
      if (detectedCity) {
        setCurrentCity(detectedCity);
        const updatedFilters = { ...filters, city: detectedCity };
        setFilters(updatedFilters);
        await fetchListings(1, convertFiltersToApiParams(updatedFilters));
        toast.success(`Location set to ${detectedCity}`);
      } else {
        toast.error("Could not detect city from location");
      }
    } catch (error) {
      toast.error("Failed to detect location. Please enter city manually.");
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    if (locationFetched.current) return;
    const loadInitialData = async () => {
      locationFetched.current = true;
      try {
        await fetchListings();
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                await handleLocationDetect(
                  position.coords.latitude,
                  position.coords.longitude,
                );
              } catch {
                console.log("Background location detection failed");
              }
            },
            (error) => console.log("Location permission denied:", error),
            { timeout: 8000, enableHighAccuracy: false },
          );
        }
      } catch (error) {
        console.error("Initial data load failed:", error);
      }
    };
    loadInitialData();
  }, []);

  const handlePageChange = (page) => {
    fetchListings(page, convertFiltersToApiParams(filters));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchListings(1, convertFiltersToApiParams(updatedFilters));
  };

  const clearFilters = () => {
    const resetFilters = {
      search: "",
      minPrice: "",
      maxPrice: "",
      serviceType: "",
      city: "",
      category: "",
      featured: "",
      sortBy: "relevance",
    };
    setFilters(resetFilters);
    setCurrentCity(null);
    fetchListings(1);
    setMobileFiltersOpen(false);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== null,
  );

  if (loading && listings.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[var(--color-accent-700)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-gray-500 text-sm">Loading listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* ══════════════════════════════════════════
          SELLER TRUST BAR — top of page
      ══════════════════════════════════════════ */}
      <div className="bg-[var(--color-accent-900)]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center divide-x divide-[var(--color-accent-700)]">
            {[
              {
                icon: <Storefront sx={{ fontSize: 12 }} />,
                text: "5,000+ Active Sellers",
              },
              {
                icon: <Verified sx={{ fontSize: 12 }} />,
                text: "Verified Listings",
              },
              {
                icon: <TrendingUp sx={{ fontSize: 12 }} />,
                text: "Grow Your MSME",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-[var(--color-accent-300)] text-[10px] font-semibold px-4 first:pl-0"
              >
                {item.icon}
                {item.text}
              </div>
            ))}
          </div>
          <p className="sm:hidden text-[var(--color-accent-300)] text-[10px] font-semibold">
            5,000+ Verified Sellers on MSME Guru
          </p>
          <button
            onClick={() => router.push("/seller/create-listing")}
            className="flex-shrink-0 flex items-center gap-1.5 bg-white hover:bg-[var(--color-accent-50)] text-[var(--color-accent-800)] text-[11px] font-bold px-3 py-1.5 rounded transition-all"
          >
            <AddCircleOutline sx={{ fontSize: 13 }} />
            List Your Service — Free
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════
          TOP BAR — sticky
      ══════════════════════════════════ */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between gap-3">
            {/* Left: breadcrumb + title */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-1 h-6 rounded-full bg-[var(--color-accent-700)] flex-shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-0.5">
                  <span>Home</span>
                  <span>›</span>
                  <span className="text-[var(--color-accent-700)]">
                    Services
                  </span>
                  {currentCity && (
                    <>
                      <span>›</span>
                      <span className="text-[var(--color-accent-700)] truncate">
                        {currentCity}
                      </span>
                    </>
                  )}
                </div>
                <h1 className="text-sm font-bold text-gray-900 truncate">
                  {currentCity
                    ? `Services in ${currentCity}`
                    : "All Listed Services"}
                </h1>
              </div>
              <span className="flex-shrink-0 text-[10px] text-[var(--color-accent-700)] bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] px-2 py-0.5 rounded font-bold">
                {pagination?.total || 0} listings
              </span>
            </div>

            {/* Right: controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async (pos) => {
                      await handleLocationDetect(
                        pos.coords.latitude,
                        pos.coords.longitude,
                      );
                    });
                  }
                }}
                disabled={locationLoading}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-gray-600 hover:text-[var(--color-accent-700)] border border-gray-300 hover:border-[var(--color-accent-400)] bg-white rounded transition-all"
              >
                <MyLocation sx={{ fontSize: 13 }} />
                {locationLoading
                  ? "Detecting..."
                  : currentCity || "Set Location"}
              </button>

              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="text-[11px] font-semibold border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-500)]"
              >
                <option value="relevance">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest First</option>
              </select>

              <button
                onClick={() => router.push("/list-products")}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-[11px] font-bold rounded transition-colors"
              >
                <AddCircleOutline sx={{ fontSize: 13 }} />
                Add Listing
              </button>

              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 bg-white text-gray-700 text-[11px] font-semibold rounded"
              >
                <FilterList sx={{ fontSize: 13 }} />
                Filter
                {hasActiveFilters && (
                  <span className="w-4 h-4 bg-[var(--color-accent-700)] text-white rounded-full text-[9px] font-black flex items-center justify-center">
                    {
                      Object.values(filters).filter(
                        (v) => v !== "" && v !== null && v !== "relevance",
                      ).length
                    }
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          MAIN LAYOUT
      ══════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-4 items-start">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-[76px] space-y-3">
              {/* Filter Panel */}
              <div className="bg-white border border-gray-200 rounded-xs overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 bg-[var(--color-accent-800)]">
                  <h3 className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FilterList sx={{ fontSize: 13 }} />
                    Filter Results
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-[10px] text-[var(--color-accent-300)] hover:text-white font-semibold transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="p-3">
                  <SearchFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    currentCity={currentCity}
                    onLocationDetect={handleLocationDetect}
                    locationLoading={locationLoading}
                    compact={true}
                  />
                </div>
              </div>

              {/* Seller CTA Panel */}
              <div className="bg-white border border-[var(--color-accent-200)] rounded-xs overflow-hidden">
                <div className="px-3 py-2 bg-[var(--color-accent-50)] border-b border-[var(--color-accent-100)]">
                  <p className="text-[11px] font-bold text-[var(--color-accent-800)] flex items-center gap-1.5">
                    <Storefront sx={{ fontSize: 13 }} />
                    Sell on MSME Guru
                  </p>
                </div>
                <div className="p-3">
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                    Reach thousands of buyers. List your services for free.
                  </p>
                  <ul className="space-y-1.5 mb-3">
                    {[
                      "Free listing",
                      "Verified badge",
                      "Direct buyer leads",
                      "Pan-India reach",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-[11px] text-gray-600 font-medium"
                      >
                        <span className="w-3.5 h-3.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[8px] font-black flex-shrink-0">
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => router.push("/list-products")}
                    className="w-full py-2 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-[11px] font-bold rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <AddCircleOutline sx={{ fontSize: 13 }} />
                    Post Free Listing
                  </button>
                  <button
                    onClick={() => router.push("/my-leads")}
                    className="w-full mt-2 py-1.5 border border-[var(--color-accent-300)] text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] text-[11px] font-semibold rounded transition-colors"
                  >
                    View My Leads →
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-3 px-3 py-2.5 bg-white border border-gray-200 rounded-xs">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Filtered by:
                </span>
                {filters.search && (
                  <FilterChip
                    label={`"${filters.search}"`}
                    onRemove={() => handleFilterChange({ search: "" })}
                  />
                )}
                {filters.minPrice && (
                  <FilterChip
                    label={`Min ₹${filters.minPrice}`}
                    onRemove={() => handleFilterChange({ minPrice: "" })}
                  />
                )}
                {filters.maxPrice && (
                  <FilterChip
                    label={`Max ₹${filters.maxPrice}`}
                    onRemove={() => handleFilterChange({ maxPrice: "" })}
                  />
                )}
                {filters.category && (
                  <FilterChip
                    label={
                      categories.find((c) => c.id == filters.category)?.name ||
                      filters.category
                    }
                    onRemove={() => handleFilterChange({ category: "" })}
                  />
                )}
                {filters.city && (
                  <FilterChip
                    label={`📍 ${filters.city}`}
                    onRemove={() => handleFilterChange({ city: "" })}
                  />
                )}
                <button
                  onClick={clearFilters}
                  className="ml-auto text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors"
                >
                  Clear all ×
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!error && listings.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {listings.map((listing) => (
                  <ProductCard
                    key={listing.listing_id}
                    listing={listing}
                    className="hover:shadow-md transition-all duration-200 border border-gray-200 bg-white rounded-sm"
                  />
                ))}
              </div>
            )}

            {/* Loading Skeletons */}
            {loading && listings.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white rounded-xs border border-gray-200 overflow-hidden"
                  >
                    <div className="bg-gray-100 h-40 w-full" />
                    <div className="p-4 space-y-2.5">
                      <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {listings.length === 0 && !loading && !error && (
              <div className="bg-white border border-gray-200 rounded-xs overflow-hidden">
                <div className="text-center py-10 border-b border-gray-100">
                  <div className="w-12 h-12 bg-[var(--color-accent-50)] border border-[var(--color-accent-100)] rounded flex items-center justify-center mx-auto mb-3">
                    <Search
                      sx={{ fontSize: 22, color: "var(--color-accent-400)" }}
                    />
                  </div>
                  <h3 className="text-base font-bold text-gray-800 mb-1">
                    No services found
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {hasActiveFilters
                      ? "Try adjusting your filters or location"
                      : "No services listed yet in this category"}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-5 py-2 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-sm font-semibold rounded transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
                {/* Seller CTA inside empty */}
                <div className="px-6 py-5 bg-[var(--color-accent-50)] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[var(--color-accent-900)] mb-0.5">
                      🏪 Be the first seller in this category
                    </p>
                    <p className="text-xs text-[var(--color-accent-600)]">
                      Post your listing free and reach buyers instantly.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/list-products")}
                    className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-sm font-bold rounded transition-colors"
                  >
                    <AddCircleOutline sx={{ fontSize: 16 }} />
                    Post Free Listing
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-xs">
                <div className="w-12 h-12 bg-red-50 border border-red-100 rounded flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">⚠️</span>
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">
                  Unable to load services
                </h3>
                <p className="text-gray-400 text-sm mb-4">{error}</p>
                <button
                  onClick={() => fetchListings()}
                  className="px-5 py-2 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-sm font-semibold rounded transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Inline Seller CTA — between grid and pagination */}
            {listings.length > 0 && !error && (
              <div className="mt-4 bg-white border border-[var(--color-accent-100)] rounded-xs px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[var(--color-accent-50)] rounded flex items-center justify-center flex-shrink-0">
                    <Storefront
                      sx={{ fontSize: 18, color: "var(--color-accent-700)" }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Want to appear in this list?
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Post your service listing free and start getting leads
                      today.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/list-products")}
                  className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-xs font-bold rounded transition-colors whitespace-nowrap"
                >
                  <AddCircleOutline sx={{ fontSize: 14 }} />
                  Post Free Listing
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && !error && (
              <div className="flex items-center justify-between mt-3 bg-white border border-gray-200 rounded-xs px-4 py-3">
                <p className="text-[11px] text-gray-500">
                  Page{" "}
                  <span className="font-bold text-gray-800">{currentPage}</span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-800">
                    {pagination.pages}
                  </span>
                  {" · "}
                  <span className="font-bold text-gray-800">
                    {pagination.total}
                  </span>{" "}
                  listings
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-[11px] font-semibold border border-gray-300 bg-white hover:bg-[var(--color-accent-50)] hover:border-[var(--color-accent-400)] text-gray-600 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    ← Prev
                  </button>
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) pageNum = i + 1;
                      else if (currentPage <= 3) pageNum = i + 1;
                      else if (currentPage >= pagination.pages - 2)
                        pageNum = pagination.pages - 4 + i;
                      else pageNum = currentPage - 2 + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 text-[11px] font-semibold rounded border transition-all ${
                            currentPage === pageNum
                              ? "bg-[var(--color-accent-700)] text-white border-[var(--color-accent-700)]"
                              : "bg-white text-gray-600 border-gray-300 hover:bg-[var(--color-accent-50)] hover:border-[var(--color-accent-400)]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    },
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    className="px-3 py-1.5 text-[11px] font-semibold border border-gray-300 bg-white hover:bg-[var(--color-accent-50)] hover:border-[var(--color-accent-400)] text-gray-600 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          MOBILE FILTERS DRAWER
      ══════════════════════════════════ */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[300px] bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-accent-800)] flex-shrink-0">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FilterList sx={{ fontSize: 15 }} />
                Filter Services
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Seller shortcut in drawer */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--color-accent-50)] border-b border-[var(--color-accent-100)]">
              <p className="text-[11px] text-[var(--color-accent-700)] font-semibold">
                Are you a seller?
              </p>
              <button
                onClick={() => router.push("/list-products")}
                className="text-[10px] font-bold text-white bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] px-2.5 py-1 rounded transition-colors"
              >
                + Post Listing
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <SearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                currentCity={currentCity}
                onLocationDetect={handleLocationDetect}
                locationLoading={locationLoading}
                compact={true}
              />
            </div>

            <div className="flex gap-2 p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
              <button
                onClick={clearFilters}
                className="flex-1 py-2 border border-gray-300 bg-white hover:bg-gray-50 rounded text-sm font-semibold text-gray-700 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white rounded text-sm font-semibold transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Filter Chip ── */
const FilterChip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--color-accent-50)] text-[var(--color-accent-800)] border border-[var(--color-accent-200)] rounded text-[11px] font-semibold">
    {label}
    <button
      onClick={onRemove}
      className="ml-0.5 text-[var(--color-accent-400)] hover:text-[var(--color-accent-900)] font-bold leading-none transition-colors"
    >
      ×
    </button>
  </span>
);
