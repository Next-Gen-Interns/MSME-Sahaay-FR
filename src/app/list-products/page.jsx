"use client";
// components/SellerDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  deleteListing,
  getUserListings,
  updateListingStatus,
} from "../api/productsAPI";
import ListingForm from "../components/Products/ListingForm";
import toast from "react-hot-toast";
import { useProfileCheck } from "../hooks/useProfileCheck";

const SellerDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);

  const {
    userData,
    loading: profileLoading,
    checkProfileCompletion,
  } = useProfileCheck();

  useEffect(() => {
    if (profileLoading) return;
    if (!userData) return;
    if (userData.role === "seller") {
      const isAllowed = checkProfileCompletion("seller");
      if (isAllowed) loadListings();
      else setLoading(false);
    } else {
      setLoading(false);
    }
  }, [userData, profileLoading]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const response = await getUserListings();
      setListings(response.data);
    } catch (error) {
      console.error("Error loading listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (listingId, newStatus) => {
    if (!checkProfileCompletion("seller")) return;
    try {
      await updateListingStatus(listingId, { status: newStatus });
      await loadListings();
      toast.success(
        `Service ${newStatus === "active" ? "activated" : "deactivated"}`,
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (listingId) => {
    if (!checkProfileCompletion("seller")) return;
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await deleteListing(listingId);
        await loadListings();
        toast.success("Service deleted");
      } catch (error) {
        toast.error("Failed to delete Service");
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingListing(null);
    loadListings();
    toast.success(editingListing ? "Service updated" : "Service created");
  };

  const handleEdit = (listing) => {
    if (!checkProfileCompletion("seller")) return;
    setEditingListing(listing);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    if (!checkProfileCompletion("seller")) return;
    setEditingListing(null);
    setShowForm(true);
  };

  /* ── Loading ── */
  if (profileLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[var(--color-accent-700)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-gray-500 text-sm">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  /* ── Not logged in ── */
  if (!userData) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-xs p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-yellow-50 border border-yellow-200 rounded flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">🔒</span>
          </div>
          <h2 className="text-base font-bold text-gray-900 mb-1">
            Authentication Required
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            Please login to access your seller dashboard
          </p>
          <button className="w-full py-2.5 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-sm font-bold rounded transition-colors">
            Login Now
          </button>
        </div>
      </div>
    );
  }

  /* ── Show form ── */
  if (showForm) {
    return (
      <ListingForm
        listing={editingListing}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingListing(null);
        }}
      />
    );
  }

  /* ── Incomplete profile ── */
  if (
    userData?.role === "seller" &&
    !userData.has_complete_profile &&
    userData.profile_completion?.total < 92
  ) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-xs p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] rounded flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-[var(--color-accent-500)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-base font-bold text-gray-900 mb-1">
            Complete Your Profile
          </h2>
          <p className="text-gray-500 text-sm mb-2">
            Complete your seller profile before accessing the dashboard.
          </p>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Profile Completion</span>
            <span className="font-bold text-[var(--color-accent-700)]">
              {userData.profile_completion?.total}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-5">
            <div
              className="bg-[var(--color-accent-700)] h-1.5 rounded-full transition-all"
              style={{ width: `${userData.profile_completion?.total}%` }}
            />
          </div>
          <button
            onClick={() => (window.location.href = "/profile")}
            className="w-full py-2.5 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-sm font-bold rounded transition-colors"
          >
            Go to Profile →
          </button>
        </div>
      </div>
    );
  }

  const activeCount = listings.filter((l) => l.status === "active").length;
  const draftCount = listings.filter((l) => l.status === "draft").length;
  const inactiveCount = listings.filter((l) => l.status === "inactive").length;

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* ══════════════════════════════════
          PAGE HEADER — IndiaMART style
      ══════════════════════════════════ */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-[var(--color-accent-700)]" />
            <div>
              <div className="text-[10px] text-gray-400 mb-0.5">
                Home › Seller › My Listings
              </div>
              <h1 className="text-sm font-bold text-gray-900">
                My Service Listings
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadListings}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 rounded transition-all"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-[11px] font-bold rounded transition-colors"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Listing
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* ══════════════════════════════════
            STATS ROW
        ══════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200 border border-gray-200 rounded-xs bg-white mb-4 overflow-hidden">
          {[
            {
              label: "Total Listings",
              value: listings.length,
              color: "text-gray-900",
            },
            { label: "Active", value: activeCount, color: "text-green-700" },
            { label: "Drafts", value: draftCount, color: "text-yellow-700" },
            { label: "Inactive", value: inactiveCount, color: "text-gray-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group flex items-center gap-4 px-5 py-4 hover:bg-[var(--color-accent-50)] transition-colors cursor-default relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--color-accent-700)] scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center" />
              <div>
                <div
                  className={`text-2xl font-extrabold leading-none ${stat.color}`}
                >
                  {stat.value}
                </div>
                <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mt-1">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════
            SELLER PROFILE COMPLETION BAR
        ══════════════════════════════════ */}
        {userData?.profile_completion && (
          <div className="bg-white border border-gray-200 rounded-xs px-5 py-3 mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-sm font-bold text-gray-700 flex-shrink-0">
                Profile Strength
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-1.5 min-w-0">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${userData.profile_completion.total}%`,
                    background:
                      userData.profile_completion.total >= 80
                        ? "var(--color-accent-600)"
                        : userData.profile_completion.total >= 50
                          ? "#f59e0b"
                          : "#ef4444",
                  }}
                />
              </div>
              <span className="text-sm font-bold text-[var(--color-accent-700)] flex-shrink-0">
                {userData.profile_completion.total}%
              </span>
            </div>
            {userData.profile_completion.total < 92 && (
              <button
                onClick={() => (window.location.href = "/profile")}
                className="flex-shrink-0 text-[11px] font-semibold text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] border border-[var(--color-accent-300)] hover:border-[var(--color-accent-500)] px-3 py-1.5 rounded transition-all"
              >
                Complete Profile →
              </button>
            )}
          </div>
        )}

        {/* ══════════════════════════════════
            LISTINGS
        ══════════════════════════════════ */}
        {listings.length === 0 ? (
          /* ── Empty State ── */
          <div className="bg-white border border-gray-200 rounded-xs overflow-hidden">
            <div className="text-center py-14 border-b border-gray-100 px-6">
              <div className="w-14 h-14 bg-[var(--color-accent-50)] border border-[var(--color-accent-100)] rounded flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 text-[var(--color-accent-400)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1m4 0h-4"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-1">
                No listings yet
              </h3>
              <p className="text-gray-400 text-sm mb-5">
                Start by creating your first service listing to attract
                customers
              </p>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-sm font-bold rounded transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Your First Listing
              </button>
            </div>
            <div className="px-6 py-5 bg-[var(--color-accent-50)] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[var(--color-accent-900)] mb-0.5">
                  💡 Why list on MSME Sahaay?
                </p>
                <p className="text-xs text-[var(--color-accent-600)]">
                  Reach thousands of buyers. Get direct leads. Build your brand.
                </p>
              </div>
              <div className="flex gap-4">
                {["Free listing", "Verified badge", "Direct leads"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-1 text-[11px] text-[var(--color-accent-700)] font-semibold"
                    >
                      <span className="text-green-600 font-black">✓</span>{" "}
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ── Listings List ── */
          <div className="space-y-3">
            {listings.map((listing) => {
              const isActive = listing.status === "active";
              const isDraft = listing.status === "draft";

              return (
                <div
                  key={listing.listing_id}
                  className="bg-white border border-gray-200 rounded-xs hover:border-[var(--color-accent-300)] hover:shadow-sm transition-all duration-200 overflow-hidden group"
                >
                  {/* Status top bar */}
                  <div
                    className={`h-0.5 w-full ${isActive ? "bg-green-500" : isDraft ? "bg-yellow-400" : "bg-gray-300"}`}
                  />

                  <div className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* ── Left: Image + Info ── */}
                      <div className="flex gap-4 flex-1 min-w-0">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0 w-20 h-20 rounded border border-gray-200 overflow-hidden bg-gray-50">
                          {listing.listing_media?.[0] ? (
                            <img
                              src={
                                (process.env.NEXT_PUBLIC_BACKEND_URL || "") +
                                listing.listing_media[0].file_path
                              }
                              alt={listing.title}
                              className="w-full h-full object-cover"
                              onError={(e) =>
                                (e.target.src = "/placeholder-image.jpg")
                              }
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Text info */}
                        <div className="min-w-0 flex-1">
                          {/* Title row */}
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-[var(--color-accent-700)] transition-colors">
                              {listing.title}
                            </h3>
                            {/* Status badge */}
                            <span
                              className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                                isActive
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : isDraft
                                    ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                    : "bg-gray-100 text-gray-500 border border-gray-200"
                              }`}
                            >
                              {listing.status}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-2">
                            {listing.description}
                          </p>

                          {/* Info chips */}
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-[var(--color-accent-50)] text-[var(--color-accent-700)] border border-[var(--color-accent-100)] rounded">
                              {listing.service_type?.replace("_", " ")}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-50 text-gray-600 border border-gray-200 rounded">
                              {listing.pricing_model?.replace("_", " ")}
                            </span>
                            <span className="text-[10px] font-bold text-gray-700">
                              ₹{Number(listing.min_price).toLocaleString()} – ₹
                              {Number(listing.max_price).toLocaleString()}
                            </span>
                            {listing.estimated_timeline && (
                              <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
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
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {listing.estimated_timeline}
                              </span>
                            )}
                          </div>

                          {/* Tags */}
                          {listing.tags && listing.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {listing.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ── Right: Actions ── */}
                      <div className="flex-shrink-0 flex flex-row lg:flex-col gap-2 lg:w-36">
                        {/* Edit */}
                        <button
                          onClick={() => handleEdit(listing)}
                          className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded transition-all"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>

                        {/* Activate / Deactivate */}
                        {isActive ? (
                          <button
                            onClick={() =>
                              handleStatusUpdate(listing.listing_id, "inactive")
                            }
                            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 rounded transition-all"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleStatusUpdate(listing.listing_id, "active")
                            }
                            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white rounded transition-all"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-300 flex-shrink-0" />
                            Activate
                          </button>
                        )}

                        {/* View */}
                        <button
                          onClick={() =>
                            (window.location.href = `/listings/${listing.listing_id}`)
                          }
                          className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold border border-[var(--color-accent-300)] text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] bg-white rounded transition-all"
                        >
                          <svg
                            className="w-3.5 h-3.5"
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
                          View
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(listing.listing_id)}
                          className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-all"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ── Bottom CTA — create more ── */}
            <div className="bg-white border border-dashed border-[var(--color-accent-300)] rounded-xs px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-gray-700">
                  Add another listing
                </p>
                <p className="text-[11px] text-gray-400">
                  More listings = more visibility = more leads.
                </p>
              </div>
              <button
                onClick={handleCreateNew}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-xs font-bold rounded transition-colors"
              >
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create New Listing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
