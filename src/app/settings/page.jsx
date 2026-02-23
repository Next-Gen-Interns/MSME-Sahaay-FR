"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import UserBasicInfo from "../components/Profile/UserBasicInfo";
import BuyerProfile from "../components/Profile/BuyerProfile";
import SellerProfile from "../components/Profile/SellerProfile";
import {
  createBuyerProfile,
  createSellerProfile,
  updateBuyerProfile,
  updateSellerProfile,
  getBuyerProfile,
  getSellerProfile,
  getUserProfile,
  updateUserProfile,
} from "../api/profileAPI";
import {
  setLoading,
  setRoleData,
  setUserData,
} from "../lib/redux/slices/profileSlice";

/* ══════════════════════════════════════════════════════
   SETTINGS PAGE — IndiaMART style
   Profile tab embeds the existing profile components
   (UserBasicInfo, BuyerProfile, SellerProfile) with
   full logic from ProfilePage, zero API changes.
══════════════════════════════════════════════════════ */

const TABS = [
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

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    userData,
    roleData,
    loading: profileLoading,
  } = useSelector((s) => s.profile);

  const [activeTab, setActiveTab] = useState("profile");
  // profile sub-tab
  const [profileSubTab, setProfileSubTab] = useState("basic");
  const [roleProfileExists, setRoleProfileExists] = useState(false);
  const [saving, setSaving] = useState(false);

  // Non-profile settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    orderUpdates: true,
    newsletter: true,
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessaging: "everyone",
    theme: "light",
    fontSize: "medium",
    compactView: false,
    twoFactorAuth: false,
    loginAlerts: true,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /* ── Load profile on mount ── */
  useEffect(() => {
    if (!userData) loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      dispatch(setLoading(true));
      const userResponse = await getUserProfile();
      const userProfile = userResponse.data.data;
      dispatch(setUserData(userProfile));
      setRoleProfileExists(Boolean(userProfile.role_profile_exists));

      if (userProfile.role === "buyer") {
        try {
          const r = await getBuyerProfile();
          dispatch(setRoleData(r.data));
          setRoleProfileExists(true);
        } catch (e) {
          if (e.response?.status === 404) {
            dispatch(setRoleData(null));
            setRoleProfileExists(false);
          }
        }
      } else if (userProfile.role === "seller") {
        try {
          const r = await getSellerProfile();
          dispatch(setRoleData(r.data));
          setRoleProfileExists(true);
        } catch (e) {
          if (e.response?.status === 404) {
            dispatch(setRoleData(null));
            setRoleProfileExists(false);
          }
        }
      }
    } catch (e) {
      console.error("Error loading profile:", e);
    } finally {
      dispatch(setLoading(false));
    }
  };

  /* ── Profile save handlers ── */
  const handleUserInfoSave = async (formData) => {
    try {
      setSaving(true);
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        const val = formData[key];
        if (key !== "avatar" && val !== undefined && val !== null) {
          submitData.append(
            key,
            typeof val === "object" && !(val instanceof File)
              ? JSON.stringify(val)
              : val,
          );
        }
      });
      if (formData.avatar instanceof File)
        submitData.append("avatar", formData.avatar);
      const response = await updateUserProfile(submitData);
      dispatch(setUserData(response.data.data));
      return { success: true, message: "Profile updated successfully!" };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update profile",
      };
    } finally {
      setSaving(false);
    }
  };

  const handleRoleInfoSave = async (roleFormData) => {
    try {
      setSaving(true);
      const role = userData?.role;
      if (!role) return { success: false, error: "User role is not defined." };
      let response;
      if (role === "buyer") {
        response = roleProfileExists
          ? await updateBuyerProfile(roleFormData)
          : await createBuyerProfile(roleFormData);
        if (!roleProfileExists) setRoleProfileExists(true);
      } else if (role === "seller") {
        response = roleProfileExists
          ? await updateSellerProfile(roleFormData)
          : await createSellerProfile(roleFormData);
        if (!roleProfileExists) setRoleProfileExists(true);
      } else {
        return { success: false, error: "Unknown role." };
      }
      dispatch(setRoleData(response.data));
      return {
        success: true,
        message: "Business information saved successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Failed to save business information",
      };
    } finally {
      setSaving(false);
    }
  };

  /* ── Non-profile save ── */
  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChange = (key, value) =>
    setSettings((p) => ({ ...p, [key]: value }));

  const progressPct = Math.max(
    0,
    Math.min(100, userData?.profile_completion?.total || 0),
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* ══════════════════════════════════
          PAGE HEADER
      ══════════════════════════════════ */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-[var(--color-accent-700)]" />
          <div>
            <div className="text-[10px] text-gray-400 mb-0.5">
              Home › Settings
            </div>
            <h1 className="text-sm font-bold text-gray-900">Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Success Toast */}
        {showSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-sm px-4 py-3 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-green-600 flex-shrink-0"
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
            <span className="text-sm font-semibold text-green-800">
              Settings saved successfully
            </span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* ── Sidebar ── */}
          <aside className="lg:w-52 flex-shrink-0 w-full">
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <div className="px-3 py-2.5 bg-[var(--color-accent-800)]">
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">
                  Settings
                </p>
              </div>
              <nav className="py-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-semibold transition-all text-left relative group ${
                      activeTab === tab.id
                        ? "bg-[var(--color-accent-50)] text-[var(--color-accent-800)] border-r-2 border-[var(--color-accent-700)]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                        d={tab.icon}
                      />
                    </svg>
                    {tab.label}
                    {/* Profile completion badge on Profile tab */}
                    {tab.id === "profile" && progressPct < 100 && (
                      <span className="ml-auto text-[9px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
                        {progressPct}%
                      </span>
                    )}
                    {tab.id === "profile" && progressPct === 100 && (
                      <span className="ml-auto text-[9px] font-bold bg-green-100 text-green-700 border border-green-200 px-1.5 py-0.5 rounded">
                        ✓ Done
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              {/* ════════════════════════════
                  PROFILE TAB
              ════════════════════════════ */}
              {activeTab === "profile" && (
                <>
                  {/* Profile Tab Header */}
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-1 h-5 rounded-full bg-[var(--color-accent-700)]" />
                        <h2 className="text-sm font-bold text-gray-900">
                          Profile & Business Information
                        </h2>
                      </div>
                      <p className="text-[11px] text-gray-400 ml-3">
                        Complete your profile to unlock all features
                      </p>
                    </div>

                    {/* Progress pill */}
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded px-4 py-2">
                      <div className="text-right">
                        <div
                          className={`text-base font-extrabold leading-none ${progressPct >= 80 ? "text-green-700" : progressPct >= 50 ? "text-amber-600" : "text-red-600"}`}
                        >
                          {progressPct}%
                        </div>
                        <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5">
                          Complete
                        </div>
                      </div>
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progressPct}%`,
                            background:
                              progressPct >= 80
                                ? "#16a34a"
                                : progressPct >= 50
                                  ? "#d97706"
                                  : "#dc2626",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Profile Sub-tabs */}
                  <div className="px-5 pt-3 pb-0 border-b border-gray-100 flex gap-0">
                    {[
                      { id: "basic", label: "Personal Info" },
                      {
                        id: "role",
                        label:
                          userData?.role === "seller"
                            ? "Business Info (Seller)"
                            : "Business Info (Buyer)",
                      },
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setProfileSubTab(sub.id)}
                        className={`px-5 py-2.5 text-[12px] font-semibold border-b-2 transition-all ${
                          profileSubTab === sub.id
                            ? "border-[var(--color-accent-700)] text-[var(--color-accent-800)] bg-[var(--color-accent-50)]"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>

                  {/* Profile Content */}
                  <div className="p-5">
                    {profileLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-[var(--color-accent-700)] border-t-transparent rounded-full animate-spin" />
                        <span className="ml-3 text-sm text-gray-500">
                          Loading profile...
                        </span>
                      </div>
                    ) : (
                      <>
                        {profileSubTab === "basic" && (
                          <UserBasicInfo
                            userData={userData}
                            onSave={handleUserInfoSave}
                            saving={saving}
                          />
                        )}
                        {profileSubTab === "role" &&
                          userData?.role === "buyer" && (
                            <BuyerProfile
                              buyerData={roleData}
                              onSave={handleRoleInfoSave}
                              saving={saving}
                              isEditing={!roleProfileExists}
                            />
                          )}
                        {profileSubTab === "role" &&
                          userData?.role === "seller" && (
                            <SellerProfile
                              sellerData={roleData}
                              onSave={handleRoleInfoSave}
                              saving={saving}
                              isEditing={!roleProfileExists}
                            />
                          )}
                        {profileSubTab === "role" && !userData?.role && (
                          <div className="py-8 text-center text-sm text-gray-400">
                            Your account role is not set. Please contact
                            support.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}

              {/* ════════════════════════════
                  NOTIFICATIONS TAB
              ════════════════════════════ */}
              {activeTab === "notifications" && (
                <>
                  <SectionHeader
                    title="Notification Preferences"
                    desc="Choose how you want to be notified"
                  />
                  <div className="p-5 space-y-1">
                    {[
                      {
                        id: "emailNotifications",
                        label: "Email notifications",
                        desc: "Receive notifications via email",
                      },
                      {
                        id: "pushNotifications",
                        label: "Push notifications",
                        desc: "Get browser push notifications",
                      },
                      {
                        id: "orderUpdates",
                        label: "Order updates",
                        desc: "Receive updates about your orders",
                      },
                      {
                        id: "newsletter",
                        label: "Newsletter",
                        desc: "Monthly product updates and news",
                      },
                      {
                        id: "marketingEmails",
                        label: "Marketing emails",
                        desc: "Promotional offers and announcements",
                      },
                    ].map((item) => (
                      <ToggleRow
                        key={item.id}
                        label={item.label}
                        desc={item.desc}
                        value={settings[item.id]}
                        onChange={() =>
                          handleChange(item.id, !settings[item.id])
                        }
                      />
                    ))}
                  </div>
                  <SettingsFooter
                    onCancel={() => router.back()}
                    onSave={handleSave}
                    saving={isSaving}
                  />
                </>
              )}

              {/* ════════════════════════════
                  PRIVACY TAB
              ════════════════════════════ */}
              {activeTab === "privacy" && (
                <>
                  <SectionHeader
                    title="Privacy Controls"
                    desc="Manage your privacy settings"
                  />
                  <div className="p-5 space-y-5">
                    <FormField label="Profile visibility">
                      <select
                        value={settings.profileVisibility}
                        onChange={(e) =>
                          handleChange("profileVisibility", e.target.value)
                        }
                        className="text-[12px] border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-500)]"
                      >
                        <option value="public">Public — Anyone can see</option>
                        <option value="private">Private — Only me</option>
                        <option value="contacts">
                          Contacts — Only my contacts
                        </option>
                      </select>
                    </FormField>
                    <FormField label="Who can message you">
                      <select
                        value={settings.allowMessaging}
                        onChange={(e) =>
                          handleChange("allowMessaging", e.target.value)
                        }
                        className="text-[12px] border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-500)]"
                      >
                        <option value="everyone">Everyone</option>
                        <option value="contacts">Only contacts</option>
                        <option value="none">No one</option>
                      </select>
                    </FormField>
                    <div className="border-t border-gray-100 pt-4 space-y-1">
                      <ToggleRow
                        label="Show email address"
                        desc="Display your email on your public profile"
                        value={settings.showEmail}
                        onChange={() =>
                          handleChange("showEmail", !settings.showEmail)
                        }
                      />
                      <ToggleRow
                        label="Show phone number"
                        desc="Display your phone on your public profile"
                        value={settings.showPhone}
                        onChange={() =>
                          handleChange("showPhone", !settings.showPhone)
                        }
                      />
                    </div>
                  </div>
                  <SettingsFooter
                    onCancel={() => router.back()}
                    onSave={handleSave}
                    saving={isSaving}
                  />
                </>
              )}

              {/* ════════════════════════════
                  APPEARANCE TAB
              ════════════════════════════ */}
              {activeTab === "appearance" && (
                <>
                  <SectionHeader
                    title="Appearance"
                    desc="Customize how the application looks"
                  />
                  <div className="p-5 space-y-5">
                    <FormField label="Theme">
                      <div className="flex gap-2">
                        {["Light", "Dark", "System"].map((t) => (
                          <button
                            key={t}
                            onClick={() =>
                              handleChange("theme", t.toLowerCase())
                            }
                            className={`px-4 py-1.5 text-[12px] font-semibold rounded border transition-all ${
                              settings.theme === t.toLowerCase()
                                ? "bg-[var(--color-accent-700)] text-white border-[var(--color-accent-700)]"
                                : "border-gray-300 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </FormField>
                    <FormField label="Font size">
                      <div className="flex gap-2">
                        {["Small", "Medium", "Large"].map((s) => (
                          <button
                            key={s}
                            onClick={() =>
                              handleChange("fontSize", s.toLowerCase())
                            }
                            className={`px-4 py-1.5 text-[12px] font-semibold rounded border transition-all ${
                              settings.fontSize === s.toLowerCase()
                                ? "bg-[var(--color-accent-700)] text-white border-[var(--color-accent-700)]"
                                : "border-gray-300 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </FormField>
                    <div className="border-t border-gray-100 pt-4">
                      <ToggleRow
                        label="Compact view"
                        desc="Use a more compact layout with reduced spacing"
                        value={settings.compactView}
                        onChange={() =>
                          handleChange("compactView", !settings.compactView)
                        }
                      />
                    </div>
                  </div>
                  <SettingsFooter
                    onCancel={() => router.back()}
                    onSave={handleSave}
                    saving={isSaving}
                  />
                </>
              )}

              {/* ════════════════════════════
                  SECURITY TAB
              ════════════════════════════ */}
              {activeTab === "security" && (
                <>
                  <SectionHeader
                    title="Security"
                    desc="Manage your account security"
                  />
                  <div className="p-5 space-y-5">
                    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-sm">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Password
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Last changed 3 months ago
                        </p>
                      </div>
                      <button className="px-4 py-2 text-[12px] font-semibold border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded transition-colors">
                        Change Password
                      </button>
                    </div>
                    <div className="border-t border-gray-100 pt-4 space-y-1">
                      <ToggleRow
                        label="Two-factor authentication"
                        desc="Add an extra layer of security to your account"
                        value={settings.twoFactorAuth}
                        onChange={() =>
                          handleChange("twoFactorAuth", !settings.twoFactorAuth)
                        }
                      />
                      <ToggleRow
                        label="Login alerts"
                        desc="Get notified of new sign-ins to your account"
                        value={settings.loginAlerts}
                        onChange={() =>
                          handleChange("loginAlerts", !settings.loginAlerts)
                        }
                      />
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-3">
                        Active Sessions
                      </p>
                      <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
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
                            <p className="text-[12px] font-semibold text-gray-800">
                              MacBook Pro · Current session
                            </p>
                            <p className="text-[10px] text-gray-400">
                              Active now
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                  <SettingsFooter
                    onCancel={() => router.back()}
                    onSave={handleSave}
                    saving={isSaving}
                  />
                </>
              )}

              {/* ════════════════════════════
                  BILLING TAB
              ════════════════════════════ */}
              {activeTab === "billing" && (
                <>
                  <SectionHeader
                    title="Billing & Subscription"
                    desc="Manage your subscription and payment methods"
                  />
                  <div className="p-5 space-y-5">
                    {/* Current Plan */}
                    <div className="p-4 bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] rounded-sm flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] text-[var(--color-accent-600)] font-bold uppercase tracking-wide mb-0.5">
                          Current Plan
                        </p>
                        <p className="text-base font-extrabold text-[var(--color-accent-900)]">
                          Professional
                        </p>
                        <p className="text-[11px] text-[var(--color-accent-700)] mt-0.5">
                          Next billing: April 15, 2024 · $29.99/month
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded">
                          Active
                        </span>
                        <button className="px-4 py-2 text-[12px] font-semibold border border-[var(--color-accent-300)] text-[var(--color-accent-700)] hover:bg-[var(--color-accent-100)] bg-white rounded transition-colors">
                          Change Plan
                        </button>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-3">
                        Payment Methods
                      </p>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-sm bg-white">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex-shrink-0" />
                          <div>
                            <p className="text-[12px] font-semibold text-gray-800">
                              Visa ending in 4242
                            </p>
                            <p className="text-[10px] text-gray-400">
                              Expires 12/25
                            </p>
                          </div>
                        </div>
                        <button className="text-[11px] font-semibold text-[var(--color-accent-700)] hover:underline">
                          Edit
                        </button>
                      </div>
                      <button className="mt-2 text-[12px] font-semibold text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] transition-colors">
                        + Add payment method
                      </button>
                    </div>

                    {/* Billing History */}
                    <div>
                      <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-3">
                        Billing History
                      </p>
                      <div className="border border-gray-200 rounded-sm overflow-hidden divide-y divide-gray-100">
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
                        ].map((inv, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between px-4 py-2.5 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-[12px] text-gray-600">
                              {inv.date}
                            </span>
                            <span className="text-[12px] font-bold text-gray-800">
                              {inv.amount}
                            </span>
                            <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                              {inv.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helper: Section Header ── */
function SectionHeader({ title, desc }) {
  return (
    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
      <div className="w-1 h-5 rounded-full bg-[var(--color-accent-700)]" />
      <div>
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        {desc && <p className="text-[11px] text-gray-400">{desc}</p>}
      </div>
    </div>
  );
}

/* ── Helper: Toggle Row ── */
function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
      <div>
        <p className="text-[12px] font-semibold text-gray-800">{label}</p>
        {desc && <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ${value ? "bg-[var(--color-accent-700)]" : "bg-gray-200"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${value ? "translate-x-4" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

/* ── Helper: Form Field wrapper ── */
function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ── Helper: Settings Footer ── */
function SettingsFooter({ onCancel, onSave, saving }) {
  return (
    <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50">
      <button
        onClick={onCancel}
        className="px-4 py-2 text-[12px] font-semibold text-gray-600 hover:text-gray-900 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="px-5 py-2 text-[12px] font-bold text-white bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] rounded transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
