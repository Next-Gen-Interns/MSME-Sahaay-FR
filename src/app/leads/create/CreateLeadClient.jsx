"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateLeadPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listingId = searchParams.get("listing_id");

  const [listing, setListing] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  const fetchListing = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/listing/${listingId}`,
    );
    const data = await res.json();
    setListing(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lead/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            listing_id: listingId,
            project_description: description,
            contact_preference: "video_call",
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push("/my-leads");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!listing)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Book Consultation
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Send your consultation request to the expert below.
          </p>
        </div>

        {/* Expert Summary Card */}
        <div className="bg-white rounded-lg border p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {listing.title}
          </h2>

          <p className="text-sm text-gray-600 mt-2">{listing.description}</p>

          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="text-gray-500">Consultation Fee</span>
            <span className="font-medium text-gray-900">
              ₹ {listing.min_price}
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Describe Your Business Requirement
              </label>
              <textarea
                required
                rows={5}
                placeholder="Example: I need help with GST registration for my new manufacturing business..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-700)]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide clear details to help the expert understand your needs.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-800)] text-white py-2.5 rounded-md text-sm font-medium transition"
            >
              {loading ? "Submitting..." : "Send Consultation Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
