"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const experts = [
  {
    id: 1,
    name: "Rajesh Kumar Sharma",
    title: "Business Finance Consultant",
    category: "Finance",
    rating: 4.9,
    reviews: 128,
    experience: "12 years",
    location: "Delhi, India",
    badges: ["Top Rated", "MSME Specialist"],
    avatar: "RK",
    expertise: [
      "MSME Loans",
      "Working Capital",
      "GST Filing",
      "Business Planning",
    ],
    verified: true,
    consultations: 340,
  },
  {
    id: 2,
    name: "Priya Mehta",
    title: "Legal & Compliance Advisor",
    category: "Legal",
    rating: 4.8,
    reviews: 95,
    experience: "9 years",
    location: "Mumbai, India",
    badges: ["Verified Expert"],
    avatar: "PM",
    expertise: [
      "MSME Registration",
      "Udyam Certificate",
      "Labour Laws",
      "Compliance",
    ],
    verified: true,
    consultations: 210,
  },
  {
    id: 3,
    name: "Amit Singh",
    title: "Digital Marketing Strategist",
    category: "Marketing",
    rating: 4.7,
    reviews: 74,
    experience: "7 years",
    location: "Bangalore, India",
    badges: ["Rising Star"],
    avatar: "AS",
    expertise: [
      "Digital Marketing",
      "Lead Generation",
      "Brand Building",
      "SEO",
    ],
    verified: true,
    consultations: 175,
  },
  {
    id: 4,
    name: "Sunita Agarwal",
    title: "Government Scheme Consultant",
    category: "Schemes",
    rating: 5.0,
    reviews: 203,
    experience: "15 years",
    location: "Ahmedabad, India",
    badges: ["Top Rated", "Government Expert"],
    avatar: "SA",
    expertise: ["PMEGP", "CGTMSE", "Mudra Loans", "Subsidy Schemes"],
    verified: true,
    consultations: 520,
  },
  {
    id: 5,
    name: "Deepak Verma",
    title: "Tax & Accounting Expert",
    category: "Finance",
    rating: 4.8,
    reviews: 112,
    experience: "11 years",
    location: "Pune, India",
    badges: ["Verified Expert"],
    avatar: "DV",
    expertise: ["Income Tax", "GST Returns", "Audit", "Bookkeeping"],
    verified: true,
    consultations: 290,
  },
  {
    id: 6,
    name: "Kavitha Nair",
    title: "Business Development Mentor",
    category: "Strategy",
    rating: 4.9,
    reviews: 88,
    experience: "10 years",
    location: "Chennai, India",
    badges: ["Rising Star", "MSME Specialist"],
    avatar: "KN",
    expertise: ["Business Strategy", "Scaling", "B2B Sales", "Partnerships"],
    verified: true,
    consultations: 198,
  },
];

const categories = [
  "All",
  "Finance",
  "Legal",
  "Marketing",
  "Schemes",
  "Strategy",
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ExpertCard = ({ expert }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-[var(--color-accent-700)] rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {expert.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base truncate">
            {expert.name}
          </h3>
          <p className="text-gray-500 text-sm mt-0.5 truncate">
            {expert.title}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <StarRating rating={expert.rating} />
            <span className="text-xs font-medium text-gray-700">
              {expert.rating}
            </span>
            <span className="text-xs text-gray-400">({expert.reviews})</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {expert.badges.map((badge) => (
          <span
            key={badge}
            className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
          >
            {badge}
          </span>
        ))}
      </div>

      {/* Expertise Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {expert.expertise.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-600"
          >
            {skill}
          </span>
        ))}
        {expert.expertise.length > 3 && (
          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-500">
            +{expert.expertise.length - 3}
          </span>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pt-3 border-t border-gray-100">
        <span>{expert.experience} exp.</span>
        <span>{expert.consultations} sessions</span>
        <span>{expert.location.split(",")[0]}</span>
      </div>

      {/* CTA Button */}
      <button className="w-full py-2.5 px-4 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-800)] text-white text-sm font-medium rounded-lg transition-colors">
        Book Consultation
      </button>
    </div>
  );
};

export default function VerifiedExpertsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = experts.filter((e) => {
    const matchCat =
      selectedCategory === "All" || e.category === selectedCategory;
    const matchSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.expertise.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 ">
          <h1 className="flex items-center justify-center text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Verified MSME Experts
          </h1>
          <p className="flex items-center justify-center text-gray-600">
            Connect with verified consultants for finance, legal, marketing, and
            government schemes.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative max-w-md flex items-center justify-center">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search experts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[var(--color-accent-500)]"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-[var(--color-accent-700)] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {filtered.length} experts
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
        </p>

        {/* Expert Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">
              No experts found matching your criteria.
            </p>
          </div>
        )}

        {/* Become an Expert CTA */}
        <div className="mt-10 bg-[var(--color-accent-700)] rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            Are you an MSME Expert?
          </h2>
          <p className="text-gray-300 mb-4 max-w-md mx-auto text-sm">
            Join our verified network and help businesses grow.
          </p>
          <button className="bg-white text-gray-900 font-medium px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm">
            Apply as Expert
          </button>
        </div>
      </main>
    </div>
  );
}
