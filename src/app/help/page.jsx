"use client";
import React, { useState } from "react";
import Link from "next/link";
import { submitSupportFeedback } from "../api/supportAPI";

const HelpSupportPage = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const helpCategories = [
    {
      id: "all",
      label: "All Help",
      icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    },
    {
      id: "getting-started",
      label: "Getting Started",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
    },
    {
      id: "account",
      label: "Account & Profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      id: "listings",
      label: "Listings & Products",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    },
    {
      id: "buying",
      label: "Buying & Payments",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    },
    {
      id: "selling",
      label: "Selling & Orders",
      icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
    },
    {
      id: "technical",
      label: "Technical Support",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    },
    {
      id: "billing",
      label: "Billing & Subscription",
      icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z",
    },
  ];

  const faqs = [
    {
      id: 1,
      category: "getting-started",
      question: "How do I create a business listing on MSME Sahaay?",
      answer:
        'To create a business listing, click on "Add Listing" in the top navigation bar. Fill in your business details, upload images, select relevant categories, and publish. Your listing will be reviewed and activated within 24 hours.',
    },
    {
      id: 2,
      category: "getting-started",
      question: "Is it free to list my business?",
      answer:
        "Yes, basic business listing is completely free. We offer premium plans with enhanced features like priority placement, analytics, and verified badges for businesses looking to grow faster.",
    },
    {
      id: 3,
      category: "account",
      question: "How do I reset my password?",
      answer:
        'Click on "Forgot Password" on the login page. Enter your registered email address, and we\'ll send you a password reset link. Follow the instructions to create a new password.',
    },
    {
      id: 4,
      category: "account",
      question: "How can I update my profile information?",
      answer:
        'Go to your Dashboard, click on "Settings" or "Profile Settings". You can edit your business information, contact details, and upload a new logo or profile picture from there.',
    },
    {
      id: 5,
      category: "listings",
      question: "How many images can I add to my listing?",
      answer:
        "Free listings can include up to 5 images. Premium listings allow up to 20 images, along with video integration and virtual tour options.",
    },
    {
      id: 6,
      category: "listings",
      question: "How do I edit or remove my listing?",
      answer:
        'Navigate to "My Listings" in your dashboard. Find the listing you want to modify and click the "Edit" or "Delete" button. Changes are saved immediately.',
    },
    {
      id: 7,
      category: "buying",
      question: "How do I contact a seller?",
      answer:
        'Each listing has a "Contact Seller" button. You can send a direct message through the platform, or view their contact details if they\'ve made them public.',
    },
    {
      id: 8,
      category: "buying",
      question: "Is it safe to make payments through the platform?",
      answer:
        "Yes, MSME Sahaay uses secure payment gateways with encryption. We recommend keeping all communications and transactions within the platform for your safety.",
    },
    {
      id: 9,
      category: "selling",
      question: "How do I manage orders from buyers?",
      answer:
        'Your dashboard includes an "Orders" section where you can view, process, and update order statuses. You\'ll receive email notifications for new orders.',
    },
    {
      id: 10,
      category: "technical",
      question: "The website is loading slowly. What should I do?",
      answer:
        "Try clearing your browser cache, using a different browser, or checking your internet connection. If the issue persists, contact our technical support team with details of the problem.",
    },
    {
      id: 11,
      category: "technical",
      question: "Can I access MSME Sahaay on mobile?",
      answer:
        "Yes, our platform is fully responsive and works on all devices. We also have dedicated mobile apps for iOS and Android available on app stores.",
    },
    {
      id: 12,
      category: "billing",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards, UPI, net banking, and digital wallets. For premium plans, we also offer quarterly and annual billing options.",
    },
  ];

  const filteredFaqs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await submitSupportFeedback(feedbackForm);

      if (res.data.success) {
        setSubmitSuccess(true);
        setShowFeedbackForm(false);
        setFeedbackForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Feedback error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--color-accent-50)] to-white pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
            <Link
              href="/"
              className="hover:text-[var(--color-accent-600)] transition-colors"
            >
              Home
            </Link>
            <span>•</span>
            <span className="text-gray-900">Help & Support</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            How can we{" "}
            <span className="text-[var(--color-accent-600)]">help you?</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-0 max-w-2xl mx-auto">
            Browse our FAQs or get in touch with our support team.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Category Scroller */}
          <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto">
            <div
              className="flex gap-2 pb-2"
              style={{ minWidth: "max-content" }}
            >
              {helpCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-full border transition-colors whitespace-nowrap
                    ${
                      activeCategory === category.id
                        ? "bg-[var(--color-accent-600)] text-white border-[var(--color-accent-600)]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[var(--color-accent-300)]"
                    }`}
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
                      strokeWidth={1.5}
                      d={category.icon}
                    />
                  </svg>
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Sidebar — hidden on mobile (replaced by scroller above) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xs p-5 sticky top-24">
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  Help Categories
                </h3>
                <div className="space-y-1">
                  {helpCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xs transition-colors
                        ${
                          activeCategory === category.id
                            ? "bg-[var(--color-accent-50)] text-[var(--color-accent-600)] font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d={category.icon}
                        />
                      </svg>
                      {category.label}
                    </button>
                  ))}
                </div>

                {/* Quick Contact */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                    Quick Contact
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>+91 11 2345 6789</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="break-all">help@msmesahaay.in</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Mon–Fri, 9:00 AM – 6:00 PM IST
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Success Banner */}
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xs animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-green-800">
                        Feedback sent!
                      </h3>
                      <p className="text-sm text-green-600">
                        Your email client should have opened. We'll get back to
                        you within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Form Modal */}
              {showFeedbackForm && (
                <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
                  <div className="bg-white rounded-t-2xl sm:rounded-xs w-full sm:max-w-lg max-h-[95vh] overflow-y-auto">
                    <div className="p-5 sm:p-6">
                      {/* Modal Header */}
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Send us Feedback
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            We'd love to hear from you
                          </p>
                        </div>
                        <button
                          onClick={() => setShowFeedbackForm(false)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          aria-label="Close"
                        >
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <form
                        onSubmit={handleFeedbackSubmit}
                        className="space-y-4"
                      >
                        {/* Name & Email side by side on sm+ */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Your Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={feedbackForm.name}
                              onChange={(e) =>
                                setFeedbackForm({
                                  ...feedbackForm,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xs focus:ring-1 focus:ring-[var(--color-accent-600)] focus:border-[var(--color-accent-600)] outline-none"
                              placeholder="Ramesh Kumar"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Email Address{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              required
                              value={feedbackForm.email}
                              onChange={(e) =>
                                setFeedbackForm({
                                  ...feedbackForm,
                                  email: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xs focus:ring-1 focus:ring-[var(--color-accent-600)] focus:border-[var(--color-accent-600)] outline-none"
                              placeholder="you@example.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            Subject <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={feedbackForm.subject}
                            onChange={(e) =>
                              setFeedbackForm({
                                ...feedbackForm,
                                subject: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xs focus:ring-1 focus:ring-[var(--color-accent-600)] focus:border-[var(--color-accent-600)] outline-none"
                            placeholder="How can we improve?"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            Message <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            required
                            rows={5}
                            value={feedbackForm.message}
                            onChange={(e) =>
                              setFeedbackForm({
                                ...feedbackForm,
                                message: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xs focus:ring-1 focus:ring-[var(--color-accent-600)] focus:border-[var(--color-accent-600)] outline-none resize-none"
                            placeholder="Tell us your thoughts, suggestions, or issues..."
                          />
                        </div>

                        <p className="text-xs text-gray-400">
                          Clicking "Send Feedback" will open your email client
                          with this message pre-filled.
                        </p>

                        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowFeedbackForm(false)}
                            className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xs hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--color-accent-600)] text-white text-sm font-medium rounded-xs hover:bg-[var(--color-accent-700)] transition-colors
                              ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
                          >
                            {isSubmitting ? (
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
                                    d="M4 12a8 8 0 018-8v8H4z"
                                  />
                                </svg>
                                Opening...
                              </>
                            ) : (
                              <>
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
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                Send Feedback
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Frequently Asked Questions
                    {activeCategory !== "all" && (
                      <span className="ml-2 text-sm font-normal text-gray-400">
                        •{" "}
                        {
                          helpCategories.find((c) => c.id === activeCategory)
                            ?.label
                        }
                      </span>
                    )}
                  </h2>
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    {filteredFaqs.length} article
                    {filteredFaqs.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {filteredFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-white border border-gray-200 rounded-xs overflow-hidden hover:border-[var(--color-accent-200)] transition-colors"
                    >
                      <button
                        onClick={() =>
                          setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                        }
                        className="w-full px-4 sm:px-5 py-3.5 sm:py-4 text-left flex items-start sm:items-center justify-between gap-3"
                      >
                        <span className="text-sm font-medium text-gray-900 text-left">
                          {faq.question}
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform mt-0.5 sm:mt-0 ${expandedFaq === faq.id ? "rotate-180" : ""}`}
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
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="px-4 sm:px-5 pb-4">
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                          <div className="mt-3 flex items-center gap-3">
                            <button className="text-xs text-[var(--color-accent-600)] hover:text-[var(--color-accent-700)] font-medium">
                              Was this helpful? 👍
                            </button>
                            <span className="text-xs text-gray-300">|</span>
                            <button className="text-xs text-gray-400 hover:text-gray-600">
                              Report
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Still Need Help CTA */}
              <div className="mt-6 sm:mt-8 p-5 sm:p-6 bg-[var(--color-accent-50)] rounded-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-accent-100)] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-accent-600)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      Still need help?
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Can't find what you're looking for? Send us your feedback
                      and we'll get back to you.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFeedbackForm(true)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[var(--color-accent-600)] text-white text-sm font-medium rounded-xs hover:bg-[var(--color-accent-700)] transition-colors whitespace-nowrap flex items-center justify-center gap-2"
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
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Send Feedback
                  </button>
                </div>
              </div>

              {/* Mobile Quick Contact */}
              <div className="lg:hidden mt-4 p-4 bg-white border border-gray-200 rounded-xs">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                  Quick Contact
                </h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <a
                      href="tel:+911123456789"
                      className="hover:text-[var(--color-accent-600)]"
                    >
                      +91 11 2345 6789
                    </a>
                  </div>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <a
                      href="mailto:help@msmesahaay.in"
                      className="hover:text-[var(--color-accent-600)]"
                    >
                      help@msmesahaay.in
                    </a>
                  </div>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <p className="text-xs text-gray-400">
                    Mon–Fri, 9 AM – 6 PM IST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-10 sm:py-12 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-xs p-6 sm:p-8">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Join our Community
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mb-4">
                  Connect with other MSMEs, share experiences, and learn from
                  the community.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-[#5865F2] text-white text-sm rounded-xs hover:bg-[#4752C4] transition-colors flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515c-.21.396-.475.93-.648 1.35a18.237 18.237 0 0 0-5.48 0 12.62 12.62 0 0 0-.649-1.35 19.735 19.735 0 0 0-4.885 1.515c-2.862 4.28-3.637 8.452-3.25 12.544a19.92 19.92 0 0 0 6.09 2.974c.49-.68.928-1.405 1.306-2.177a12.915 12.915 0 0 1-2.066-1.019c.173-.129.342-.263.506-.4a14.428 14.428 0 0 0 12.166 0c.164.137.333.271.506.4-.653.408-1.347.756-2.066 1.019.378.772.816 1.497 1.306 2.177a19.89 19.89 0 0 0 6.09-2.974c.456-4.576-.713-8.71-3.25-12.544zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.947 2.419-2.157 2.419z" />
                    </svg>
                    Discord
                  </button>
                  <button className="px-4 py-2 bg-[#1DA1F2] text-white text-sm rounded-xs hover:bg-[#1A8CD8] transition-colors flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.092-11.542c0-.213-.005-.425-.014-.636A9.936 9.936 0 0024 4.59z" />
                    </svg>
                    Twitter
                  </button>
                </div>
              </div>
              <div className="flex md:justify-end">
                <div className="inline-block bg-[var(--color-accent-50)] p-4 sm:p-5 rounded-xs text-center">
                  <p className="text-sm text-gray-600 mb-1">
                    Community members
                  </p>
                  <div className="text-3xl sm:text-4xl font-bold text-[var(--color-accent-600)]">
                    5,000+
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    and growing daily
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HelpSupportPage;
