"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import {
  getHomePageData,
  getSearchSuggestions,
  detectUserLocation,
} from "./api/homeAPI";
import {
  Factory,
  LocationOn,
  TrendingUp,
  RocketLaunch,
  Search,
} from "@mui/icons-material";
import { Award, BarChart3, Building2, ShieldCheck, Users2 } from "lucide-react";
import RatingStars from "./components/Ratings";
import Trendingtags from "./components/home/Trendingtags";

const COLORS = {
  primary: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    900: "#134e4a",
  },
  accent: {
    500: "#8b5cf6",
    600: "#7c3aed",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
};

// Fallback mock data
// const FALLBACK_DATA = {
//   categories: [
//     {
//       id: "1",
//       name: "Manufacturing",
//       count: 2314,
//       image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&h=300&fit=crop",
//       icon: "🏭",
//     },
//     {
//       id: "2",
//       name: "Retail",
//       count: 1842,
//       image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
//       icon: "🛍️",
//     },
//     {
//       id: "3",
//       name: "Handicrafts",
//       count: 956,
//       image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
//       icon: "🎨",
//     },
//     {
//       id: "4",
//       name: "Food & Beverage",
//       count: 1287,
//       image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
//       icon: "🍽️",
//     },
//     {
//       id: "5",
//       name: "Textiles",
//       count: 1743,
//       image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop",
//       icon: "🧵",
//     },
//     {
//       id: "6",
//       name: "Electronics",
//       count: 892,
//       image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
//       icon: "🔌",
//     },
//   ],
//   promoted: [],
//   listings: [],
//   reviews: [],
// };

// ============================================================================
// LOADING SCREEN COMPONENT
// ============================================================================

function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, var(--color-accent-50), var(--color-primary))",
      }}
    >
      <div className="text-center">
        <div className="relative">
          <div
            className="w-16 h-16 border-4 rounded-full animate-spin mx-auto"
            style={{
              borderColor: "var(--color-accent-200)",
              borderTopColor: "var(--color-accent-700)",
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-8 h-8 rounded-full animate-pulse"
              style={{
                backgroundColor: "var(--color-accent-700)",
              }}
            ></div>
          </div>
        </div>
        <p
          className="mt-4 font-medium"
          style={{
            color: "var(--color-accent-700)",
          }}
        >
          Loading MSME Guru...
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// HERO SECTION COMPONENT
// ============================================================================

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Check, ArrowRight } from "lucide-react";

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState("right");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const autoPlayRef = useRef(null);
  const panelRef = useRef(null);
  const heroRef = useRef(null);

  /* ===============================
     SLIDES DATA
  =============================== */
  const heroSlides = [
    {
      id: 1,
      title: "Connect Local Businesses",
      subtitle: "Grow Together",
      description:
        "Discover verified suppliers and connect with qualified buyers.",
      backgroundImage: "/imm8.png",
      fullTitle: "Connect Local Businesses & Grow Together",
      fullDescription:
        "MSME Sahaay connects you with verified businesses across India.",
      keyPoints: [
        "Verified Business Profiles",
        "Real-time Market Insights",
        "Smart Matchmaking",
        "Exclusive Networking",
      ],
      ctaText: "Start Networking",
      ctaLink: "/network",
    },
    {
      id: 2,
      title: "Find Quality Suppliers",
      subtitle: "Build Your Network",
      description: "Access verified manufacturers and wholesalers.",
      backgroundImage: "/imm9.png",
      fullTitle: "Find Quality Suppliers & Build Your Network",
      fullDescription: "Our supplier database ensures quality and reliability.",
      keyPoints: [
        "Quality Verified",
        "Bulk Discounts",
        "Delivery Tracking",
        "Rating System",
      ],
      ctaText: "Explore Suppliers",
      ctaLink: "/suppliers",
    },
    {
      id: 3,
      title: "Expand Your Market",
      subtitle: "Reach Customers",
      description: "Showcase products to active buyers.",
      backgroundImage: "/imm10.png",
      fullTitle: "Expand Your Market & Reach New Customers",
      fullDescription: "Grow your market reach with advanced tools.",
      keyPoints: [
        "Product Showcase",
        "Marketing Campaigns",
        "Sales Analytics",
        "Lead Generation",
      ],
      ctaText: "Grow Business",
      ctaLink: "/grow",
    },
  ];

  /* ===============================
     AUTOPLAY
  =============================== */
  useEffect(() => {
    if (!isAutoPlaying || isPanelOpen) return;

    autoPlayRef.current = setInterval(() => {
      setSlideDirection("right");
      setCurrentSlide((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying, isPanelOpen]);

  /* ===============================
     NAVIGATION
  =============================== */
  const goToSlide = useCallback((index, dir) => {
    setSlideDirection(dir);
    setCurrentSlide(index);
  }, []);

  const nextSlide = () =>
    goToSlide(
      currentSlide === heroSlides.length - 1 ? 0 : currentSlide + 1,
      "right",
    );

  const prevSlide = () =>
    goToSlide(
      currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1,
      "left",
    );

  /* ===============================
     PANEL CONTROL
  =============================== */
  const openPanel = () => {
    setIsPanelOpen(true);
    setIsAutoPlaying(false);
    clearInterval(autoPlayRef.current);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setIsAutoPlaying(true);
  };

  /* ===============================
     HERO CLICK
  =============================== */
  useEffect(() => {
    const handler = (e) => {
      if (!heroRef.current?.contains(e.target)) return;

      if (!e.target.closest("button") && !e.target.closest(".carousel-nav")) {
        openPanel();
      }
    };

    heroRef.current?.addEventListener("click", handler);

    return () => heroRef.current?.removeEventListener("click", handler);
  }, []);

  /* ===============================
     OUTSIDE CLICK
  =============================== */
  useEffect(() => {
    const handler = (e) => {
      if (!panelRef.current?.contains(e.target)) {
        closePanel();
      }
    };

    if (isPanelOpen) document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, [isPanelOpen]);

  /* ===============================
     PANEL ANIMATION
  =============================== */
  const panelVariants = {
    hidden: {
      x: window.innerWidth >= 768 ? "100%" : 0,
      y: window.innerWidth < 768 ? "100%" : 0,
    },
    visible: { x: 0, y: 0 },
    exit: {
      x: window.innerWidth >= 768 ? "100%" : 0,
      y: window.innerWidth < 768 ? "100%" : 0,
    },
  };

  /* ===============================
     UI
  =============================== */
  return (
    <section className="relative w-full bg-white overflow-x-hidden py-3 md:py-6 px-2 sm:px-4">
      <div className="max-w-8xl mx-auto">
        {/* HERO */}
        <div
          ref={heroRef}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => !isPanelOpen && setIsAutoPlaying(true)}
          className="
            relative
            w-full
            h-[65vh]
            sm:h-[420px]
            md:h-[600px]
            rounded-xs
            md:rounded-sm
            overflow-hidden
            shadow-xl
            cursor-pointer
            select-none
            touch-pan-y
          "
        >
          {/* SLIDES */}
          <AnimatePresence mode="wait">
            <motion.div
              key={heroSlides[currentSlide].id}
              initial={{
                opacity: 0,
                x: slideDirection === "right" ? 100 : -100,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: slideDirection === "right" ? -100 : 100,
              }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={heroSlides[currentSlide].backgroundImage}
                alt=""
                fill
                priority
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/30" />
            </motion.div>
          </AnimatePresence>

          {/* DOTS */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 carousel-nav">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(i, i > currentSlide ? "right" : "left");
                }}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === i ? "w-6 bg-white" : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>

          {/* ARROWS */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 rounded-full backdrop-blur flex items-center justify-center text-white active:scale-90"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 rounded-full backdrop-blur flex items-center justify-center text-white active:scale-90"
          >
            <ChevronRight />
          </button>

          {/* PANEL */}
          <AnimatePresence>
            {isPanelOpen && (
              <motion.div
                ref={panelRef}
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "spring", damping: 25 }}
                className="
                  absolute
                  right-0
                  bottom-0
                  md:top-0
                  w-full
                  md:w-1/2
                  h-[90%]
                  md:h-full
                  bg-white
                  shadow-2xl
                  z-30
                  flex
                  flex-col
                  rounded-t-2xl
                  md:rounded-none
                "
              >
                {/* HEADER */}
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="font-bold text-lg md:text-xl">
                    {heroSlides[currentSlide].fullTitle}
                  </h2>

                  <button
                    onClick={closePanel}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-4 md:p-6">
                  <p className="text-gray-700 mb-5 text-sm md:text-base">
                    {heroSlides[currentSlide].fullDescription}
                  </p>

                  <div className="space-y-3 mb-6">
                    {heroSlides[currentSlide].keyPoints.map((p, i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-3 bg-gray-50 rounded-xs"
                      >
                        <Check
                          size={16}
                          className="text-[var(--color-accent-600)] mt-1"
                        />
                        <span className="text-sm md:text-base">{p}</span>
                      </div>
                    ))}
                  </div>

                  {/* STATS */}
                  <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                    {[
                      ["10K+", "Businesses"],
                      ["95%", "Success"],
                      ["150+", "Cities"],
                    ].map(([v, t], i) => (
                      <div
                        key={i}
                        className="p-3 bg-[var(--color-accent-50)] rounded-xs"
                      >
                        <div className="font-bold text-[var(--color-accent-700)]">
                          {v}
                        </div>
                        <div className="text-xs text-gray-600">{t}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="w-full py-3 bg-[var(--color-accent-600)] text-white rounded-xs flex justify-center items-center gap-2 font-semibold hover:bg-[var(--color-accent-700)]">
                    {heroSlides[currentSlide].ctaText}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SEARCH FILTER BAR COMPONENT
// ============================================================================
function SearchFilterBar({
  searchQuery,
  selectedCategory,
  userLocation,
  onSearchChange,
  onCategoryChange,
  onLocationChange,
  categories,
}) {
  const router = useRouter();
  const popularCategories = categories.slice(0, 6);

  // Slugify function
  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/&/g, "& ")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Complete category selection handler
  const handleCategorySelect = (categoryId, categoryName) => {
    // Update state and fetch data
    onCategoryChange(categoryId);

    // Navigate to category page
    const slug = slugify(categoryName);
    router.push(`/categories/${slug}/${categoryId}`);
  };

  // Handle category dropdown
  const handleCategoryDropdownChange = (e) => {
    const categoryId = e.target.value;
    if (categoryId) {
      const selectedCat = categories.find((cat) => cat.id === categoryId);
      if (selectedCat) {
        handleCategorySelect(categoryId, selectedCat.name);
      }
    } else {
      onCategoryChange(""); // Clear selection
    }
  };

  // Handle popular category chips
  const handlePopularCategoryClick = (category) => {
    handleCategorySelect(category.id, category.name);
  };

  // Static filter options
  const priceRanges = [
    { value: "", label: "Any Price" },
    { value: "0-1000", label: "Under ₹1,000" },
    { value: "1000-5000", label: "₹1,000 - ₹5,000" },
    { value: "5000-10000", label: "₹5,000 - ₹10,000" },
    { value: "10000+", label: "Over ₹10,000" },
  ];

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "most-popular", label: "Most Popular" },
    { value: "highest-rated", label: "Highest Rated" },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-[var(--color-accent-100)] transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Row - 4 Filters Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={handleCategoryDropdownChange}
              className="w-full px-4 py-3 rounded-xs bg-white/80 backdrop-blur-sm text-[var(--color-accent-900)] font-sans font-medium transition-all duration-300 shadow-sm border border-[var(--color-accent-200)] hover:border-[var(--color-accent-300)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] cursor-pointer appearance-none"
            >
              <option value="" className="text-[var(--color-accent-600)]">
                All Categories
              </option>
              {categories.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                  className="text-[var(--color-accent-900)]"
                >
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-accent-500)] pointer-events-none">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Location Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <LocationOn className="h-5 w-5 text-[var(--color-accent-500)]" />
            </div>
            <input
              type="text"
              value={userLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="Enter location..."
              className="w-full pl-10 pr-4 py-3 rounded-xs bg-white/80 backdrop-blur-sm text-[var(--color-accent-900)] font-sans font-medium transition-all duration-300 shadow-sm border border-[var(--color-accent-200)] hover:border-[var(--color-accent-300)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)]"
            />
          </div>

          {/* Price Range Filter */}
          <div className="relative">
            <select className="w-full px-4 py-3 rounded-xs bg-white/80 backdrop-blur-sm text-[var(--color-accent-900)] font-sans font-medium transition-all duration-300 shadow-sm border border-[var(--color-accent-200)] hover:border-[var(--color-accent-300)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] cursor-pointer appearance-none">
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-accent-500)] pointer-events-none">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <select className="w-full px-4 py-3 rounded-xs bg-white/80 backdrop-blur-sm text-[var(--color-accent-900)] font-sans font-medium transition-all duration-300 shadow-sm border border-[var(--color-accent-200)] hover:border-[var(--color-accent-300)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] cursor-pointer appearance-none">
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-accent-500)] pointer-events-none">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex flex-wrap justify-center gap-3">
          <span className="text-sm font-sans font-semibold text-[var(--color-accent-700)] flex items-center">
            <span className="w-2 h-2 bg-[var(--color-accent-500)] rounded-xs mr-2 animate-pulse"></span>
            Popular Categories:
          </span>

          {popularCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handlePopularCategoryClick(category)}
              className={`inline-flex items-center px-4 py-2 rounded-xs text-sm font-sans font-medium transition-all duration-300 hover:scale-105 border
                ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-700)] text-white shadow-lg shadow-[var(--color-accent-500)]/30 border-[var(--color-accent-400)]"
                    : "bg-white/80 text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] border-[var(--color-accent-200)] hover:border-[var(--color-accent-300)] hover:shadow-md"
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STATS SECTION COMPONENT
// ============================================================================
function StatsSection({ stats }) {
  const statItems = [
    {
      label: "Active Listings",
      value: stats.totalListings || "10,000+",
      icon: <BarChart3 className="w-7 h-7" />,
      color: "bg-var(--color-accent-500)] to-[var(--color-accent-700)]",
    },
    {
      label: "Verified Sellers",
      value: stats.totalSellers || "5,000+",
      icon: <ShieldCheck className="w-7 h-7" />,
      color: "from-[var(--color-accent-400)] to-[var(--color-accent-600)]",
    },
    {
      label: "Business Buyers",
      value: stats.totalBuyers || "15,000+",
      icon: <Users2 className="w-7 h-7" />,
      color: "from-[var(--color-accent-300)] to-[var(--color-accent-500)]",
    },
    {
      label: "Success Stories",
      value: stats.totalLeads
        ? `${(stats.totalLeads / 1000).toFixed(0)}k+`
        : "50k+",
      icon: <Award className="w-7 h-7" />,
      color: "from-[var(--color-accent-600)] to-[var(--color-accent-900)]",
    },
  ];

  return (
    <section className="py-10 bg-white border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-7 rounded-full bg-[var(--color-accent-700)]" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              India's Fastest Growing MSME Platform
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Trusted by businesses across the country
            </p>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200 border border-gray-200 rounded-sm overflow-hidden bg-white">
          {statItems.map((stat, index) => (
            <div
              key={index}
              className="group relative flex items-center gap-4 px-6 py-5 hover:bg-[var(--color-accent-50)] transition-colors duration-150 cursor-default"
            >
              {/* Left accent bar on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--color-accent-700)] scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center" />

              {/* Icon */}
              <div className="w-11 h-11 flex-shrink-0 rounded bg-[var(--color-accent-800)] text-white flex items-center justify-center shadow-sm group-hover:bg-[var(--color-accent-900)] transition-colors duration-150">
                {stat.icon}
              </div>

              {/* Text */}
              <div>
                <div className="text-2xl font-extrabold text-gray-900 leading-none tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mt-1">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TOP CATEGORIES SECTION 1 COMPONENT
// ============================================================================
function TopCategoriesSection1({ topcategories, onCategorySelect }) {
  const router = useRouter();

  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    const slug = slugify(categoryName);
    router.push(`/categories/${slug}/${categoryId}`);
  };

  if (!topcategories || topcategories.length === 0) {
    return (
      <div className="w-full py-16 bg-gray-50 text-center">
        <h2 className="text-2xl font-bold text-gray-600">
          Loading categories...
        </h2>
      </div>
    );
  }

  // Get three categories
  const firstCategory = topcategories[0] || {};
  const secondCategory = topcategories[1] || {};
  const thirdCategory = topcategories[2] || {};

  // Get subcategories for each (6 each)
  const subCategories0 = (firstCategory?.subcategories || []).slice(0, 6);
  const subCategories1 = (secondCategory?.subcategories || []).slice(0, 6);
  const subCategories2 = (thirdCategory?.subcategories || []).slice(0, 6);

  // Function to render each category section
  const renderCategorySection = (category, subCategories, index) => (
    <div
      key={category.id || index}
      className="max-w-7xl mx-auto px-4 sm:px-6 mb-4"
    >
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        {/* ── Category Header Bar ── */}
        <div className="flex items-center justify-between bg-[var(--color-accent-800)] px-4 py-2.5">
          <h2 className="text-white font-bold text-base tracking-wide uppercase">
            {category?.name || `Category ${index + 1}`}
          </h2>
          <button
            onClick={() => handleCategoryClick(category.id, category.name)}
            className="text-[var(--color-accent-200)] hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            View All
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* ── Main Body ── */}
        <div className="flex flex-col sm:flex-row">
          {/* ── Left: Category Image Block ── */}
          <div className="sm:w-[200px] lg:w-[220px] flex-shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col">
            {/* Image */}
            <div className="relative h-40 sm:h-full min-h-[160px] overflow-hidden">
              <Image
                src={category?.image_url || "/placeholder-category.jpg"}
                alt={category?.name || `Category ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              {/* Subtle gradient at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            {/* View All button under image */}
            <button
              onClick={() => handleCategoryClick(category.id, category.name)}
              className="w-full py-2 text-xs font-bold text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] border-t border-gray-200 transition-colors bg-white flex items-center justify-center gap-1"
            >
              View All Products
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* ── Right: Subcategories Grid ── */}
          <div className="flex-1 p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0">
              {subCategories.map((subCategory, subIndex) => (
                <div
                  key={subCategory.id || subIndex}
                  onClick={() =>
                    handleCategoryClick(subCategory.id, subCategory.name)
                  }
                  className="group flex flex-col items-center text-center p-2.5 border border-transparent hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] rounded cursor-pointer transition-all duration-150"
                >
                  {/* Subcategory Image */}
                  <div className="relative w-16 h-16 mb-1.5 rounded overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                    <Image
                      src={
                        subCategory.image_url || "/placeholder-subcategory.jpg"
                      }
                      alt={subCategory.name || `Subcategory ${subIndex + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Subcategory Name */}
                  <p className="text-[11px] leading-tight font-semibold text-[var(--color-accent-800)] group-hover:text-[var(--color-accent-600)] line-clamp-2 transition-colors">
                    {subCategory.name || `Subcategory ${subIndex + 1}`}
                  </p>
                </div>
              ))}

              {/* "More categories" tile */}
              {subCategories.length > 0 && (
                <div
                  onClick={() =>
                    handleCategoryClick(category.id, category.name)
                  }
                  className="group flex flex-col items-center justify-center text-center p-2.5 border border-dashed border-[var(--color-accent-200)] hover:border-[var(--color-accent-400)] hover:bg-[var(--color-accent-50)] rounded cursor-pointer transition-all duration-150"
                >
                  <div className="w-16 h-16 mb-1.5 rounded bg-[var(--color-accent-100)] flex items-center justify-center group-hover:bg-[var(--color-accent-200)] transition-colors">
                    <svg
                      className="w-6 h-6 text-[var(--color-accent-600)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </div>
                  <p className="text-[11px] leading-tight font-bold text-[var(--color-accent-700)] group-hover:text-[var(--color-accent-900)] transition-colors">
                    View All
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-12 bg-white">
      <h2 className="text-center text-3xl font-semibold mb-8 text-gray-800">
        Top Categories
      </h2>

      {/* Render first category */}
      {firstCategory && renderCategorySection(firstCategory, subCategories0, 0)}

      {/* Render second category */}
      {secondCategory &&
        renderCategorySection(secondCategory, subCategories1, 1)}

      {/* Render third category */}
      {thirdCategory && renderCategorySection(thirdCategory, subCategories2, 2)}
    </section>
  );
}

// ============================================================================
// TOP CATEGORIES SECTION 2 COMPONENT
// ============================================================================
function TopCategoriesSection2({ onCategorySelect }) {
  const router = useRouter();

  // Section 2 mock data
  const CATEGORIES_SECTION2 = {
    section3: [
      {
        title: "Interior Design",
        img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop&auto=format",
      },
      {
        title: "Home Cleaning",
        img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop&auto=format",
      },
      {
        title: "Electricians",
        img: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop&auto=format",
      },
      {
        title: "Home Tutors",
        img: "https://images.unsplash.com/photo-1584697964358-3e14ca57658b?w=300&h=200&fit=crop&auto=format",
      },
      {
        title: "Pest Control",
        img: "https://images.unsplash.com/photo-1598791318878-10e76d178023?w=300&h=200&fit=crop&auto=format",
      },
    ],
    section4: [
      {
        title: "Wholesale Market",
        img: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=200&h=200&fit=crop&auto=format",
      },
      {
        title: "Manufacturing",
        img: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=200&h=200&fit=crop&auto=format",
      },
      {
        title: "IT Companies",
        img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&h=200&fit=crop&auto=format",
      },
      {
        title: "Coaching Classes",
        img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&h=200&fit=crop&auto=format",
      },
      {
        title: "Consulting",
        img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop&auto=format",
      },
    ],
  };

  const handleCategoryClick = (categoryName) => {
    const slug = categoryName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/categories/${slug}`);
  };

  return (
    <section className="py-10 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ── Section Title ── */}
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-[var(--color-accent-700)] pl-3">
          What are you looking for?
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ════════════════════════════
          LEFT BOX — Home Services
      ════════════════════════════ */}
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            {/* Box Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏠</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 leading-tight">
                    Home Services
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    Repairs, cleaning & more
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleCategoryClick("home-services")}
                className="text-xs font-semibold text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] hover:underline flex items-center gap-0.5 transition-colors"
              >
                View All
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Tiles Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-0 p-3">
              {CATEGORIES_SECTION2.section3.map((c, i) => (
                <div
                  key={i}
                  onClick={() => handleCategoryClick(c.title)}
                  className="group flex flex-col items-center text-center p-3 rounded cursor-pointer hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-150"
                >
                  {/* Circular Image */}
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-[var(--color-accent-400)] mb-2 flex-shrink-0 transition-colors duration-150 shadow-sm">
                    <Image
                      src={c.img}
                      alt={c.title}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Name */}
                  <span className="text-[11px] font-semibold text-gray-700 group-hover:text-[var(--color-accent-700)] leading-tight line-clamp-2 transition-colors duration-150">
                    {c.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ════════════════════════════
          RIGHT BOX — Professional Services
      ════════════════════════════ */}
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            {/* Box Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">💼</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 leading-tight">
                    Professional Services
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    Legal, finance & consulting
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleCategoryClick("professional-services")}
                className="text-xs font-semibold text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] hover:underline flex items-center gap-0.5 transition-colors"
              >
                View All
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Tiles Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-0 p-3">
              {CATEGORIES_SECTION2.section4.map((c, i) => (
                <div
                  key={i}
                  onClick={() => handleCategoryClick(c.title)}
                  className="group flex flex-col items-center text-center p-3 rounded cursor-pointer hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-150"
                >
                  {/* Circular Image */}
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-[var(--color-accent-400)] mb-2 flex-shrink-0 transition-colors duration-150 shadow-sm">
                    <Image
                      src={c.img}
                      alt={c.title}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Name */}
                  <span className="text-[11px] font-semibold text-gray-700 group-hover:text-[var(--color-accent-700)] leading-tight line-clamp-2 transition-colors duration-150">
                    {c.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TOP CATEGORIES SECTION 3 COMPONENT
// ============================================================================
function TopCategoriesSection3({ onCategorySelect }) {
  const router = useRouter();

  // Section 3 mock data
  const CATEGORIES_SECTION3 = {
    section5: [
      {
        title: "Travel Agencies",
        img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=350&h=250&fit=crop&auto=format",
      },
      {
        title: "Adventure Trips",
        img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=350&h=250&fit=crop&auto=format",
      },
      {
        title: "Tour Guides",
        img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=350&h=250&fit=crop&auto=format",
      },
      {
        title: "Luxury Resorts",
        img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=350&h=250&fit=crop&auto=format",
      },
    ],
  };

  const handleCategoryClick = (categoryName) => {
    const slug = categoryName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/categories/${slug}`);
  };

  const handleImageLoad = (e) => {
    e.target.style.opacity = "1";
  };

  const handleImageError = (e) => {
    e.target.src = `https://via.placeholder.com/${e.target.width}x${e.target.height}/f3f4f6/6b7280?text=${e.target.alt}`;
  };

  return (
    <section className="py-15 relative overflow-hidden bg-[var(--color-accent-900)]">
      {/* Atmospheric background texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, var(--color-accent-400) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, var(--color-accent-600) 0%, transparent 40%),
                        radial-gradient(circle at 60% 80%, var(--color-accent-500) 0%, transparent 45%)`,
        }}
      />

      {/* Decorative large text watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[20vw] font-black uppercase tracking-tighter text-white opacity-[0.03] whitespace-nowrap">
          Travel
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span
              className="inline-block text-xs font-bold tracking-[0.3em] uppercase
          text-[var(--color-accent-400)] mb-3"
            >
              ✦ &nbsp; Destinations
            </span>
            <h2 className="text-5xl sm:text-6xl font-black text-white leading-none tracking-tight">
              Explore <br />
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r
            from-[var(--color-accent-300)] to-[var(--color-accent-500)]"
              >
                Travel
              </span>
            </h2>
          </div>
          <p className="text-[var(--color-accent-400)] text-sm max-w-xs leading-relaxed md:text-right">
            Discover handpicked experiences and trusted professionals for every
            journey.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES_SECTION3.section5.map((c, i) => (
            <div
              key={i}
              onClick={() => handleCategoryClick(c.title)}
              className="group relative rounded-sm overflow-hidden cursor-pointer
            aspect-[3/4] shadow-2xl"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Full-bleed image */}
              <Image
                src={c.img}
                alt={c.title}
                fill
                className="object-cover transition-transform duration-700 ease-out
              group-hover:scale-110"
                loading="lazy"
              />

              {/* Dark gradient overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t
            from-black/80 via-black/20 to-black/10
            group-hover:from-black/90 group-hover:via-black/40
            transition-all duration-500"
              />

              {/* Top-right index badge */}
              <div
                className="absolute top-4 right-4 w-8 h-8 rounded-xs
            bg-white/10 backdrop-blur-sm border border-white/20
            flex items-center justify-center
            text-white/60 text-xs font-bold
            group-hover:bg-[var(--color-accent-500)] group-hover:text-white
            group-hover:border-[var(--color-accent-400)]
            transition-all duration-300"
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                {/* Animated tag line */}
                <div className="overflow-hidden mb-2">
                  <span
                    className="block text-[var(--color-accent-300)] text-xs font-semibold
                tracking-widest uppercase
                translate-y-full group-hover:translate-y-0
                transition-transform duration-400 ease-out"
                  >
                    Explore now →
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-white text-xl font-bold leading-tight tracking-tight
              group-hover:text-[var(--color-accent-200)] transition-colors duration-300"
                >
                  {c.title}
                </h3>

                {/* Underline bar */}
                <div className="mt-3 h-0.5 bg-white/20 rounded-xs overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-accent-400)] rounded-xs
                w-0 group-hover:w-full transition-all duration-500 ease-out"
                  />
                </div>
              </div>

              {/* Hover glow border */}
              <div
                className="absolute inset-0 rounded-xs ring-1 ring-inset ring-white/10
            group-hover:ring-[var(--color-accent-400)]/40
            transition-all duration-300 pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CATEGORY GRID COMPONENT
// ============================================================================

function CategoryGrid({ categories, onCategoryClick, loading }) {
  const router = useRouter();

  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleCategoryClick = (id, name) => {
    if (onCategoryClick) {
      onCategoryClick(id, name);
    }

    const slug = slugify(name);
    router.push(`/categories/${slug}/${id}`);
  };

  const handleViewAll = () => {
    router.push("/categories");
  };

  /* ===========================
      LOADING SKELETON
  ============================ */
  if (loading && categories.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 w-60 mx-auto bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 mx-auto mt-4 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ===========================
        MAIN UI
  ============================ */
  return (
    <section className="py-16 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 rounded-xs bg-[var(--color-accent-700)]" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                Browse Categories
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Discover business opportunities across multiple industries
              </p>
            </div>
          </div>
          <button
            onClick={handleViewAll}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] border border-[var(--color-accent-300)] hover:border-[var(--color-accent-500)] bg-white hover:bg-[var(--color-accent-50)] px-4 py-1.5 rounded transition-all duration-150"
          >
            View All
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* ── Category Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-0 bg-white border border-gray-200 rounded-xs overflow-hidden">
          {categories.slice(0, 8).map((category, index) => {
            const image =
              category.image_url || category.image || "/default-category.jpg";

            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id, category.name)}
                className={`
              group relative flex flex-col items-center justify-start
              p-4 cursor-pointer
              border-gray-200 hover:bg-[var(--color-accent-50)]
              transition-all duration-150
              ${index !== 0 ? "border-l" : ""}
              ${index >= 4 ? "border-t" : ""}
            `}
              >
                {/* Image */}
                <div className="relative w-16 h-16 mb-2.5 overflow-hidden rounded-sm bg-gray-50 border border-gray-100 flex-shrink-0">
                  <Image
                    src={image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Name */}
                <p className="text-[11px] font-semibold text-gray-700 group-hover:text-[var(--color-accent-700)] text-center leading-tight line-clamp-2 transition-colors">
                  {category.name}
                </p>

                {/* Bottom accent line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent-600)] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
              </div>
            );
          })}
        </div>

        {/* ── Second Row: Text-only quick links (IndiaMART style) ── */}
        <div className="mt-1 bg-white border border-t-0 border-gray-200 rounded-b-sm px-4 py-2.5 flex flex-wrap gap-x-1 gap-y-1 items-center">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mr-2">
            Popular:
          </span>
          {categories.slice(0, 12).map((category, index) => (
            <span key={category.id} className="flex items-center">
              <button
                onClick={() => handleCategoryClick(category.id, category.name)}
                className="text-[11px] text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] hover:underline font-medium transition-colors"
              >
                {category.name}
              </button>
              {index < 11 && (
                <span className="text-gray-300 ml-1 text-[11px]">|</span>
              )}
            </span>
          ))}
        </div>

        {/* ── Mobile: View All Button ── */}
        <div className="mt-4 text-center sm:hidden">
          <button
            onClick={handleViewAll}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-sm font-semibold rounded transition-all"
          >
            View All Categories
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// LISTINGS GRID COMPONENT
// ==================================================================

function ListingsGrid({
  listings,
  userLocation,
  onInquiryClick,
  onLoadMore,
  loading,
  hasMore,
}) {
  const router = useRouter();

  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const isPaused = useRef(false);
  const [favourites, setFavourites] = useState([]);

  /* ===============================
     SORT + LIMIT
  =============================== */
  const sortedListings = [...listings]
    .sort((a, b) => (b.view || b.views || 0) - (a.view || a.views || 0))
    .slice(0, 6);

  /* ===============================
     DUPLICATE FOR INFINITE
  =============================== */
  const infiniteListings = [...sortedListings, ...sortedListings];

  /* ===============================
     AUTO INFINITE SCROLL
  =============================== */
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
        console.error("Error fetching favourites:", error);
      }
    };

    fetchFavourites();
  }, []);
  useEffect(() => {
    const container = scrollRef.current;

    if (!container || sortedListings.length === 0) return;

    const speed = 0.5; // change speed here

    const scroll = () => {
      if (!isPaused.current) {
        container.scrollLeft += speed;

        // Reset without flicker
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }

      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationRef.current);
  }, [sortedListings]);

  /* ===============================
     LOADING UI
  =============================== */
  if (loading && listings.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Trending Listings</h2>

          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-1/4 h-[300px] bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ===============================
     MAIN UI
  =============================== */
  return (
    <section className="py-10 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 rounded-full bg-[var(--color-accent-700)]" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                Most Viewed Listings
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Trending business opportunities right now
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/listings")}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] border border-[var(--color-accent-300)] hover:border-[var(--color-accent-500)] bg-white hover:bg-[var(--color-accent-50)] px-4 py-1.5 rounded transition-all duration-150"
          >
            View All
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {sortedListings.length === 0 ? (
          /* ── Empty State ── */
          <div className="text-center py-16 bg-white border border-gray-200 rounded-sm">
            <Search className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <h3 className="text-base font-semibold text-gray-600 mb-1">
              No listings found
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Check back soon for new opportunities
            </p>
            <button
              onClick={() => router.push("/listings")}
              className="inline-flex items-center gap-2 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-sm font-semibold px-5 py-2 rounded transition-all"
            >
              Browse Listings
            </button>
          </div>
        ) : (
          <>
            {/* ── Infinite Scroller ── */}
            <div
              ref={scrollRef}
              onMouseEnter={() => (isPaused.current = true)}
              onMouseLeave={() => (isPaused.current = false)}
              onTouchStart={() => (isPaused.current = true)}
              onTouchEnd={() => (isPaused.current = false)}
              className="flex gap-3 overflow-hidden pb-2 cursor-pointer select-none"
            >
              {infiniteListings.map((listing, index) => {
                const listingId = Number(listing.id);
                const isSaved = favourites.includes(listingId);
                

                return (
                  <div
                    key={`${listingId}-${index}`}
                    className="
                flex-shrink-0
                w-[85%]
                sm:w-[46%]
                lg:w-[23%]
                bg-white
                border border-gray-200
                rounded-sm
                hover:shadow-md
                hover:border-[var(--color-accent-300)]
                transition-all duration-200
                overflow-hidden
                group
              "
                  >
                    {/* ── Image ── */}
                    <div className="relative h-40 overflow-hidden bg-gray-100">
                      <Image
                        src={listing.image}
                        alt={listing.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={async (e) => {
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
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                },
                              );

                              setFavourites((prev) =>
                                prev.filter((id) => id !== listingId),
                              );
                            } else {
                              await fetch(
                                `${process.env.NEXT_PUBLIC_API_URL}/favourites/${listingId}`,
                                {
                                  method: "POST",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                },
                              );

                              setFavourites((prev) => [...prev, listingId]);
                            }
                          } catch (error) {
                            console.error("Favourite error:", error);
                          }
                        }}
                        className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow hover:scale-110 transition"
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

                      {/* Views Badge */}
                      <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        {listing.view || listing.views || 0} views
                      </span>
                    </div>

                    {/* ── Content ── */}
                    <div className="p-3">
                      {/* Title */}
                      <h3 className="font-bold text-sm text-gray-900 line-clamp-1 mb-0.5 group-hover:text-[var(--color-accent-700)] transition-colors">
                        {listing.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-2">
                        {listing.description || "Premium business opportunity"}
                      </p>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-3">
                        <LocationOn sx={{ fontSize: 13 }} />
                        <span className="truncate">
                          {Array.isArray(listing.location)
                            ? listing.location.join(", ")
                            : listing.location || "Remote"}
                        </span>
                      </div>

                      {/* ── Footer ── */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                        <div>
                          <p className="text-[10px] text-gray-400 leading-none mb-0.5">
                            Starting from
                          </p>
                          <p className="font-bold text-sm text-gray-900">
                            {listing.price}
                          </p>
                        </div>

                        <button
                          onClick={() => onInquiryClick(listing)}
                          className="text-xs font-semibold text-[var(--color-accent-700)] hover:text-white border border-[var(--color-accent-400)] hover:bg-[var(--color-accent-700)] hover:border-[var(--color-accent-700)] px-3 py-1.5 rounded transition-all duration-150"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Load More ── */}
            {hasMore && listings.length > 6 && (
              <div className="text-center mt-6">
                <button
                  onClick={onLoadMore}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2 border border-[var(--color-accent-400)] text-[var(--color-accent-700)] hover:bg-[var(--color-accent-700)] hover:text-white text-sm font-semibold rounded transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      Show More Listings
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// REVIEWS SECTION COMPONENT
// ============================================================================
function ReviewsSection({ reviews }) {
  if (reviews.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            What Our Community Says
          </h2>
          <p className="text-gray-600 mt-2">
            Real stories from real businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-[var(--color-accent-600)] rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                  {review.user?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {review.user || "User"}
                  </h4>
                  <div className="flex items-center space-x-1 mt-1">
                    <RatingStars rating={review.rating} />
                    <span className="text-gray-500 text-sm ml-1">
                      ({review.rating}.0)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed">
                &quot;{review.text}&quot;
              </p>

              <div className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium text-sm group-hover:translate-x-1 transition-transform">
                View {review.listingTitle}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-teal-500 hover:text-teal-600 transition-all">
            Read More Reviews
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CATEGORIES LANDING PAGE COMPONENT
// ============================================================================
function CategoriesLandingPage({ topcategories, onCategorySelect }) {
  return (
    <div className="w-full">
      <TopCategoriesSection1
        topcategories={topcategories}
        onCategorySelect={onCategorySelect}
      />
      <Trendingtags />
      <TopCategoriesSection2 onCategorySelect={onCategorySelect} />
      <TopCategoriesSection3 onCategorySelect={onCategorySelect} />
    </div>
  );
}

// ============================================================================
// MAIN HOMEPAGE COMPONENT
// ============================================================================
export default function HomePage() {
  const router = useRouter();
  const [homeData, setHomeData] = useState({
    categories: [],
    promoted: [],
    listings: [],
    reviews: [],
    stats: {},
  });
  const [userLocation, setUserLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [topcategories, settopcategories] = useState([]);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch home page data
  const fetchHomeData = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          userLocation: filters.userLocation || userLocation,
          search: filters.searchQuery || searchQuery,
          category: filters.selectedCategory || selectedCategory,
          page: filters.page || 1,
          limit: 20,
        };

        const response = await getHomePageData(params);

        if (response.data.success) {
          const data = response.data.data;

          setHomeData(data);

          const top = data.categories || [];
          const tops = [...top]
            .sort((a, b) => (b.count || 0) - (a.count || 0))
            .slice(0, 8);

          settopcategories(tops);
        } else {
          throw new Error(response.data.error || "Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching home data:", err);

        setError("Failed to load data. Showing sample listings.");
        setHomeData(FALLBACK_DATA);

        const fallbackTops = [...FALLBACK_DATA.categories]
          .sort((a, b) => b.count - a.count)
          .slice(0, 8);

        settopcategories(fallbackTops);
      } finally {
        setLoading(false);
      }
    },
    [userLocation, searchQuery, selectedCategory], // ✅ REQUIRED
  );

  // Fetch search suggestions
  const fetchSearchSuggestions = async (query) => {
    if (query.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await getSearchSuggestions(query);
      if (response.data.success) {
        setSearchSuggestions(response.data.data);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error("Error fetching search suggestions:", err);
      setSearchSuggestions([]);
    }
  };

  // Handle geolocation
  const handleGeolocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await detectUserLocation({ latitude, longitude });
            if (response.data.success) {
              const location = response.data.data;
              setUserLocation(location.city);
              fetchHomeData({ userLocation: location.city });
            }
          } catch (err) {
            console.error("Error detecting location:", err);
            setUserLocation("Mumbai");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUserLocation("Mumbai");
        },
      );
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchHomeData({ searchQuery: query });

    // Scroll to listings section after a short delay
    setTimeout(() => {
      const listingsSection = document.getElementById("latest-listings");
      if (listingsSection) {
        listingsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 300);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId, categoryName) => {
    setSelectedCategory(categoryId);
    fetchHomeData({ selectedCategory: categoryId });

    // Navigate to category page
    router.push(`/categories/${categoryId}`);
  };

  // Initial data load
  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  if (loading && homeData.categories.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HeroSection
        userLocation={userLocation}
        onLocationChange={setUserLocation}
        onUseLocation={handleGeolocation}
        onSearch={handleSearch}
        searchSuggestions={searchSuggestions}
        showSuggestions={showSuggestions}
        onHideSuggestions={() => setShowSuggestions(false)}
        onSuggestionSelect={(suggestion) => {
          if (suggestion.type === "category") {
            handleCategorySelect(suggestion.id, suggestion.name);
          } else {
            handleSearch(suggestion.name);
          }
          setShowSuggestions(false);
        }}
        isScrolled={isScrolled}
      />

      <main className="">
        {error && (
          <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-yellow-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <SearchFilterBar
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          userLocation={userLocation}
          onSearchChange={(query) => {
            setSearchQuery(query);
            fetchSearchSuggestions(query);
          }}
          onCategoryChange={handleCategorySelect}
          onLocationChange={(location) => {
            setUserLocation(location);
            fetchHomeData({ userLocation: location });
          }}
          categories={homeData.categories}
        />
        <Trendingtags />
        <TopCategoriesSection1
          topcategories={topcategories}
          onCategorySelect={handleCategorySelect}
        />

        <div id="latest-listings">
          <ListingsGrid
            listings={homeData.listings}
            onInquiryClick={(listing) => {
              router.push(`/listings/${listing.id}`);
            }}
            userLocation={userLocation}
            onLoadMore={() => {
              const nextPage = Math.floor(homeData.listings.length / 20) + 1;
              fetchHomeData({ page: nextPage });
            }}
            loading={loading}
            hasMore={
              homeData.listings.length < (homeData.stats?.totalListings || 0)
            }
          />
        </div>
        <CategoryGrid
          categories={homeData.categories}
          onCategoryClick={handleCategorySelect}
          loading={loading}
        />

        <StatsSection stats={homeData.stats} />

        {/* <CategoriesLandingPage 
          topcategories={topcategories} 
          onCategorySelect={handleCategorySelect}
        /> */}

        <TopCategoriesSection2
          topcategories={topcategories}
          onCategorySelect={handleCategorySelect}
        />
        <TopCategoriesSection3
          topcategories={topcategories}
          onCategorySelect={handleCategorySelect}
        />

        {homeData.reviews.length > 0 && (
          <ReviewsSection reviews={homeData.reviews} />
        )}
      </main>
    </div>
  );
}

// Export individual components for use in other files
export {
  LoadingScreen,
  HeroSection,
  SearchFilterBar,
  StatsSection,
  TopCategoriesSection1,
  TopCategoriesSection2,
  TopCategoriesSection3,
  CategoryGrid,
  ListingsGrid,
  ReviewsSection,
  CategoriesLandingPage,
};
