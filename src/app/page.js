"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import {
  getHomePageData,
  getSearchSuggestions,
  detectUserLocation,
} from "./api/homeAPI";
import { LocationOn, Search } from "@mui/icons-material";
import { Award, BarChart3, ShieldCheck, Users2 } from "lucide-react";
import RatingStars from "./components/Ratings";
import Trendingtags from "./components/home/Trendingtags";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Check, ArrowRight } from "lucide-react";

// ============================================================================
// SHARED NAVIGATION HELPERS
// ============================================================================

function slugify(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Parent category → /categories/{slug}/{id} */
function goToCategory(router, id, name) {
  router.push(`/categories/${slugify(name)}/${id}`);
}

/** Subcategory → /categories/subcategory/{id}/listings */
function goToSubcategory(router, id) {
  router.push(`/categories/subcategory/${id}/listings`);
}

// ============================================================================
// FALLBACK DATA
// ============================================================================

const FALLBACK_SECTION2 = {
  homeServices: {
    id: "1",
    name: "Home Services",
    emoji: "🏠",
    subtitle: "Repairs, cleaning & more",
    subcategories: [
      {
        id: "11",
        name: "Cleaning",
        img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop&auto=format",
      },
      {
        id: "12",
        name: "Repairs & Maintenance",
        img: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop&auto=format",
      },
      {
        id: "13",
        name: "Renovation & Remodeling",
        img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop&auto=format",
      },
      {
        id: "26",
        name: "Tutoring & Academic Support",
        img: "https://images.unsplash.com/photo-1584697964358-3e14ca57658b?w=300&h=200&fit=crop&auto=format",
      },
      {
        id: "34",
        name: "Pest Control",
        img: "https://images.unsplash.com/photo-1598791318878-10e76d178023?w=300&h=200&fit=crop&auto=format",
      },
    ],
  },
  professionalServices: {
    id: "2",
    name: "Business & Professional Services",
    emoji: "💼",
    subtitle: "Legal, finance & consulting",
    subcategories: [
      {
        id: "14",
        name: "Consulting",
        img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop&auto=format",
      },
      {
        id: "15",
        name: "Accounting & Finance",
        img: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=200&h=200&fit=crop&auto=format",
      },
      {
        id: "16",
        name: "Legal",
        img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&h=200&fit=crop&auto=format",
      },
      {
        id: "27",
        name: "Professional Development",
        img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&h=200&fit=crop&auto=format",
      },
      {
        id: "2",
        name: "Marketing",
        img: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=200&h=200&fit=crop&auto=format",
      },
    ],
  },
};

const FALLBACK_TRAVEL = {
  parent: { id: "43", name: "Travel & Hospitality" },
  subcategories: [
    {
      id: "44",
      name: "Travel Agencies",
      image_url:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=350&h=250&fit=crop&auto=format",
    },
    {
      id: "45",
      name: "Adventure Trips",
      image_url:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=350&h=250&fit=crop&auto=format",
    },
    {
      id: "47",
      name: "Tour Guides",
      image_url:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=350&h=250&fit=crop&auto=format",
    },
    {
      id: "46",
      name: "Luxury Resorts",
      image_url:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=350&h=250&fit=crop&auto=format",
    },
  ],
};

const SUB_IMAGE_FALLBACKS = {
  44: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=350&h=250&fit=crop&auto=format",
  45: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=350&h=250&fit=crop&auto=format",
  47: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=350&h=250&fit=crop&auto=format",
  default:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=350&h=250&fit=crop&auto=format",
};

function getSubImage(sub) {
  const url = sub.image_url || "";
  if (url && !url.includes("localhost")) return url;
  return SUB_IMAGE_FALLBACKS[String(sub.id)] || SUB_IMAGE_FALLBACKS.default;
}

// ============================================================================
// LOADING SCREEN
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
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-8 h-8 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--color-accent-700)" }}
            />
          </div>
        </div>
        <p
          className="mt-4 font-medium"
          style={{ color: "var(--color-accent-700)" }}
        >
          Loading MSME Guru...
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState("right");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const autoPlayRef = useRef(null);
  const panelRef = useRef(null);
  const heroRef = useRef(null);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const heroSlides = [
    {
      id: 1,
      title: "Connect Local Businesses",
      subtitle: "Grow Together",
      description:
        "Discover verified suppliers and connect with qualified buyers.",
      backgroundImage: "/imm8.png",
      mobileBackgroundImage: "/banner10.jpg",
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
      mobileBackgroundImage: "/banner11.jpg",
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
      mobileBackgroundImage: "/banner12.jpg",
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

  const openPanel = () => {
    setIsPanelOpen(true);
    setIsAutoPlaying(false);
    clearInterval(autoPlayRef.current);
  };
  const closePanel = () => {
    setIsPanelOpen(false);
    setIsAutoPlaying(true);
  };

  useEffect(() => {
    const handler = (e) => {
      if (!heroRef.current?.contains(e.target)) return;
      if (!e.target.closest("button") && !e.target.closest(".carousel-nav"))
        openPanel();
    };
    heroRef.current?.addEventListener("click", handler);
    return () => heroRef.current?.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!panelRef.current?.contains(e.target)) closePanel();
    };
    if (isPanelOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isPanelOpen]);

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

  const currentImage = isMobile
    ? heroSlides[currentSlide].mobileBackgroundImage
    : heroSlides[currentSlide].backgroundImage;

  return (
    <section className="relative w-full bg-white overflow-x-hidden py-3 md:py-6 px-2 sm:px-4">
      <div className="max-w-8xl mx-auto">
        <div
          ref={heroRef}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => !isPanelOpen && setIsAutoPlaying(true)}
          className="relative w-full h-[65vh] sm:h-[420px] md:h-[600px] rounded-xs md:rounded-sm overflow-hidden shadow-xl cursor-pointer select-none touch-pan-y"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={
                heroSlides[currentSlide].id +
                (isMobile ? "-mobile" : "-desktop")
              }
              initial={{
                opacity: 0,
                x: slideDirection === "right" ? 100 : -100,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDirection === "right" ? -100 : 100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={currentImage}
                alt=""
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/30" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 carousel-nav">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(i, i > currentSlide ? "right" : "left");
                }}
                className={`h-2 rounded-full transition-all ${currentSlide === i ? "w-6 bg-white" : "w-2 bg-white/60"}`}
              />
            ))}
          </div>

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

          <AnimatePresence>
            {isPanelOpen && (
              <motion.div
                ref={panelRef}
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "spring", damping: 25 }}
                className="absolute right-0 bottom-0 md:top-0 w-full md:w-1/2 h-[90%] md:h-full bg-white shadow-2xl z-30 flex flex-col rounded-t-2xl md:rounded-none"
              >
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
// SEARCH FILTER BAR
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

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-[var(--color-accent-100)] transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-3">
          <span className="text-sm font-sans font-semibold text-[var(--color-accent-700)] flex items-center">
            <span className="w-2 h-2 bg-[var(--color-accent-500)] rounded-xs mr-2 animate-pulse"></span>
            Popular Categories:
          </span>
          {popularCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onCategoryChange(category.id);
                goToCategory(router, category.id, category.name);
              }}
              className={`inline-flex items-center px-4 py-2 rounded-xs text-sm font-sans font-medium transition-all duration-300 hover:scale-105 border ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-700)] text-white shadow-lg shadow-[var(--color-accent-500)]/30 border-[var(--color-accent-400)]"
                  : "bg-white/80 text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] border-[var(--color-accent-200)] hover:border-[var(--color-accent-300)] hover:shadow-md"
              }`}
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
// STATS SECTION
// ============================================================================
function StatsSection({ stats }) {
  const statItems = [
    {
      label: "Active Listings",
      value: stats.totalListings || "10,000+",
      icon: <BarChart3 className="w-7 h-7" />,
    },
    {
      label: "Verified Sellers",
      value: stats.totalSellers || "5,000+",
      icon: <ShieldCheck className="w-7 h-7" />,
    },
    {
      label: "Business Buyers",
      value: stats.totalBuyers || "15,000+",
      icon: <Users2 className="w-7 h-7" />,
    },
    {
      label: "Success Stories",
      value: stats.totalLeads
        ? `${(stats.totalLeads / 1000).toFixed(0)}k+`
        : "50k+",
      icon: <Award className="w-7 h-7" />,
    },
  ];

  return (
    <section className="py-10 bg-white border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200 border border-gray-200 rounded-sm overflow-hidden bg-white">
          {statItems.map((stat, index) => (
            <div
              key={index}
              className="group relative flex items-center gap-4 px-6 py-5 hover:bg-[var(--color-accent-50)] transition-colors duration-150 cursor-default"
            >
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--color-accent-700)] scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center" />
              <div className="w-11 h-11 flex-shrink-0 rounded bg-[var(--color-accent-800)] text-white flex items-center justify-center shadow-sm group-hover:bg-[var(--color-accent-900)] transition-colors duration-150">
                {stat.icon}
              </div>
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
// TOP CATEGORIES SECTION 1
// ============================================================================
function TopCategoriesSection1({ topcategories, onCategorySelect }) {
  const router = useRouter();

  if (!topcategories || topcategories.length === 0) {
    return (
      <div className="w-full py-16 bg-gray-50 text-center">
        <h2 className="text-2xl font-bold text-gray-600">
          Loading categories...
        </h2>
      </div>
    );
  }

  const firstCategory = topcategories[0] || {};
  const secondCategory = topcategories[1] || {};
  const thirdCategory = topcategories[2] || {};
  const subCategories0 = (firstCategory?.subcategories || []).slice(0, 6);
  const subCategories1 = (secondCategory?.subcategories || []).slice(0, 6);
  const subCategories2 = (thirdCategory?.subcategories || []).slice(0, 6);

  const renderCategorySection = (category, subCategories, index) => (
    <div
      key={category.id || index}
      className="max-w-7xl mx-auto px-4 sm:px-6 mb-4"
    >
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        {/* Header — links to PARENT category */}
        <div className="flex items-center justify-between bg-[var(--color-accent-800)] px-4 py-2.5">
          <h2 className="text-white font-bold text-base tracking-wide uppercase">
            {category?.name || `Category ${index + 1}`}
          </h2>
          <button
            onClick={() => goToCategory(router, category.id, category.name)}
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

        <div className="flex flex-col sm:flex-row">
          {/* Left: Category Image — links to PARENT category */}
          <div className="sm:w-[200px] lg:w-[220px] flex-shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col">
            <div className="relative h-40 sm:h-full min-h-[160px] overflow-hidden">
              <Image
                src={category?.image_url || "/placeholder-category.jpg"}
                alt={category?.name || `Category ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <button
              onClick={() => goToCategory(router, category.id, category.name)}
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

          {/* Right: Subcategories — each links to SUBCATEGORY listings page */}
          <div className="flex-1 p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0">
              {subCategories.map((subCategory, subIndex) => (
                <div
                  key={subCategory.id || subIndex}
                  onClick={() => goToSubcategory(router, subCategory.id)}
                  className="group flex flex-col items-center text-center p-2.5 border border-transparent hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] rounded cursor-pointer transition-all duration-150"
                >
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
                  <p className="text-[11px] leading-tight font-semibold text-[var(--color-accent-800)] group-hover:text-[var(--color-accent-600)] line-clamp-2 transition-colors">
                    {subCategory.name || `Subcategory ${subIndex + 1}`}
                  </p>
                </div>
              ))}

              {/* "View All" tile → PARENT category */}
              {subCategories.length > 0 && (
                <div
                  onClick={() =>
                    goToCategory(router, category.id, category.name)
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
      {firstCategory && renderCategorySection(firstCategory, subCategories0, 0)}
      {secondCategory &&
        renderCategorySection(secondCategory, subCategories1, 1)}
      {thirdCategory && renderCategorySection(thirdCategory, subCategories2, 2)}
    </section>
  );
}

// ============================================================================
// CATEGORY BOX (used by Section 2)
// ============================================================================
function CategoryBox({ category, subcategories, emoji, subtitle, router }) {
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <div>
            <h3 className="text-sm font-bold text-gray-800 leading-tight">
              {category.name}
            </h3>
            <p className="text-[10px] text-gray-400">{subtitle}</p>
          </div>
        </div>
        {/* Header "View All" → PARENT category page */}
        <button
          onClick={() => goToCategory(router, category.id, category.name)}
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

      {/* Subcategory tiles — each → SUBCATEGORY listings page */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-0 p-3">
        {subcategories.slice(0, 5).map((sub, i) => (
          <div
            key={sub.id || i}
            onClick={() => goToSubcategory(router, sub.id)}
            className="group flex flex-col items-center text-center p-3 rounded cursor-pointer hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-150"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-[var(--color-accent-400)] mb-2 flex-shrink-0 transition-colors duration-150 shadow-sm">
              <Image
                src={
                  sub.img ||
                  sub.image_url ||
                  "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=200&h=200&fit=crop&auto=format"
                }
                alt={sub.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=200&h=200&fit=crop&auto=format";
                }}
              />
            </div>
            <span className="text-[11px] font-semibold text-gray-700 group-hover:text-[var(--color-accent-700)] leading-tight line-clamp-2 transition-colors duration-150">
              {sub.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// TOP CATEGORIES SECTION 2
// ============================================================================
function TopCategoriesSection2({ topcategories, onCategorySelect }) {
  const router = useRouter();

  const resolveBox = (targetId, fallbackData) => {
    if (!topcategories || topcategories.length === 0) return fallbackData;
    const parent = topcategories.find(
      (c) =>
        String(c.id) === String(targetId) ||
        (c.parent_category_id === 0 && String(c.id) === String(targetId)),
    );
    if (!parent) return fallbackData;
    let subs = [];
    if (parent.subcategories && parent.subcategories.length > 0) {
      subs = parent.subcategories.map((s) => ({
        ...s,
        img: s.image_url || null,
      }));
    } else {
      subs = topcategories
        .filter((c) => String(c.parent_category_id) === String(parent.id))
        .map((s) => ({ ...s, img: s.image_url || null }));
    }
    if (subs.length === 0) subs = fallbackData.subcategories;
    return {
      id: parent.id,
      name: parent.name,
      emoji: fallbackData.emoji,
      subtitle: fallbackData.subtitle,
      subcategories: subs,
    };
  };

  const homeServicesData = resolveBox("1", FALLBACK_SECTION2.homeServices);
  const professionalServicesData = resolveBox(
    "2",
    FALLBACK_SECTION2.professionalServices,
  );

  return (
    <section className="py-10 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-[var(--color-accent-700)] pl-3">
          What are you looking for?
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CategoryBox
            category={{ id: homeServicesData.id, name: homeServicesData.name }}
            subcategories={homeServicesData.subcategories}
            emoji={homeServicesData.emoji}
            subtitle={homeServicesData.subtitle}
            router={router}
          />
          <CategoryBox
            category={{
              id: professionalServicesData.id,
              name: professionalServicesData.name,
            }}
            subcategories={professionalServicesData.subcategories}
            emoji={professionalServicesData.emoji}
            subtitle={professionalServicesData.subtitle}
            router={router}
          />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TOP CATEGORIES SECTION 3 (Travel & Hospitality)
// ============================================================================
function TopCategoriesSection3({ topcategories, onCategorySelect }) {
  const router = useRouter();

  const resolve = () => {
    if (!topcategories || topcategories.length === 0) return FALLBACK_TRAVEL;
    const parent = topcategories.find(
      (c) =>
        String(c.id) === "43" ||
        (c.name || "").toLowerCase().includes("travel"),
    );
    if (!parent) return FALLBACK_TRAVEL;
    const subs =
      parent.subcategories && parent.subcategories.length > 0
        ? parent.subcategories
        : topcategories.filter(
            (c) => String(c.parent_category_id) === String(parent.id),
          );
    if (!subs || subs.length === 0) return FALLBACK_TRAVEL;
    return { parent, subcategories: subs };
  };

  const { parent, subcategories } = resolve();
  const cards = subcategories.slice(0, 4);

  return (
    <section className="py-15 relative overflow-hidden bg-[var(--color-accent-900)]">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, var(--color-accent-400) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--color-accent-600) 0%, transparent 40%), radial-gradient(circle at 60% 80%, var(--color-accent-500) 0%, transparent 45%)`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[20vw] font-black uppercase tracking-tighter text-white opacity-[0.03] whitespace-nowrap">
          Travel
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-accent-400)] mb-3">
              ✦ &nbsp; Destinations
            </span>
            <h2 className="text-5xl sm:text-6xl font-black text-white leading-none tracking-tight">
              Explore <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent-300)] to-[var(--color-accent-500)]">
                Travel
              </span>
            </h2>
            {/* Parent badge → PARENT category page */}
            <button
              onClick={() => goToCategory(router, parent.id, parent.name)}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-accent-300)] hover:text-white border border-[var(--color-accent-700)] hover:border-[var(--color-accent-400)] px-3 py-1.5 rounded-sm transition-all duration-200"
            >
              {parent.name}
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
          <p className="text-[var(--color-accent-400)] text-sm max-w-xs leading-relaxed md:text-right">
            Discover handpicked experiences and trusted professionals for every
            journey.
          </p>
        </div>

        {/* Cards → each SUBCATEGORY → /categories/subcategory/{id}/listings */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.map((sub, i) => (
            <div
              key={sub.id || i}
              onClick={() => goToSubcategory(router, sub.id)}
              className="group relative rounded-sm overflow-hidden cursor-pointer aspect-[3/4] shadow-2xl"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Image
                src={getSubImage(sub)}
                alt={sub.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  e.target.src = SUB_IMAGE_FALLBACKS.default;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:from-black/90 group-hover:via-black/40 transition-all duration-500" />
              <div className="absolute top-4 right-4 w-8 h-8 rounded-xs bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/60 text-xs font-bold group-hover:bg-[var(--color-accent-500)] group-hover:text-white group-hover:border-[var(--color-accent-400)] transition-all duration-300">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="overflow-hidden mb-2">
                  <span className="block text-[var(--color-accent-300)] text-xs font-semibold tracking-widest uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
                    Explore now →
                  </span>
                </div>
                <h3 className="text-white text-xl font-bold leading-tight tracking-tight group-hover:text-[var(--color-accent-200)] transition-colors duration-300">
                  {sub.name}
                </h3>
                <div className="mt-3 h-0.5 bg-white/20 rounded-xs overflow-hidden">
                  <div className="h-full bg-[var(--color-accent-400)] rounded-xs w-0 group-hover:w-full transition-all duration-500 ease-out" />
                </div>
              </div>
              <div className="absolute inset-0 rounded-xs ring-1 ring-inset ring-white/10 group-hover:ring-[var(--color-accent-400)]/40 transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CATEGORY GRID
// ============================================================================
function CategoryGrid({ categories, onCategoryClick, loading }) {
  const router = useRouter();

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

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
            onClick={() => router.push("/categories")}
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

        {/* Grid tiles → PARENT category pages */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-0 bg-white border border-gray-200 rounded-xs overflow-hidden">
          {categories.slice(0, 8).map((category, index) => {
            const image =
              category.image_url || category.image || "/default-category.jpg";
            return (
              <div
                key={category.id}
                onClick={() => goToCategory(router, category.id, category.name)}
                className={`group relative flex flex-col items-center justify-start p-4 cursor-pointer border-gray-200 hover:bg-[var(--color-accent-50)] transition-all duration-150 ${index !== 0 ? "border-l" : ""} ${index >= 4 ? "border-t" : ""}`}
              >
                <div className="relative w-16 h-16 mb-2.5 overflow-hidden rounded-sm bg-gray-50 border border-gray-100 flex-shrink-0">
                  <Image
                    src={image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-[11px] font-semibold text-gray-700 group-hover:text-[var(--color-accent-700)] text-center leading-tight line-clamp-2 transition-colors">
                  {category.name}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent-600)] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
              </div>
            );
          })}
        </div>

        {/* Popular text links → PARENT category pages */}
        <div className="mt-1 bg-white border border-t-0 border-gray-200 rounded-b-sm px-4 py-2.5 flex flex-wrap gap-x-1 gap-y-1 items-center">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mr-2">
            Popular:
          </span>
          {categories.slice(0, 12).map((category, index) => (
            <span key={category.id} className="flex items-center">
              <button
                onClick={() => goToCategory(router, category.id, category.name)}
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

        <div className="mt-4 text-center sm:hidden">
          <button
            onClick={() => router.push("/categories")}
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
// LISTINGS GRID
// ============================================================================
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

  const sortedListings = [...listings]
    .sort((a, b) => (b.view || b.views || 0) - (a.view || a.views || 0))
    .slice(0, 6);
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
    const speed = 0.5;
    const scroll = () => {
      if (!isPaused.current) {
        container.scrollLeft += speed;
        if (container.scrollLeft >= container.scrollWidth / 2)
          container.scrollLeft = 0;
      }
      animationRef.current = requestAnimationFrame(scroll);
    };
    animationRef.current = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationRef.current);
  }, [sortedListings]);

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

  return (
    <section className="py-10 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
// REVIEWS SECTION
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
// CATEGORIES LANDING PAGE
// ============================================================================
function CategoriesLandingPage({ topcategories, onCategorySelect }) {
  return (
    <div className="w-full">
      <TopCategoriesSection1
        topcategories={topcategories}
        onCategorySelect={onCategorySelect}
      />
      <Trendingtags />
      <TopCategoriesSection2
        topcategories={topcategories}
        onCategorySelect={onCategorySelect}
      />
      <TopCategoriesSection3
        topcategories={topcategories}
        onCategorySelect={onCategorySelect}
      />
    </div>
  );
}

// ============================================================================
// MAIN HOMEPAGE
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [topcategories, settopcategories] = useState([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          const tops = [...(data.categories || [])]
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
        settopcategories(
          [...(FALLBACK_DATA.categories || [])]
            .sort((a, b) => b.count - a.count)
            .slice(0, 8),
        );
      } finally {
        setLoading(false);
      }
    },
    [userLocation, searchQuery, selectedCategory],
  );

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
    } catch {
      setSearchSuggestions([]);
    }
  };

  const handleGeolocation = async () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await detectUserLocation({ latitude, longitude });
          if (response.data.success) {
            const loc = response.data.data;
            setUserLocation(loc.city);
            fetchHomeData({ userLocation: loc.city });
          }
        } catch {
          setUserLocation("Mumbai");
        }
      },
      () => setUserLocation("Mumbai"),
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchHomeData({ searchQuery: query });
    setTimeout(() => {
      const el = document.getElementById("latest-listings");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  // Category chips in SearchFilterBar → parent category page
  const handleCategorySelect = (categoryId, categoryName) => {
    setSelectedCategory(categoryId);
    fetchHomeData({ selectedCategory: categoryId });
    goToCategory(router, categoryId, categoryName);
  };

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  if (loading && homeData.categories.length === 0) return <LoadingScreen />;

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
          if (suggestion.type === "category")
            handleCategorySelect(suggestion.id, suggestion.name);
          else handleSearch(suggestion.name);
          setShowSuggestions(false);
        }}
        isScrolled={isScrolled}
      />

      <main>
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex">
                <span className="text-yellow-400 flex-shrink-0">⚠️</span>
                <p className="ml-3 text-yellow-700">{error}</p>
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
            onInquiryClick={(listing) => router.push(`/listings/${listing.id}`)}
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
