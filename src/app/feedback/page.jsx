"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const FeedbackPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    userType: "business",
    feedbackType: "suggestion",
    rating: 0,
    subject: "",
    message: "",
    attachFile: null,
    consent: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const feedbackTypes = [
    {
      id: "suggestion",
      label: "Suggestion",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    },
    {
      id: "bug",
      label: "Bug Report",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    },
    {
      id: "complaint",
      label: "Complaint",
      icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      id: "feature",
      label: "Feature Request",
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    },
    {
      id: "praise",
      label: "Praise",
      icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      id: "other",
      label: "Other",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  const userTypes = [
    { id: "business", label: "Business Owner" },
    { id: "buyer", label: "Buyer/Purchaser" },
    { id: "supplier", label: "Supplier/Vendor" },
    { id: "visitor", label: "General Visitor" },
    { id: "partner", label: "Partner/Investor" },
  ];

  const faqItems = [
    {
      question: "How long does it take to get a response?",
      answer:
        'We typically respond to all feedback within 2-3 business days. For urgent issues, please use the "Bug Report" or "Complaint" category.',
    },
    {
      question: "Can I submit feedback anonymously?",
      answer:
        "Yes, you can choose to submit feedback without providing your name, but including your email helps us follow up if needed.",
    },
    {
      question: "What happens to my feedback?",
      answer:
        "All feedback is reviewed by our product team and used to improve the MSME Sahaay platform. Feature requests are added to our roadmap.",
    },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        userType: "business",
        feedbackType: "suggestion",
        rating: 0,
        subject: "",
        message: "",
        attachFile: null,
        consent: false,
      });
      setCurrentStep(1);
    }, 3000);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <span>•</span>
              <span className="text-gray-900">Feedback</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
              Share Your <span className="text-blue-600">Feedback</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Help us improve MSME Sahaay. Your insights shape the future of our
              platform.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-500">Feedback Received</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">95%</div>
                <div className="text-sm text-gray-500">Implementation Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4.8/5</div>
                <div className="text-sm text-gray-500">User Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feedback Form - Main Column */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
                {/* Success Message */}
                {submitSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
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
                          Thank you for your feedback!
                        </h3>
                        <p className="text-sm text-green-600">
                          We appreciate your input and will review it shortly.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div
                          className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                          ${
                            currentStep === step
                              ? "bg-blue-600 text-white"
                              : currentStep > step
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                          }
                        `}
                        >
                          {currentStep > step ? (
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            step
                          )}
                        </div>
                        {step < 3 && (
                          <div
                            className={`
                            w-16 h-0.5 mx-2
                            ${currentStep > step ? "bg-blue-600" : "bg-gray-200"}
                          `}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">Type</span>
                    <span className="text-xs text-gray-500">Details</span>
                    <span className="text-xs text-gray-500">Review</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Step 1: Feedback Type */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          What type of feedback would you like to share?
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {feedbackTypes.map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  feedbackType: type.id,
                                }));
                                nextStep();
                              }}
                              className={`
                                p-4 border rounded-xl text-left transition-all
                                ${
                                  formData.feedbackType === type.id
                                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                                    : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/50"
                                }
                              `}
                            >
                              <svg
                                className={`w-6 h-6 mb-2 ${formData.feedbackType === type.id ? "text-blue-600" : "text-gray-400"}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d={type.icon}
                                />
                              </svg>
                              <span
                                className={`text-sm font-medium ${formData.feedbackType === type.id ? "text-blue-600" : "text-gray-700"}`}
                              >
                                {type.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          How would you rate your experience?
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingClick(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="focus:outline-none"
                            >
                              <svg
                                className={`w-8 h-8 transition-colors ${
                                  (hoverRating || formData.rating) >= star
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Details */}
                  {currentStep === 2 && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="Brief summary of your feedback"
                          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows="5"
                          placeholder="Please share your detailed feedback..."
                          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Attach File (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                          <input
                            type="file"
                            name="attachFile"
                            onChange={handleChange}
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <svg
                              className="w-8 h-8 text-gray-400 mb-2"
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
                              {formData.attachFile
                                ? formData.attachFile.name
                                : "Click to upload or drag and drop"}
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              PNG, JPG, PDF up to 10MB
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Personal Info & Review */}
                  {currentStep === 3 && (
                    <div className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name (Optional)
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email (Optional)
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company (Optional)
                          </label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Your company"
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            I am a
                          </label>
                          <select
                            name="userType"
                            value={formData.userType}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none"
                          >
                            {userTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Feedback Summary */}
                      <div className="bg-blue-50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">
                          Feedback Summary
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-blue-600">Type:</span>{" "}
                            {
                              feedbackTypes.find(
                                (t) => t.id === formData.feedbackType,
                              )?.label
                            }
                          </p>
                          <p>
                            <span className="text-blue-600">Subject:</span>{" "}
                            {formData.subject || "(Not provided)"}
                          </p>
                          <p>
                            <span className="text-blue-600">Rating:</span>{" "}
                            {formData.rating} / 5 stars
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="consent"
                          id="consent"
                          checked={formData.consent}
                          onChange={handleChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                          required
                        />
                        <label
                          htmlFor="consent"
                          className="text-sm text-gray-600"
                        >
                          I consent to MSME Sahaay processing my feedback and
                          contacting me if necessary.{" "}
                          <span className="text-red-500">*</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-200">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        ← Back
                      </button>
                    )}
                    <div className="flex gap-3 ml-auto">
                      {currentStep < 3 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={currentStep === 1 && !formData.feedbackType}
                          className={`
                            px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg
                            hover:bg-blue-700 transition-colors
                            ${currentStep === 1 && !formData.feedbackType ? "opacity-50 cursor-not-allowed" : ""}
                          `}
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={
                            isSubmitting ||
                            !formData.consent ||
                            !formData.subject ||
                            !formData.message
                          }
                          className={`
                            px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg
                            hover:bg-blue-700 transition-colors
                            ${isSubmitting || !formData.consent || !formData.subject || !formData.message ? "opacity-50 cursor-not-allowed" : ""}
                          `}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <svg
                                className="animate-spin h-4 w-4"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Submitting...
                            </span>
                          ) : (
                            "Submit Feedback"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Prefer to talk?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  You can also reach us directly through these channels.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
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
                    <span className="text-sm text-gray-600">
                      feedback@msmesahaay.in
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
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
                    </div>
                    <span className="text-sm text-gray-600">
                      +91 11 1234 5678
                    </span>
                  </div>
                </div>
              </div>

              {/* FAQ Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Frequently Asked
                </h3>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index}>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {item.question}
                      </h4>
                      <p className="text-xs text-gray-500">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Feedback Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Implementations
                </h3>
                <div className="space-y-3">
                  <div className="border-l-3 border-blue-600 pl-3">
                    <p className="text-xs text-gray-500">2 days ago</p>
                    <p className="text-sm text-gray-700">
                      "Add category filters for machinery"
                    </p>
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Implemented
                    </span>
                  </div>
                  <div className="border-l-3 border-blue-600 pl-3">
                    <p className="text-xs text-gray-500">1 week ago</p>
                    <p className="text-sm text-gray-700">
                      "Mobile app for listing management"
                    </p>
                    <span className="inline-block mt-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                      In Progress
                    </span>
                  </div>
                  <div className="border-l-3 border-blue-600 pl-3">
                    <p className="text-xs text-gray-500">2 weeks ago</p>
                    <p className="text-sm text-gray-700">
                      "Hindi language support"
                    </p>
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Implemented
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">
              What users say about us
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Real feedback from the MSME community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Rajesh Kumar",
                role: "Textile Manufacturer, Surat",
                feedback:
                  "I suggested adding a bulk enquiry feature, and they implemented it within a month. Now I can connect with 10 suppliers at once!",
                rating: 5,
              },
              {
                name: "Priya Singh",
                role: "Handicraft Exporter, Jaipur",
                feedback:
                  "The platform actually listens. My feedback about adding handicraft categories was implemented quickly.",
                rating: 5,
              },
              {
                name: "Amit Mehta",
                role: "IT Consultant, Pune",
                feedback:
                  "Great responsiveness from the team. They took my technical feedback seriously and improved the dashboard.",
                rating: 4,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-gray-200"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  "{testimonial.feedback}"
                </p>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Feedback CTA */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Quick Poll</h3>
            <p className="text-blue-100 mb-6">
              How likely are you to recommend MSME Sahaay to other businesses?
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FeedbackPage;
