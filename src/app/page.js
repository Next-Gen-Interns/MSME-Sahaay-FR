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
    <section className="relative w-full bg-white overflow-x-hidden py-6 md:py-12 px-2 sm:px-4">
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
            rounded-xl
            md:rounded-3xl
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
                        className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <Check size={16} className="text-blue-600 mt-1" />
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
                      <div key={i} className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-bold text-blue-700">{v}</div>
                        <div className="text-xs text-gray-600">{t}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg flex justify-center items-center gap-2 font-semibold hover:bg-blue-700">
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
              className="w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm text-[var(--color-accent-900)] font-sans font-medium transition-all duration-300 shadow-sm border border-[var(--color-accent-200)] hover:border-[var(--color-accent-300)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] cursor-pointer appearance-none"
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
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm text-[var(--color-accent-900)] font-sans font-medium transition-all duration-300 shadow-sm border border-[var(--color-accent-200)] hover:border-[var(--color-accent-300)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)]"
            />
          </div>

          {/* Price Range Filter */}
          <div className="relative">
            <select className="w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm text-[var(--color-accent-900)] font-sans font-medium transition-all duration-300 shadow-sm border border-[var(--color-accent-200)] hover:border-[var(--color-accent-300)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] cursor-pointer appearance-none">
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
            <select className="w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm text-[var(--color-accent-900)] font-sans font-medium transition-all duration-300 shadow-sm border border-[var(--color-accent-200)] hover:border-[var(--color-accent-300)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] cursor-pointer appearance-none">
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
            <span className="w-2 h-2 bg-[var(--color-accent-500)] rounded-full mr-2 animate-pulse"></span>
            Popular Categories:
          </span>

          {popularCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handlePopularCategoryClick(category)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-sans font-medium transition-all duration-300 hover:scale-105 border
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
    <section className="py-16 bg-gradient-to-br from-white to-[var(--color-accent-100)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h3 className="text-4xl mb-2  font-semibold bg-gradient-to-r from-[var(--color-accent-900)] to-[var(--color-accent-600)] bg-clip-text text-transparent">
            India&apos;s Fastest Growing MSME Platform
          </h3>
          <p className="text-[var(--color-accent-700)] text-lg font-medium">
            Trusted by businesses across the country
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {statItems.map((stat, index) => (
            <div
              key={index}
              className="relative group cursor-default overflow-hidden rounded-3xl bg-white
        border border-[var(--color-accent-100)] shadow-sm
        hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Subtle gradient wash on hover */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-50)] to-transparent 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              />

              {/* Top accent line */}
              <div
                className="h-0.5 w-full bg-gradient-to-r from-transparent via-[var(--color-accent-400)] to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              <div className="relative p-6 flex flex-col items-center text-center gap-3">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center
          bg-[var(--color-accent-800)] text-white shadow-md
          group-hover:scale-110 group-hover:rounded-3xl transition-all duration-300"
                >
                  {stat.icon}
                </div>

                {/* Value */}
                <div className="text-3xl font-extrabold tracking-tight text-[var(--color-accent-900)] leading-none">
                  {stat.value}
                </div>

                {/* Divider */}
                <div className="w-8 h-px bg-[var(--color-accent-200)] group-hover:w-14 transition-all duration-300" />

                {/* Label */}
                <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-500)]">
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
      className="max-w-7xl mx-auto px-6 border-t-5 border-blue-800 shadow-xs rounded-2xl mb-10"
    >
      {/* Main Category Header */}
      <div className="mb-5 mt-5">
        <h1 className="text-3xl font-sans font-semibold text-[var(--color-black-darker)] pb-3">
          {category?.name || `Category ${index + 1}`}
        </h1>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-2xl overflow-hidden mb-0.5">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side: Category Photo & Description */}
          <div className="lg:w-5/12 mb-5 p-4 rounded-xl">
            <div className="relative h-70 rounded-xl overflow-hidden shadow-lg mb-3">
              <Image
                src={category?.image_url || "/placeholder-category.jpg"}
                alt={category?.name || `Category ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition duration-500"
              />
            </div>

            <div className="space-y-2">
              <p className="text-[var(--color-accent-800)] font-sans font-semibold leading-relaxed">
                {category?.name || `Category ${index + 1}`}
              </p>

              <div className="pt-0 mb-1">
                <button
                  onClick={() =>
                    handleCategoryClick(category.id, category.name)
                  }
                  className="bg-[var(--color-accent-800)] hover:bg-[var(--color-accent-900)] text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Subcategories Grid */}
          <div className="lg:w-7/12 p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subCategories.map((subCategory, subIndex) => (
                <div
                  key={subCategory.id || subIndex}
                  onClick={() =>
                    handleCategoryClick(subCategory.id, subCategory.name)
                  }
                  className="bg-white rounded-xs p-3 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer"
                >
                  {/* Category Name */}
                  <h4 className="text-base font-semibold text-[var(--color-accent-800)] mb-3 text-center line-clamp-1">
                    {subCategory.name || `Subcategory ${subIndex + 1}`}
                  </h4>

                  <div className="flex gap-3">
                    {/* Left: Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={
                          subCategory.image_url ||
                          "/placeholder-subcategory.jpg"
                        }
                        alt={subCategory.name || `Subcategory ${subIndex + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Right: Description */}
                    <div className="flex-1">
                      <p className="text-xs font-sans font-semibold text-[var(--color-accent-800)] line-clamp-4">
                        {subCategory.description ||
                          subCategory.name ||
                          "Explore quality products in this category."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[var(--color-accent-50)] via-white to-[var(--color-accent-100)]">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-accent-100)] rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-accent-200)] rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-accent-600)] bg-[var(--color-accent-100)] px-4 py-1.5 rounded-full mb-4">
            Browse Categories
          </span>
          <h2 className="text-4xl font-bold text-[var(--color-accent-900)] tracking-tight">
            What are you looking for?
          </h2>
          <p className="mt-3 text-[var(--color-accent-500)] text-base max-w-md mx-auto">
            Find trusted professionals for every need — at home or at work.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT BOX — Home Services */}
          <div className="group relative bg-white rounded-3xl border border-[var(--color-accent-100)] shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[var(--color-accent-400)] via-[var(--color-accent-600)] to-[var(--color-accent-400)]" />

            <div className="p-8">
              {/* Box header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] flex items-center justify-center text-xl">
                  🏠
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-accent-900)] leading-tight">
                    Home Services
                  </h2>
                  <p className="text-xs text-[var(--color-accent-400)] mt-0.5">
                    Repairs, cleaning & more
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES_SECTION2.section3.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => handleCategoryClick(c.title)}
                    className="group/card relative flex flex-col items-center gap-3 p-4 rounded-2xl cursor-pointer
                  bg-[var(--color-accent-50)] hover:bg-[var(--color-accent-500)]
                  border border-transparent hover:border-[var(--color-accent-500)]
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white 
                  shadow-md group-hover/card:ring-[var(--color-accent-600)] transition-all duration-300"
                    >
                      <Image
                        src={c.img}
                        alt={c.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span
                      className="text-xs font-semibold text-center text-[var(--color-accent-800)] 
                  group-hover/card:text-white leading-tight transition-colors duration-300"
                    >
                      {c.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT BOX — Professional Services */}
          <div className="group relative bg-white rounded-3xl border border-[var(--color-accent-100)] shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[var(--color-accent-600)] via-[var(--color-accent-400)] to-[var(--color-accent-600)]" />

            <div className="p-8">
              {/* Box header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] flex items-center justify-center text-xl">
                  💼
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-accent-900)] leading-tight">
                    Professional Services
                  </h2>
                  <p className="text-xs text-[var(--color-accent-400)] mt-0.5">
                    Legal, finance & consulting
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES_SECTION2.section4.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => handleCategoryClick(c.title)}
                    className="group/card relative flex flex-col items-center gap-3 p-4 rounded-2xl cursor-pointer
                  bg-[var(--color-accent-50)] hover:bg-[var(--color-accent-500)]
                  border border-transparent hover:border-[var(--color-accent-500)]
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white 
                  shadow-md group-hover/card:ring-[var(--color-accent-600)] transition-all duration-300"
                    >
                      <Image
                        src={c.img}
                        alt={c.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span
                      className="text-xs font-semibold text-center text-[var(--color-accent-800)] 
                  group-hover/card:text-white leading-tight transition-colors duration-300"
                    >
                      {c.title}
                    </span>
                  </div>
                ))}
              </div>
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
    <section className="py-28 relative overflow-hidden bg-[var(--color-accent-900)]">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES_SECTION3.section5.map((c, i) => (
            <div
              key={i}
              onClick={() => handleCategoryClick(c.title)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer
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
                className="absolute top-4 right-4 w-8 h-8 rounded-full
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
                <div className="mt-3 h-0.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-accent-400)] rounded-full
                w-0 group-hover:w-full transition-all duration-500 ease-out"
                  />
                </div>
              </div>

              {/* Hover glow border */}
              <div
                className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10
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
    <section className="py-20 bg-gradient-to-b from-[var(--color-accent-50)] to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold font-sans text-gray-900 mb-3">
            Categories Hub
          </h2>

          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Discover business opportunities across multiple industries
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((category) => {
            const image =
              category.image_url || category.image || "/default-category.jpg";

            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id, category.name)}
                className="
                  group
                  relative
                  h-64
                  rounded-2xl
                  overflow-hidden
                  cursor-pointer
                  shadow-md
                  hover:shadow-xl
                  transition-all
                  duration-500
                "
              >
                {/* Image */}
                <Image
                  src={image}
                  alt={category.name}
                  fill
                  className="
                    object-contain
                    scale-100
                    group-hover:scale-110
                    transition-transform
                    duration-700
                  "
                />

                {/* Gradient Overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/70
                    via-black/30
                    to-transparent
                    opacity-90
                  "
                />

                {/* Glass Effect */}
                <div
                  className="
                    absolute
                    bottom-0
                    w-full
                    backdrop-blur-md
                    bg-white/10
                    p-4
                  "
                >
                  <h3
                    className="
                      text-gray-200
                      font-semibold
                      sont-sans
                      
                      tracking-wide
                      group-hover:translate-x-1
                      transition-transform
                    "
                  >
                    {category.name}
                  </h3>
                </div>

                {/* Hover Border */}
                {/* <div
                  className="
                    absolute
                    inset-0
                    border-2
                    border-transparent
                    group-hover:border-[var(--color-accent-600)]
                    rounded-2xl
                    transition-all
                  "
                /> */}
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <button
            onClick={handleViewAll}
            className="
              inline-flex
              items-center
              gap-2
              px-8
              py-3
              bg-[var(--color-accent-800)]
              text-white
              font-semibold
              rounded-full
              shadow-md
              hover:shadow-xl
              hover:bg-[var(--color-accent-900)]
              transition-all
            "
          >
            View All Categories
            <svg
              className="w-5 h-5"
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
    <section className="py-12 bg-gradient-to-b from-[var(--color-accent-50)] to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-sans md:text-4xl mb-2 font-semibold">
            Most Viewed Listings
          </h2>
        </div>

        {sortedListings.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />

            <h3 className="text-xl font-semibold mb-2">No listings found</h3>

            <button
              onClick={() => router.push("/listings")}
              className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Browse Listings
            </button>
          </div>
        ) : (
          <>
            {/* ===============================
                INFINITE SCROLLER
            =============================== */}

            <div
              ref={scrollRef}
              /* Pause on hover */
              onMouseEnter={() => (isPaused.current = true)}
              onMouseLeave={() => (isPaused.current = false)}
              /* Pause on touch */
              onTouchStart={() => (isPaused.current = true)}
              onTouchEnd={() => (isPaused.current = false)}
              className="
                flex
                gap-4
                overflow-hidden
                pb-4
                cursor-pointer
                select-none
              "
            >
              {infiniteListings.map((listing, index) => (
                <div
                  key={index}
                  className="
  flex-shrink-0

  w-[85%]        /* Mobile */
  sm:w-[48%]     /* Tablet */
  lg:w-[25%]     /* Desktop */

  bg-white
  rounded-2xl
  shadow-md
  border
  border-gray-200
"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />

                    {/* Views */}
                    <span className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-semibold shadow">
                      👁 {listing.view || listing.views || 0}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold font-sans text-lg mb-1 line-clamp-2">
                      {listing.title}
                    </h3>

                    <p className="font-semibold font-sans text-gray-600 mb-3 line-clamp-2">
                      {listing.description || "Premium opportunity"}
                    </p>

                    <div className="flex items-center gap-1 font-sans text-gray-500 mb-3">
                      <LocationOn fontSize="small" />

                      <span className="truncate">
                        {Array.isArray(listing.location)
                          ? listing.location.join(", ")
                          : listing.location || "Remote"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t">
                      <div>
                        <p className="text-xs text-gray-400">Starting from</p>

                        <p className="font-bold text-lg">{listing.price}</p>
                      </div>

                      <button
                        onClick={() => onInquiryClick(listing)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && listings.length > 6 && (
              <div className="text-center mt-8">
                <button
                  onClick={onLoadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold"
                >
                  {loading ? "Loading..." : "Show More"}
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
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
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
