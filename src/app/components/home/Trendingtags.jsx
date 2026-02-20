"use client";
import React, { useEffect, useState } from "react";
import { getTrendingListings } from "../../api/homeAPI";
import { useRouter } from "next/navigation";

const CARD_COLORS = [
  "bg-[var(--color-accent-900)]",
  "bg-[var(--color-accent-800)]",
  "bg-[var(--color-accent-700)]",
  "bg-[var(--color-accent-600)]",
  "bg-[var(--color-accent-800)]",
  "bg-[var(--color-accent-900)]",
  "bg-[var(--color-accent-700)]", // Extra color for 7th item
];

export default function ExpandableServices() {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [cards, setCards] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  const handleClick = (subcategoryId) => {
    if (!subcategoryId) return;
    router.push(`/categories/subcategory/${subcategoryId}/listings`);
  };

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await getTrendingListings();
        const rep = res?.data?.data?.listings || [];

        // Create a Set to track unique titles
        const seenTitles = new Set();
        const uniqueCards = [];

        // Get up to 7 items, but ensure they're unique
        for (const item of rep) {
          const title = item.subcategory || item.title;

          // Skip if title already exists or is undefined/empty
          if (!title || seenTitles.has(title)) continue;

          seenTitles.add(title);

          uniqueCards.push({
            title: title,
            description:
              item.subcategory_description ||
              item.description ||
              "No description available",
            img: item.subcategory_image || item.images?.[0] || "/no-image.png",
            trend: `+${Math.floor(Math.random() * 80) + 20}%`,
            color: CARD_COLORS[uniqueCards.length % CARD_COLORS.length],
            subcategory_id: item.subcategory_id,
          });

          // Stop when we have 7 unique items
          if (uniqueCards.length >= 7) break;
        }

        // If we don't have enough unique items, add fallbacks
        if (uniqueCards.length < 6) {
          const fallbackTitles = [
            "Web Development",
            "Digital Marketing",
            "Graphic Design",
            "Content Writing",
            "SEO Services",
            "Mobile Apps",
            "UI/UX Design",
          ];

          for (let i = uniqueCards.length; i < 6; i++) {
            const fallbackTitle = fallbackTitles[i] || `Service ${i + 1}`;
            if (!seenTitles.has(fallbackTitle)) {
              uniqueCards.push({
                title: fallbackTitle,
                description:
                  "Premium service available for your business needs",
                img: `/104.jpeg`,
                trend: `+${Math.floor(Math.random() * 80) + 20}%`,
                color: CARD_COLORS[i % CARD_COLORS.length],
                subcategory_id: `fallback-${i}`,
              });
            }
          }
        }

        setCards(uniqueCards);
      } catch (error) {
        console.error("Error fetching trending listings:", error);

        // Fallback data if API fails
        const fallbackCards = [
          {
            title: "Web Development",
            description: "Custom websites and web applications",
            img: "/web-dev.jpg",
            trend: "+65%",
            color: CARD_COLORS[0],
            subcategory_id: "1",
          },
          {
            title: "Digital Marketing",
            description: "Social media and online marketing strategies",
            img: "/digital-marketing.jpg",
            trend: "+72%",
            color: CARD_COLORS[1],
            subcategory_id: "2",
          },
          {
            title: "Graphic Design",
            description: "Logo, branding, and visual identity design",
            img: "/graphic-design.jpg",
            trend: "+58%",
            color: CARD_COLORS[2],
            subcategory_id: "3",
          },
          {
            title: "Content Writing",
            description: "Blog posts, articles, and SEO content",
            img: "/content-writing.jpg",
            trend: "+45%",
            color: CARD_COLORS[3],
            subcategory_id: "4",
          },
          {
            title: "Mobile Apps",
            description: "iOS and Android app development",
            img: "/mobile-apps.jpg",
            trend: "+81%",
            color: CARD_COLORS[4],
            subcategory_id: "5",
          },
          {
            title: "SEO Services",
            description: "Search engine optimization and ranking",
            img: "/seo-services.jpg",
            trend: "+67%",
            color: CARD_COLORS[5],
            subcategory_id: "6",
          },
        ];
        setCards(fallbackCards);
      }
    }

    fetchTrending();
  }, []);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  // Mobile view - Simple boxes with names only
  if (isMobile) {
    return (
      <section className="py-8 bg-[var(--color-accent-200)]">
        <h2 className="text-3xl text-center font-semibold text-[var(--color-black-darker)] mb-6">
          Trending Services
        </h2>

        <div className="px-4">
          <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide">
            {cards.map((c, i) => (
              <div
                key={i}
                onClick={() => handleClick(c.subcategory_id)}
                className={`
                  flex-shrink-0 w-32 h-32 rounded-xl relative overflow-hidden cursor-pointer
                  transition-all duration-300 hover:scale-105 active:scale-95
                  ${c.color}
                `}
              >
                {/* Background Image with Overlay */}
                <img
                  src={c.img}
                  alt={c.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-50" />

                {/* Content */}
                <div className="relative h-full flex items-center justify-center p-3">
                  <h3 className="text-white font-semibold text-center text-sm leading-tight line-clamp-3">
                    {c.title}
                  </h3>
                </div>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 ${c.color}`}
                />
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </section>
    );
  }

  // Desktop view - Original expandable cards
  return (
    <section className="py-10 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 rounded-full bg-[var(--color-accent-700)]" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                Trending Services
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Discover verified experts across AI, development, tech &
                creative fields
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

        {/* ── Main Layout ── */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* ── Left: Info Panel ── */}
          <div className="lg:w-[220px] flex-shrink-0 bg-[var(--color-accent-50)] border border-[var(--color-accent-100)] rounded-sm p-5 flex flex-col justify-center">
            <div className="mb-4">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-600)] bg-[var(--color-accent-100)] px-2 py-0.5 rounded mb-3">
                Hot Right Now
              </span>
              <h3 className="text-lg font-bold text-gray-900 leading-snug">
                Great Business Opportunities
              </h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Discover trending services from verified experts. Expand your
              business with AI, development, tech & creative fields.
            </p>

            {/* Trust indicators */}
            <div className="space-y-2.5 pt-4 border-t border-[var(--color-accent-200)]">
              {[
                { icon: "✓", text: "Verified Providers" },
                { icon: "✓", text: "Trusted by 10,000+ MSMEs" },
                { icon: "✓", text: "Quick Response Guaranteed" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[var(--color-accent-700)] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </span>
                  <span className="text-[11px] text-gray-600 font-medium">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Accordion Cards ── */}
          <div className="flex-1 h-[340px] flex gap-2 overflow-hidden rounded-sm">
            {cards.map((c, i) => (
              <div
                key={i}
                onMouseEnter={() => setExpandedIndex(i)}
                className={`
              relative overflow-hidden cursor-pointer
              transition-all duration-[900ms] rounded-sm
              ${expandedIndex === i ? "flex-[4]" : "flex-[1.5]"}
            `}
              >
                {/* IMAGE */}
                <img
                  src={c.img}
                  alt={c.title}
                  className={`
                absolute inset-0 w-full h-full object-cover
                transition-all duration-[1000ms]
                ${expandedIndex === i ? "scale-100" : "scale-105"}
                ${loadedImages[i] ? "opacity-100" : "opacity-0"}
              `}
                  onLoad={() => handleImageLoad(i)}
                />

                {/* Dark overlay */}
                <div
                  className={`absolute inset-0 bg-black transition-opacity duration-500 ${
                    expandedIndex === i ? "opacity-50" : "opacity-65"
                  }`}
                />

                {/* Color tint overlay */}
                <div className={`absolute inset-0 ${c.color} opacity-40`} />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-3">
                  {/* COLLAPSED: vertical title */}
                  <div
                    className={`transition-all duration-500 ${
                      expandedIndex === i
                        ? "opacity-0 invisible"
                        : "opacity-100 visible"
                    }`}
                  >
                    <h3 className="text-[11px] text-white font-bold whitespace-nowrap rotate-180 writing-mode-vertical tracking-wider">
                      {c.title}
                    </h3>
                  </div>

                  {/* EXPANDED: full content */}
                  <div
                    className={`transition-all duration-500 ${
                      expandedIndex === i
                        ? "opacity-100 visible"
                        : "opacity-0 invisible absolute"
                    }`}
                  >
                    {/* Category pill */}
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-sm text-white border border-white/30 px-2 py-0.5 rounded mb-2">
                      {c.title}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1.5 drop-shadow leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-[11px] text-white/80 font-medium mb-4 max-w-xs leading-relaxed">
                      {c.description}
                    </p>

                    <button
                      onClick={() => handleClick(c.subcategory_id)}
                      className="inline-flex items-center gap-1.5 bg-white text-gray-900 px-4 py-1.5 rounded text-xs font-bold hover:bg-[var(--color-accent-50)] transition-all duration-150 shadow-sm"
                    >
                      Explore Now
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

                  {/* Bottom accent bar */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-white transition-all duration-500 ${
                      expandedIndex === i ? "opacity-80" : "opacity-0"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </section>
  );
}
