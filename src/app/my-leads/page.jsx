"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  DollarSign,
  Clock,
  Phone,
  Mail,
  Video,
  MapPin,
  User,
  AlertCircle,
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
  MessageSquare,
  Eye,
  Star,
  FileText,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { getBuyerLeads } from "@/app/api/leadAPI";
import ChatDrawer from "../components/Leads/ChatDrawer";

const MyLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [openChatLead, setOpenChatLead] = useState(null);
  const [leadName, setLeadName] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await getBuyerLeads();
      if (response.data && Array.isArray(response.data.leads)) {
        setLeads(response.data.leads);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("No Inquiries Found");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeads();
  };

  const filteredLeads = leads
    .filter((lead) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        lead.project_title?.toLowerCase().includes(q) ||
        lead.listing?.title?.toLowerCase().includes(q) ||
        lead.listing?.seller?.business_name?.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "urgent":
          return b.is_urgent === a.is_urgent ? 0 : b.is_urgent ? -1 : 1;
        default:
          return 0;
      }
    });

  const statusConfig = {
    new: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
      label: "New",
    },
    contacted: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      dot: "bg-purple-500",
      label: "Contacted",
    },
    responded: {
      bg: "bg-[var(--color-accent-50)]",
      text: "text-[var(--color-accent-700)]",
      border: "border-[var(--color-accent-200)]",
      dot: "bg-[var(--color-accent-500)]",
      label: "Responded",
    },
    quoted: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
      label: "Quoted",
    },
    closed: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      dot: "bg-green-500",
      label: "Closed",
    },
    rejected: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      dot: "bg-red-500",
      label: "Rejected",
    },
  };

  const budgetLabels = {
    under_1k: "Under ₹1,000",
    k_1_5: "₹1K–₹5K",
    k_5_10: "₹5K–₹10K",
    k_10_25: "₹10K–₹25K",
    k_25_50: "₹25K–₹50K",
    k_50_100: "₹50K–₹1L",
    k_100_plus: "₹1L+",
  };
  const timelineLabels = {
    immediately: "Immediately",
    weeks_1_2: "1-2 Weeks",
    month_1: "1 Month",
    flexible: "Flexible",
  };
  const contactIcons = {
    email: Mail,
    phone: Phone,
    video_call: Video,
    in_person: MapPin,
  };

  const formatDate = (d) =>
    !d
      ? "-"
      : new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

  const getTimeAgo = (dateString) => {
    if (!dateString) return "-";
    const diff = Math.floor(
      (new Date() - new Date(dateString)) / (1000 * 60 * 60),
    );
    if (diff < 1) return "Just now";
    if (diff < 24) return `${diff}h ago`;
    if (diff < 168) return `${Math.floor(diff / 24)}d ago`;
    return formatDate(dateString);
  };

  const getStatus = (status) => statusConfig[status] || statusConfig.new;

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[var(--color-accent-700)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-gray-500 text-sm">
            Loading your inquiries...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* ══════════════════════════════════
          PAGE HEADER
      ══════════════════════════════════ */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-[var(--color-accent-700)]" />
            <div>
              <div className="text-[10px] text-gray-400 mb-0.5">
                Home › My Inquiries
              </div>
              <h1 className="text-sm font-bold text-gray-900">My Inquiries</h1>
            </div>
            <span className="text-[10px] text-[var(--color-accent-700)] bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] px-2 py-0.5 rounded font-bold">
              {leads.length} total
            </span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 rounded transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* ══════════════════════════════════
            STATS ROW
        ══════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200 border border-gray-200 rounded-sm bg-white mb-4 overflow-hidden">
          {[
            {
              label: "New Leads",
              value: leads.filter((l) => l.status === "new").length,
              icon: <FileText className="w-4 h-4" />,
            },
            {
              label: "Active",
              value: leads.filter(
                (l) => l.status === "responded" || l.status === "contacted",
              ).length,
              icon: <CheckCircle className="w-4 h-4" />,
            },
            {
              label: "Urgent",
              value: leads.filter((l) => l.is_urgent).length,
              icon: <AlertCircle className="w-4 h-4" />,
            },
            {
              label: "Conversations",
              value: leads.reduce(
                (t, l) => t + (l._count?.conversations || 0),
                0,
              ),
              icon: <MessageSquare className="w-4 h-4" />,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group flex items-center gap-4 px-5 py-4 hover:bg-[var(--color-accent-50)] transition-colors cursor-default relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--color-accent-700)] scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center" />
              <div className="w-8 h-8 rounded bg-[var(--color-accent-50)] border border-[var(--color-accent-100)] flex items-center justify-center text-[var(--color-accent-600)] flex-shrink-0">
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900 leading-none">
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
            SEARCH + FILTERS BAR
        ══════════════════════════════════ */}
        <div className="bg-white border border-gray-200 rounded-sm px-4 py-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by project, listing, or business..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-[11px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] bg-white text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-[11px] font-semibold border border-gray-300 rounded px-2.5 py-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-500)]"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="responded">Responded</option>
              <option value="quoted">Quoted</option>
              <option value="closed">Closed</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-[11px] font-semibold border border-gray-300 rounded px-2.5 py-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-500)]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="urgent">Urgent First</option>
            </select>

            {/* Results count */}
            {(searchTerm || statusFilter !== "all") && (
              <span className="text-[10px] text-gray-400 font-semibold flex-shrink-0">
                {filteredLeads.length} result
                {filteredLeads.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════
            LEADS LIST
        ══════════════════════════════════ */}
        {filteredLeads.length === 0 ? (
          /* ── Empty State ── */
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <div className="text-center py-14 px-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-[var(--color-accent-50)] border border-[var(--color-accent-100)] rounded flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-[var(--color-accent-400)]" />
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-1">
                {searchTerm || statusFilter !== "all"
                  ? "No matching inquiries"
                  : "No inquiries yet"}
              </h3>
              <p className="text-gray-400 text-sm mb-5">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Start by sending inquiries to service providers"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-sm font-bold rounded transition-colors"
                >
                  Browse Services →
                </Link>
              )}
            </div>
            <div className="px-6 py-4 bg-[var(--color-accent-50)] flex items-center justify-between gap-3">
              <p className="text-xs text-[var(--color-accent-700)] font-medium">
                💡 Send inquiries to sellers and track all responses here in one
                place.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLeads.map((lead) => {
              const ContactIcon = contactIcons[lead.contact_preference] || Mail;
              const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
              const sCfg = getStatus(lead.status);
              const hasMessages = lead._count?.conversations > 0;

              return (
                <article
                  key={lead.lead_id}
                  className="bg-white border border-gray-200 rounded-sm hover:border-[var(--color-accent-300)] hover:shadow-sm transition-all duration-200 overflow-hidden group"
                >
                  {/* Status top bar */}
                  <div
                    className={`h-0.5 w-full ${
                      lead.status === "closed"
                        ? "bg-green-500"
                        : lead.status === "rejected"
                          ? "bg-red-400"
                          : lead.status === "quoted"
                            ? "bg-amber-400"
                            : lead.status === "new"
                              ? "bg-blue-500"
                              : "bg-[var(--color-accent-500)]"
                    }`}
                  />

                  <div className="p-4">
                    <div className="flex flex-col lg:flex-row gap-5">
                      {/* ── LEFT: Lead info ── */}
                      <div className="flex-1 min-w-0">
                        {/* Title + status + urgent + time */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-sm font-bold text-gray-900 group-hover:text-[var(--color-accent-700)] transition-colors">
                            {lead.project_title}
                          </h3>

                          {/* Status badge */}
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${sCfg.bg} ${sCfg.text} ${sCfg.border}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`}
                            />
                            {sCfg.label}
                          </span>

                          {/* Urgent badge */}
                          {lead.is_urgent && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border uppercase bg-red-50 text-red-700 border-red-200">
                              <AlertCircle className="w-3 h-3" />
                              Urgent
                            </span>
                          )}

                          {/* Time */}
                          <span className="text-[10px] text-gray-400 font-medium ml-auto">
                            {getTimeAgo(lead.created_at)}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-3">
                          {lead.project_description}
                        </p>

                        {/* Meta chips */}
                        <div className="flex flex-wrap gap-2 items-center mb-3">
                          <span className="flex items-center gap-1 text-[10px] text-gray-600 font-semibold bg-gray-50 border border-gray-200 px-2 py-1 rounded">
                            <DollarSign className="w-3 h-3 text-gray-400" />
                            {budgetLabels[lead.budget_range] ||
                              lead.budget_range}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-gray-600 font-semibold bg-gray-50 border border-gray-200 px-2 py-1 rounded">
                            <ClockIcon className="w-3 h-3 text-gray-400" />
                            {timelineLabels[lead.timeline] || lead.timeline}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-gray-600 font-semibold bg-gray-50 border border-gray-200 px-2 py-1 rounded">
                            <ContactIcon className="w-3 h-3 text-gray-400" />
                            {lead.contact_preference?.replace("_", " ")}
                          </span>
                          {hasMessages && (
                            <span className="flex items-center gap-1 text-[10px] text-[var(--color-accent-700)] font-bold bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] px-2 py-1 rounded">
                              <MessageSquare className="w-3 h-3" />
                              {lead._count.conversations} message
                              {lead._count.conversations !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        {/* Custom requirements */}
                        {lead.custom_requirements && (
                          <div className="bg-gray-50 border border-gray-100 rounded px-3 py-2">
                            <p className="text-[11px] text-gray-500 leading-relaxed">
                              <span className="font-bold text-gray-600">
                                Note:{" "}
                              </span>
                              {lead.custom_requirements}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* ── RIGHT: Listing card + actions ── */}
                      <div className="lg:w-64 flex-shrink-0 flex flex-col gap-3">
                        {/* Listing info box */}
                        <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 flex gap-3">
                          {/* Thumbnail */}
                          <div className="w-14 h-14 rounded border border-gray-200 overflow-hidden bg-white flex-shrink-0">
                            {lead.listing?.listing_media?.[0] ? (
                              <img
                                src={`${baseUrl}${lead.listing.listing_media[0].file_path}`}
                                alt={lead.listing?.title}
                                className="w-full h-full object-cover"
                                onError={(e) =>
                                  (e.target.src = "/placeholder-image.jpg")
                                }
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <FileText className="w-5 h-5" />
                              </div>
                            )}
                          </div>

                          {/* Listing text */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-gray-800 line-clamp-1 leading-tight">
                              {lead.listing?.title}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <User className="w-3 h-3 text-gray-400" />
                              <p className="text-[10px] text-gray-500 font-semibold truncate">
                                {lead.listing?.seller?.business_name}
                              </p>
                              {lead.listing?.seller?.overall_rating > 0 && (
                                <span className="flex items-center gap-0.5 text-[10px] text-amber-600 font-bold ml-1">
                                  <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                                  {lead.listing.seller.overall_rating}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {[
                                lead.listing?.service_type?.replace("_", " "),
                                `₹${lead.listing?.min_price?.toLocaleString()}–₹${lead.listing?.max_price?.toLocaleString()}`,
                              ]
                                .filter(Boolean)
                                .map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[9px] px-1.5 py-0.5 bg-[var(--color-accent-50)] text-[var(--color-accent-700)] border border-[var(--color-accent-100)] rounded font-semibold"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-2">
                          {/* Chat / Messages */}
                          <button
                            onClick={() => {
                              setLeadName(lead.project_title);
                              setOpenChatLead(lead);
                            }}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-bold rounded transition-all ${
                              hasMessages
                                ? "bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white"
                                : "border border-[var(--color-accent-300)] text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] bg-white"
                            }`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {hasMessages
                              ? `View Messages (${lead._count.conversations})`
                              : "Start Chat"}
                          </button>

                          {/* View Listing */}
                          <Link
                            href={`/listings/${lead.listing_id}`}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Listing
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Results summary */}
            <div className="bg-white border border-gray-200 rounded-sm px-4 py-3 flex items-center justify-between">
              <p className="text-[11px] text-gray-500">
                Showing{" "}
                <span className="font-bold text-gray-800">
                  {filteredLeads.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-800">{leads.length}</span>{" "}
                inquiries
              </p>
              <Link
                href="/listings"
                className="text-[11px] font-semibold text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] hover:underline transition-colors"
              >
                Browse more services →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Chat Drawer */}
      {openChatLead && (
        <ChatDrawer
          key={openChatLead.lead_id}
          leadId={openChatLead.lead_id}
          onClose={() => setOpenChatLead(null)}
          leadName={leadName}
        />
      )}
    </div>
  );
};

export default MyLeadsPage;
