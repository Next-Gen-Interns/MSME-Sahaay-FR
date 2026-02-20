"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HelpSupportPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "technical",
    priority: "medium",
    description: "",
    attachment: null,
  });
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Help Categories
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

  // FAQ Data
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

  // Support Articles
  const popularArticles = [
    {
      title: "Complete Guide to Creating Effective Listings",
      views: "2.5k views",
      category: "listings",
    },
    {
      title: "How to Get Verified on MSME Sahaay",
      views: "1.8k views",
      category: "account",
    },
    {
      title: "Understanding Your Dashboard Analytics",
      views: "1.2k views",
      category: "selling",
    },
    {
      title: "Safety Tips for Online Business Transactions",
      views: "3.1k views",
      category: "buying",
    },
    {
      title: "Troubleshooting Common Login Issues",
      views: "950 views",
      category: "technical",
    },
  ];

  // Support Ticket Categories
  const ticketCategories = [
    { id: "technical", label: "Technical Issue" },
    { id: "billing", label: "Billing Question" },
    { id: "account", label: "Account Help" },
    { id: "listing", label: "Listing Support" },
    { id: "feature", label: "Feature Request" },
    { id: "other", label: "Other" },
  ];

  const priorityLevels = [
    { id: "low", label: "Low", color: "gray" },
    { id: "medium", label: "Medium", color: "blue" },
    { id: "high", label: "High", color: "orange" },
    { id: "urgent", label: "Urgent", color: "red" },
  ];

  const filteredFaqs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setShowTicketForm(false);
    setTicketForm({
      subject: "",
      category: "technical",
      priority: "medium",
      description: "",
      attachment: null,
    });

    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-blue-50 to-white pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>•</span>
            <span className="text-gray-900">Help & Support</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            How can we <span className="text-blue-600">help you?</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Search our knowledge base, browse guides, or get in touch with our
            support team.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles, FAQs, topics..."
                className="w-full px-6 py-4 pr-24 text-base border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <span className="text-sm text-gray-500">Popular:</span>
            {[
              "Verification",
              "Payment Issues",
              "Listing Tips",
              "Account Setup",
            ].map((item, index) => (
              <button
                key={index}
                className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Support Options Cards */}
      <section className="py-12 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Live Chat Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Live Chat Support
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Chat with our support team in real-time
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 text-xs text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  Available now
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  Avg. 2 min response
                </span>
              </div>
              <button className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
                Start Chat
              </button>
            </div>

            {/* Email Support Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email Support
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Get a detailed response within 24 hours
              </p>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">
                  support@msmesahaay.in
                </p>
                <p className="text-xs text-gray-400">For general inquiries</p>
              </div>
              <a
                href="mailto:support@msmesahaay.in"
                className="block w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-blue-400 transition-colors text-center"
              >
                Send Email
              </a>
            </div>

            {/* Ticket System Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Support Ticket
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                For complex issues requiring tracking
              </p>
              <div className="mb-4">
                <p className="text-xs text-gray-500">Priority support for:</p>
                <p className="text-xs text-gray-700">
                  Premium members • Technical issues • Billing
                </p>
              </div>
              <button
                onClick={() => setShowTicketForm(true)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-blue-400 transition-colors"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Categories */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-24">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  Help Categories
                </h3>
                <div className="space-y-1">
                  {helpCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-colors
                        ${
                          activeCategory === category.id
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }
                      `}
                    >
                      <svg
                        className="w-5 h-5"
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

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                    Quick Contact
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-gray-400"
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
                        className="w-4 h-4 text-gray-400"
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
                      <span>help@msmesahaay.in</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Mon-Fri, 9:00 AM - 6:00 PM IST
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content - FAQs & Articles */}
            <div className="lg:col-span-3">
              {/* Success Message for Ticket */}
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
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
                        Support ticket created!
                      </h3>
                      <p className="text-sm text-green-600">
                        We'll get back to you within 24 hours. Ticket #MS-
                        {Math.floor(Math.random() * 10000)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ticket Form Modal */}
              {showTicketForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Create Support Ticket
                        </h3>
                        <button
                          onClick={() => setShowTicketForm(false)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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

                      <form onSubmit={handleTicketSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject *
                          </label>
                          <input
                            type="text"
                            required
                            value={ticketForm.subject}
                            onChange={(e) =>
                              setTicketForm({
                                ...ticketForm,
                                subject: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none"
                            placeholder="Brief summary of your issue"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Category *
                            </label>
                            <select
                              required
                              value={ticketForm.category}
                              onChange={(e) =>
                                setTicketForm({
                                  ...ticketForm,
                                  category: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none"
                            >
                              {ticketCategories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Priority *
                            </label>
                            <select
                              required
                              value={ticketForm.priority}
                              onChange={(e) =>
                                setTicketForm({
                                  ...ticketForm,
                                  priority: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none"
                            >
                              {priorityLevels.map((level) => (
                                <option key={level.id} value={level.id}>
                                  {level.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                          </label>
                          <textarea
                            required
                            rows="5"
                            value={ticketForm.description}
                            onChange={(e) =>
                              setTicketForm({
                                ...ticketForm,
                                description: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none resize-none"
                            placeholder="Please provide detailed information about your issue..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attachment (Optional)
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                            <input
                              type="file"
                              id="ticket-attachment"
                              className="hidden"
                              onChange={(e) =>
                                setTicketForm({
                                  ...ticketForm,
                                  attachment: e.target.files[0],
                                })
                              }
                            />
                            <label
                              htmlFor="ticket-attachment"
                              className="cursor-pointer"
                            >
                              <svg
                                className="w-8 h-8 text-gray-400 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                />
                              </svg>
                              <span className="text-sm text-gray-600">
                                {ticketForm.attachment
                                  ? ticketForm.attachment.name
                                  : "Click to upload or drag and drop"}
                              </span>
                              <span className="text-xs text-gray-400 block mt-1">
                                PNG, JPG, PDF up to 10MB
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`
                              px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg
                              hover:bg-blue-700 transition-colors
                              ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                            `}
                          >
                            {isSubmitting ? "Submitting..." : "Submit Ticket"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowTicketForm(false)}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Popular Articles Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Popular Articles
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {popularArticles.map((article, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
                    >
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {article.views}
                        </p>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors"
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
                    </Link>
                  ))}
                </div>
              </div>

              {/* FAQs Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
                <div className="space-y-3">
                  {filteredFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-200 transition-colors"
                    >
                      <button
                        onClick={() =>
                          setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                        }
                        className="w-full px-5 py-4 text-left flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-gray-900 pr-8">
                          {faq.question}
                        </span>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${expandedFaq === faq.id ? "rotate-180" : ""}`}
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
                        <div className="px-5 pb-4">
                          <p className="text-sm text-gray-600">{faq.answer}</p>
                          <div className="mt-3 flex items-center gap-3">
                            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
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

              {/* Still Need Help */}
              <div className="mt-8 p-6 bg-blue-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
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
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Still need help?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Can't find what you're looking for? Our support team is
                      here to assist you.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTicketForm(true)}
                    className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Tutorials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Video Tutorials
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Learn how to make the most of MSME Sahaay
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Getting Started Guide",
                duration: "4:30",
                views: "15k views",
              },
              {
                title: "How to Create Effective Listings",
                duration: "6:15",
                views: "12k views",
              },
              {
                title: "Understanding Your Dashboard",
                duration: "5:45",
                views: "8k views",
              },
            ].map((video, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                      <svg
                        className="w-5 h-5 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span>{video.duration}</span>
                    <span>•</span>
                    <span>{video.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Join our Community
                </h2>
                <p className="text-gray-600 mb-4">
                  Connect with other MSMEs, share experiences, and learn from
                  the community.
                </p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752C4] transition-colors flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515c-.21.396-.475.93-.648 1.35a18.237 18.237 0 0 0-5.48 0 12.62 12.62 0 0 0-.649-1.35 19.735 19.735 0 0 0-4.885 1.515c-2.862 4.28-3.637 8.452-3.25 12.544a19.92 19.92 0 0 0 6.09 2.974c.49-.68.928-1.405 1.306-2.177a12.915 12.915 0 0 1-2.066-1.019c.173-.129.342-.263.506-.4a14.428 14.428 0 0 0 12.166 0c.164.137.333.271.506.4-.653.408-1.347.756-2.066 1.019.378.772.816 1.497 1.306 2.177a19.89 19.89 0 0 0 6.09-2.974c.456-4.576-.713-8.71-3.25-12.544zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.947 2.419-2.157 2.419z" />
                    </svg>
                    Discord
                  </button>
                  <button className="px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1A8CD8] transition-colors flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.092-11.542c0-.213-.005-.425-.014-.636A9.936 9.936 0 0024 4.59z" />
                    </svg>
                    Twitter
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-block bg-blue-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-2">
                    Community members
                  </p>
                  <div className="text-3xl font-bold text-blue-600">5,000+</div>
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
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HelpSupportPage;
