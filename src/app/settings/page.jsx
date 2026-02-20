"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form state
  const [settings, setSettings] = useState({
    // Profile Settings
    fullName: "John Doe",
    email: "john.doe@example.com",
    username: "johndoe",
    bio: "Senior product designer with 8+ years of experience creating digital solutions for global brands.",
    avatar: "/default-avatar.jpg",
    company: "Design Studio Co.",
    role: "Product Designer",

    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    orderUpdates: true,
    newsletter: true,

    // Privacy Settings
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessaging: "everyone",

    // Appearance
    theme: "light",
    fontSize: "medium",
    compactView: false,

    // Security
    twoFactorAuth: false,
    loginAlerts: true,
    lastLogin: "2024-03-15 09:30 AM",
  });

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
    },
    {
      id: "security",
      label: "Security",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    },
    {
      id: "billing",
      label: "Billing",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Manage your account preferences and application settings
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 animate-fadeIn">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
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
                <span className="text-sm font-medium text-green-800">
                  Settings saved successfully
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all
                    ${
                      activeTab === tab.id
                        ? "bg-gray-100 text-gray-900 font-medium"
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
                      d={tab.icon}
                    />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              {activeTab === "profile" && (
                <div className="space-y-8">
                  {/* Section Title */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Profile Information
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Update your personal details and public profile
                    </p>
                  </div>

                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={settings.avatar}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Change photo
                      </button>
                      <p className="text-xs text-gray-400 mt-2">
                        JPG, GIF or PNG. Max 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={settings.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={settings.username}
                        onChange={(e) =>
                          handleChange("username", e.target.value)
                        }
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={settings.company}
                        onChange={(e) =>
                          handleChange("company", e.target.value)
                        }
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={settings.role}
                        onChange={(e) => handleChange("role", e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        rows="4"
                        value={settings.bio}
                        onChange={(e) => handleChange("bio", e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors resize-none"
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        Brief description for your profile. URLs are
                        hyperlinked.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Notification Preferences
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Choose how you want to be notified
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        id: "emailNotifications",
                        label: "Email notifications",
                        description: "Receive notifications via email",
                      },
                      {
                        id: "pushNotifications",
                        label: "Push notifications",
                        description: "Get browser push notifications",
                      },
                      {
                        id: "orderUpdates",
                        label: "Order updates",
                        description: "Receive updates about your orders",
                      },
                      {
                        id: "newsletter",
                        label: "Newsletter",
                        description: "Monthly product updates and news",
                      },
                      {
                        id: "marketingEmails",
                        label: "Marketing emails",
                        description: "Promotional offers and announcements",
                      },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-3"
                      >
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.label}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleChange(item.id, !settings[item.id])
                          }
                          className={`
                            relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                            ${settings[item.id] ? "bg-gray-900" : "bg-gray-200"}
                          `}
                        >
                          <span
                            className={`
                              inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out
                              ${settings[item.id] ? "translate-x-4" : "translate-x-0"}
                            `}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "privacy" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Privacy Controls
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage your privacy settings
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile visibility
                      </label>
                      <select
                        value={settings.profileVisibility}
                        onChange={(e) =>
                          handleChange("profileVisibility", e.target.value)
                        }
                        className="w-full max-w-xs px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none"
                      >
                        <option value="public">Public - Anyone can see</option>
                        <option value="private">Private - Only me</option>
                        <option value="contacts">
                          Contacts - Only my contacts
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Who can message you
                      </label>
                      <select
                        value={settings.allowMessaging}
                        onChange={(e) =>
                          handleChange("allowMessaging", e.target.value)
                        }
                        className="w-full max-w-xs px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none"
                      >
                        <option value="everyone">Everyone</option>
                        <option value="contacts">Only contacts</option>
                        <option value="none">No one</option>
                      </select>
                    </div>

                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Show email address
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Display your email on your public profile
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleChange("showEmail", !settings.showEmail)
                          }
                          className={`
                            relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200
                            ${settings.showEmail ? "bg-gray-900" : "bg-gray-200"}
                          `}
                        >
                          <span
                            className={`
                              inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200
                              ${settings.showEmail ? "translate-x-4" : "translate-x-0"}
                            `}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Show phone number
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Display your phone on your public profile
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleChange("showPhone", !settings.showPhone)
                          }
                          className={`
                            relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200
                            ${settings.showPhone ? "bg-gray-900" : "bg-gray-200"}
                          `}
                        >
                          <span
                            className={`
                              inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200
                              ${settings.showPhone ? "translate-x-4" : "translate-x-0"}
                            `}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Appearance
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Customize how the application looks
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Theme
                      </label>
                      <div className="flex gap-3">
                        {["Light", "Dark", "System"].map((theme) => (
                          <button
                            key={theme}
                            onClick={() =>
                              handleChange("theme", theme.toLowerCase())
                            }
                            className={`
                              px-4 py-2 text-sm rounded-lg border transition-colors
                              ${
                                settings.theme === theme.toLowerCase()
                                  ? "border-gray-900 bg-gray-900 text-white"
                                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                              }
                            `}
                          >
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Font size
                      </label>
                      <div className="flex gap-3">
                        {["Small", "Medium", "Large"].map((size) => (
                          <button
                            key={size}
                            onClick={() =>
                              handleChange("fontSize", size.toLowerCase())
                            }
                            className={`
                              px-4 py-2 text-sm rounded-lg border transition-colors
                              ${
                                settings.fontSize === size.toLowerCase()
                                  ? "border-gray-900 bg-gray-900 text-white"
                                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                              }
                            `}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Compact view
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Use a more compact layout with reduced spacing
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleChange("compactView", !settings.compactView)
                        }
                        className={`
                          relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200
                          ${settings.compactView ? "bg-gray-900" : "bg-gray-200"}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200
                            ${settings.compactView ? "translate-x-4" : "translate-x-0"}
                          `}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Security
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage your account security
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Password
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Last changed 3 months ago
                          </p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          Change password
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Two-factor authentication
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleChange(
                              "twoFactorAuth",
                              !settings.twoFactorAuth,
                            )
                          }
                          className={`
                            relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200
                            ${settings.twoFactorAuth ? "bg-gray-900" : "bg-gray-200"}
                          `}
                        >
                          <span
                            className={`
                              inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200
                              ${settings.twoFactorAuth ? "translate-x-4" : "translate-x-0"}
                            `}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Login alerts
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Get notified of new sign-ins to your account
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleChange("loginAlerts", !settings.loginAlerts)
                          }
                          className={`
                            relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200
                            ${settings.loginAlerts ? "bg-gray-900" : "bg-gray-200"}
                          `}
                        >
                          <span
                            className={`
                              inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200
                              ${settings.loginAlerts ? "translate-x-4" : "translate-x-0"}
                            `}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Active sessions
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                MacBook Pro · San Francisco
                              </p>
                              <p className="text-xs text-gray-500">
                                Current session · Last active now
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "billing" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Billing & Subscription
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage your subscription and payment methods
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">
                            Current plan
                          </p>
                          <h3 className="text-xl font-semibold text-gray-900 mt-1">
                            Professional
                          </h3>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium bg-gray-900 text-white rounded-full">
                          Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">$29.99/month</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Next billing on April 15, 2024
                          </p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          Change plan
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Payment methods
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Visa ending in 4242
                              </p>
                              <p className="text-xs text-gray-500">
                                Expires 12/25
                              </p>
                            </div>
                          </div>
                          <button className="text-xs text-gray-500 hover:text-gray-700">
                            Edit
                          </button>
                        </div>
                      </div>
                      <button className="mt-3 text-sm text-gray-600 hover:text-gray-900 font-medium">
                        + Add payment method
                      </button>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Billing history
                      </h4>
                      <div className="space-y-2">
                        {[
                          {
                            date: "Mar 15, 2024",
                            amount: "$29.99",
                            status: "Paid",
                          },
                          {
                            date: "Feb 15, 2024",
                            amount: "$29.99",
                            status: "Paid",
                          },
                          {
                            date: "Jan 15, 2024",
                            amount: "$29.99",
                            status: "Paid",
                          },
                        ].map((invoice, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-2 border-b border-gray-100"
                          >
                            <span className="text-sm text-gray-600">
                              {invoice.date}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {invoice.amount}
                            </span>
                            <span className="text-xs text-green-600">
                              {invoice.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 mt-8 border-t border-gray-200">
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`
                    px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg
                    hover:bg-gray-800 transition-colors
                    ${isSaving ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default SettingsPage;
