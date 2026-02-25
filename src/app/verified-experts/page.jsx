"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
            star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
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
  const router = useRouter();
  const sellerUser = expert.seller?.user;

  const handleBooking = () => {
    if (!expert.consultation_listing_id) return;
    router.push(`/leads/create?listing_id=${expert.consultation_listing_id}`);
  };

  return (
    <div className="bg-white rounded-xs border border-gray-200 p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-[var(--color-accent-700)] rounded-xs flex items-center justify-center text-white font-bold text-lg">
          {sellerUser?.fullname?.slice(0, 2).toUpperCase()}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 truncate">
            {sellerUser?.fullname}
          </h3>
          <p className="text-gray-500 text-sm">{expert.category} Consultant</p>

          <div className="flex items-center gap-1.5 mt-1">
            <StarRating rating={expert.average_rating || 0} />
            <span className="text-xs">{expert.average_rating || 0}</span>
            <span className="text-xs text-gray-400">
              ({expert.reviews_count || 0})
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {(expert.expertise || []).slice(0, 3).map((skill, i) => (
          <span
            key={i}
            className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-600"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex justify-between text-xs text-gray-500 mb-4 pt-3 border-t">
        <span>{expert.experience_years} yrs exp.</span>
        <span>₹ {expert.consultation_fee || 0}</span>
        <span>{expert.seller?.business_name}</span>
      </div>

      <button
        onClick={handleBooking}
        className="w-full py-2.5 bg-[var(--color-accent-700)] text-white rounded-xs text-sm"
      >
        Book Consultation
      </button>
    </div>
  );
};

export default function VerifiedExpertsPage() {
  const [experts, setExperts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [expertStatus, setExpertStatus] = useState(null);

  useEffect(() => {
    fetchExperts();
  }, [selectedCategory]);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const params =
        selectedCategory !== "All" ? `?category=${selectedCategory}` : "";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/experts${params}`,
      );

      const data = await res.json();
      setExperts(data);
    } catch (error) {
      console.error("Error fetching experts:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchExpertStatus = async (token) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/experts/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      setExpertStatus(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    setUserRole(payload.role);

    if (payload.role === "seller") {
      fetchExpertStatus(token);
    }
  }, []);

  const filtered = experts.filter((e) => {
    const matchSearch =
      e.seller?.user?.fullname
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      e.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.expertise || []).some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Verified MSME Experts
          </h1>
          <p className="text-gray-600">
            Connect with verified consultants for finance, legal, marketing, and
            government schemes.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Search experts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md mx-auto block px-4 py-2 border rounded-xs text-sm"
          />

          <div className="flex justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xs text-sm ${
                  selectedCategory === cat
                    ? "bg-[var(--color-accent-700)] text-white"
                    : "bg-white border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Expert Grid */}
        {loading ? (
          <div className="text-center py-12">Loading experts...</div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((expert) => (
              <ExpertCard key={expert.expert_id} expert={expert} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border rounded-xs">
            No experts found.
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-[var(--color-accent-700)] rounded-xs p-6 text-center text-white">
          <h2 className="text-xl font-semibold mb-2">
            Are you an MSME Expert?
          </h2>

          {userRole !== "seller" ? (
            <p className="text-sm">
              Only registered sellers can apply as experts.
            </p>
          ) : expertStatus?.applied ? (
            expertStatus.is_verified ? (
              <p className="text-sm font-medium">
                ✅ You are already a verified expert.
              </p>
            ) : (
              <p className="text-sm font-medium">
                ⏳ Your application is under review.
              </p>
            )
          ) : (
            <>
              <p className="text-sm mb-4">
                Join our verified network and help businesses grow.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-white text-gray-900 px-5 py-2 rounded-xs text-sm"
              >
                Apply as Expert
              </button>
            </>
          )}
        </div>

        {/* Modal */}
        {showModal && <ApplyExpertModal onClose={() => setShowModal(false)} />}
      </main>
    </div>
  );
}

/* ===================== MODAL ===================== */

function ApplyExpertModal({ onClose }) {
  const [formData, setFormData] = useState({
    category: "",
    experience_years: "",
    consultation_fee: "",
    expertise: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as seller.");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/experts/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category: formData.category,
            experience_years: parseInt(formData.experience_years),
            consultation_fee: parseFloat(formData.consultation_fee),
            expertise: formData.expertise
              .split(",")
              .map((e) => e.trim()),
            bio: formData.bio,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("Application submitted successfully!");
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl relative">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Apply as MSME Expert</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">

          {error && (
            <div className="mb-3 text-xs text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-3 text-xs text-green-600 bg-green-50 p-2 rounded">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Category */}
            <div>
              <label className="text-xs font-medium text-gray-700">
                Category
              </label>
              <input
                name="category"
                placeholder="Finance, Legal, Marketing"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 w-full border px-3 py-2 rounded text-sm focus:ring-1 focus:ring-[var(--color-accent-700)] focus:outline-none"
              />
            </div>

            {/* Experience + Fee in 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  name="experience_years"
                  placeholder="8"
                  value={formData.experience_years}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border px-3 py-2 rounded text-sm focus:ring-1 focus:ring-[var(--color-accent-700)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">
                  Consultation Fee (₹)
                </label>
                <input
                  type="number"
                  name="consultation_fee"
                  placeholder="1500"
                  value={formData.consultation_fee}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border px-3 py-2 rounded text-sm focus:ring-1 focus:ring-[var(--color-accent-700)] focus:outline-none"
                />
              </div>
            </div>

            {/* Expertise */}
            <div>
              <label className="text-xs font-medium text-gray-700">
                Expertise Areas
              </label>
              <input
                name="expertise"
                placeholder="GST Filing, MSME Loans, Startup Advisory"
                value={formData.expertise}
                onChange={handleChange}
                required
                className="mt-1 w-full border px-3 py-2 rounded text-sm focus:ring-1 focus:ring-[var(--color-accent-700)] focus:outline-none"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Separate skills with commas.
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="text-xs font-medium text-gray-700">
                Short Professional Bio
              </label>
              <textarea
                name="bio"
                rows={3}
                placeholder="Briefly describe your expertise and how you help MSMEs..."
                value={formData.bio}
                onChange={handleChange}
                required
                className="mt-1 w-full border px-3 py-2 rounded text-sm focus:ring-1 focus:ring-[var(--color-accent-700)] focus:outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-accent-700)] text-white py-2.5 rounded text-sm font-medium hover:bg-[var(--color-accent-800)] transition"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}