"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useProfileCheck } from "../hooks/useProfileCheck";
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
  getSubscriptionPlans,
  createSubscription,
  cancelSubscription,
  getUserSubscription,
  getFreePlanInfo,
  getUsageAlerts,
} from "../api/subscriptionApi";
import {
  setLoading,
  setRoleData,
  setUserData,
} from "../lib/redux/slices/profileSlice";
import toast from "react-hot-toast";

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

// ─── Billing Icons ───────────────────────────────────────────────────────────
const Icons = {
  Check: () => (
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
  ),
  Warning: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
      />
    </svg>
  ),
  Success: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Cancel: () => (
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  User: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  Star: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Zap: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
  Rocket: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
};

// ─── Confirm Toast ────────────────────────────────────────────────────────────
const confirmToast = (message) =>
  new Promise((resolve) => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded-xl shadow-lg border w-80 text-gray-900">
        <p className="whitespace-pre-line text-sm">{message}</p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
            onClick={() => {
              toast.dismiss(t.id);
              resolve(false);
            }}
          >
            No
          </button>
          <button
            className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
            onClick={() => {
              toast.dismiss(t.id);
              resolve(true);
            }}
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    ));
  });

// ─── Plan Card ────────────────────────────────────────────────────────────────
const PlanCard = ({
  plan,
  onSubscribe,
  subscribing,
  canSubscribe,
  featured = false,
  isCurrentPlan,
  isFreePlan,
}) => (
  <div
    className={`relative flex flex-col bg-white rounded-2xl border-2 transition-all duration-200 hover:shadow-md ${
      featured
        ? "border-[var(--color-accent-500)] shadow-lg"
        : "border-gray-200"
    } ${isCurrentPlan ? "ring-1 ring-[var(--color-accent-500)]" : ""}`}
  >
    {/* Badge */}
    {(featured || isCurrentPlan) && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-700)] text-white px-4 py-1 rounded-full text-[10px] font-bold shadow flex items-center gap-1">
          {isCurrentPlan ? (
            <>
              <Icons.Success />
              {isFreePlan ? "Current Plan" : "Active Plan"}
            </>
          ) : (
            <>
              <Icons.Star />
              <span>Most Popular</span>
            </>
          )}
        </span>
      </div>
    )}

    <div className="p-5 flex-1 flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
            featured
              ? "bg-blue-50"
              : isFreePlan
                ? "bg-gray-100"
                : "bg-[var(--color-accent-50)]"
          }`}
        >
          {isFreePlan ? (
            <Icons.User />
          ) : featured ? (
            <span className="text-[var(--color-accent-600)]">
              <Icons.Zap />
            </span>
          ) : (
            <span className="text-[var(--color-accent-600)]">
              <Icons.Rocket />
            </span>
          )}
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">{plan.name}</h3>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          {plan.description}
        </p>
      </div>

      {/* Price */}
      <div className="text-center mb-5">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl font-extrabold text-gray-900">
            ${plan.price}
          </span>
          <span className="text-gray-400 text-sm">/{plan.billing_cycle}</span>
        </div>
        {isFreePlan ? (
          <p className="text-[10px] text-green-600 font-semibold mt-1">
            Default for all users
          </p>
        ) : (
          <p className="text-[10px] text-gray-400 mt-1">Cancel anytime</p>
        )}
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-2 mb-5">
        {Object.entries(plan.features)
          .slice(0, 6)
          .map(([key, value]) => (
            <li key={key} className="flex items-start gap-2">
              <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icons.Check />
              </span>
              <span className="text-[11px] text-gray-600 leading-tight">
                {value}
              </span>
            </li>
          ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => !isFreePlan && onSubscribe(plan.plan_id)}
        disabled={subscribing || isCurrentPlan || !canSubscribe}
        className={`w-full py-2.5 px-4 rounded-xl text-[12px] font-bold transition-all duration-200 ${
          isCurrentPlan
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : featured
              ? "bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-800)] text-white hover:opacity-90 shadow"
              : isFreePlan
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gradient-to-r from-[var(--color-accent-700)] to-[var(--color-accent-600)] text-white hover:opacity-90 shadow"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isCurrentPlan ? (
          <span className="flex items-center justify-center gap-1.5">
            <Icons.Success />
            {isFreePlan ? "Current Plan" : "Active Plan"}
          </span>
        ) : subscribing ? (
          <span className="flex items-center justify-center gap-1.5">
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : isFreePlan ? (
          "Current Plan"
        ) : (
          "Subscribe Now"
        )}
      </button>
    </div>
  </div>
);

// ─── Billing Tab Content ──────────────────────────────────────────────────────
function BillingTab({ userData, checkProfileCompletion }) {
  const [plans, setPlans] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const [usageAlerts, setUsageAlerts] = useState([]);
  const [billingLoading, setBillingLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [planTab, setPlanTab] = useState("all");

  const isAuthenticated =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  useEffect(() => {
    fetchBillingData();
  }, []);

  useEffect(() => {
    if (userData?.role) setPlanTab(userData.role);
  }, [userData]);

  const fetchBillingData = async () => {
    try {
      setBillingLoading(true);
      const [plansRes, freePlanRes] = await Promise.all([
        getSubscriptionPlans(),
        getFreePlanInfo(),
      ]);
      if (plansRes.data.success) setPlans(plansRes.data.data);

      if (isAuthenticated) {
        const [subRes, alertsRes] = await Promise.all([
          getUserSubscription(),
          getUsageAlerts(),
        ]);
        if (subRes.data.success) setUserSubscription(subRes.data.data);
        if (alertsRes.data.success) setUsageAlerts(alertsRes.data.data);
      }
    } catch (e) {
      console.error("Error fetching billing data:", e);
    } finally {
      setBillingLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe");
      return;
    }
    if (!checkProfileCompletion(userData?.role)) return;

    const selectedPlan = plans.find((p) => p.plan_id === planId);
    if (selectedPlan?.price === 0) return;

    try {
      setSubscribing(true);
      const res = await createSubscription({ plan_id: planId });
      if (res.data.success) {
        toast.success("Subscription activated!");
        await fetchBillingData();
        if (res.data.payment_url) window.location.href = res.data.payment_url;
      }
    } catch (error) {
      const msg =
        error.response?.data?.error || "Failed to create subscription";
      toast.error(
        msg.includes("already has")
          ? "You already have a subscription. Please cancel your current plan first."
          : msg,
      );
    } finally {
      setSubscribing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!userSubscription?.subscription) {
      toast.error("No active subscription found");
      return;
    }
    if (userSubscription.subscription.plan.price === 0) {
      toast.error("Free plan cannot be canceled");
      return;
    }

    const confirmed = await confirmToast(
      "Are you sure you want to cancel your subscription?\n\n⚠️ Cancellations are non-refundable. You'll retain access until the end of your billing period.",
    );
    if (!confirmed) return;

    try {
      setCanceling(true);
      const res = await cancelSubscription();
      if (res.data.success) {
        toast.success("Subscription cancelled");
        await fetchBillingData();
      } else throw new Error(res.data.error);
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.message ||
        "Failed to cancel subscription";
      if (msg.includes("No active subscription found")) {
        await fetchBillingData();
        toast.error("No active subscription found. Please refresh.");
      } else toast.error(msg);
    } finally {
      setCanceling(false);
    }
  };

  const isFreePlanUser =
    !userSubscription?.subscription || userSubscription.isFreePlan;
  const isPaidActive =
    userSubscription?.subscription?.status === "active" &&
    userSubscription.subscription.plan.price > 0;
  const isPaidCanceled =
    userSubscription?.subscription?.status === "canceled" &&
    userSubscription.subscription.plan.price > 0;

  const getFilteredPlans = () => {
    if (!userData) return plans;
    if (planTab === "buyer" || planTab === "seller")
      return plans.filter(
        (p) => p.plan_type === planTab || p.plan_type === "both",
      );
    return plans.filter(
      (p) => p.plan_type === userData.role || p.plan_type === "both",
    );
  };

  const filteredPlans = getFilteredPlans();

  const availableTabs = userData?.role
    ? [
        { id: "all", label: "All Plans" },
        {
          id: userData.role,
          label: userData.role === "buyer" ? "For Buyers" : "For Sellers",
        },
      ]
    : [
        { id: "all", label: "All Plans" },
        { id: "buyer", label: "For Buyers" },
        { id: "seller", label: "For Sellers" },
      ];

  const usageStats = (() => {
    if (!userSubscription?.usage) return null;
    return Object.entries(userSubscription.usage)
      .filter(([, d]) => d.limit > 0 && d.used > 0)
      .sort((a, b) => b[1].used / b[1].limit - a[1].used / a[1].limit)
      .slice(0, 3);
  })();

  if (billingLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-7 h-7 border-2 border-[var(--color-accent-700)] border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-sm text-gray-400">
          Loading billing info...
        </span>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6">
      {/* ── Current Subscription Status Card ── */}
      {isAuthenticated && userSubscription && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left: Plan info */}
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isPaidActive ? "bg-green-100" : "bg-blue-50"
                }`}
              >
                {isPaidActive ? (
                  <span className="text-green-600">
                    <Icons.Success />
                  </span>
                ) : (
                  <span className="text-[var(--color-accent-600)]">
                    <Icons.User />
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {isPaidActive
                    ? userSubscription.subscription.plan.name
                    : "Free Plan"}
                </p>
                <p
                  className={`text-[11px] font-medium ${
                    isPaidActive
                      ? "text-green-600"
                      : isPaidCanceled
                        ? "text-amber-600"
                        : "text-[var(--color-accent-600)]"
                  }`}
                >
                  {isPaidActive ? (
                    <>
                      Active · Renews{" "}
                      {new Date(
                        userSubscription.subscription.current_period_end,
                      ).toLocaleDateString()}
                      {userSubscription.subscription.cancel_at_period_end && (
                        <span className="ml-1 text-amber-600">
                          (Cancels at period end)
                        </span>
                      )}
                    </>
                  ) : isPaidCanceled ? (
                    "Cancelled — reverting to Free Plan"
                  ) : (
                    "Free Plan — upgrade for more features"
                  )}
                </p>
              </div>
            </div>

            {/* Right: Usage bars */}
            <div className="flex flex-wrap gap-5">
              {usageStats?.map(([feature, data]) => {
                const pct = (data.used / data.limit) * 100;
                return (
                  <div key={feature} className="text-center">
                    <p className="text-[10px] font-semibold text-gray-500 capitalize mb-1">
                      {feature.replace("_", " ")}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            pct >= 90
                              ? "bg-red-500"
                              : pct >= 70
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500">
                        {data.used}/{data.limit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cancel button */}
            {isPaidActive && (
              <button
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="flex items-center gap-1.5 px-4 py-2 border border-red-300 text-red-600 bg-white rounded-lg text-[12px] font-semibold hover:bg-red-50 transition-colors disabled:opacity-50 flex-shrink-0"
              >
                {canceling ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <>
                    <Icons.Cancel />
                    <span>Cancel Plan</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Non-refundable notice */}
          {isPaidActive && (
            <div className="mt-3 flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-amber-500 flex-shrink-0 mt-0.5">
                <Icons.Warning />
              </span>
              <p className="text-[11px] text-amber-700">
                <strong>Important:</strong> Cancellations are non-refundable.
                You'll keep premium access until the end of your billing period.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Usage Alerts ── */}
      {usageAlerts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-orange-500">
              <Icons.Warning />
            </span>
            <p className="text-sm font-bold text-orange-800">
              Usage Limits Approaching
            </p>
          </div>
          <div className="space-y-2">
            {usageAlerts.slice(0, 3).map((alert, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[11px] text-orange-700 capitalize">
                  {alert.feature.replace("_", " ")}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-orange-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        alert.severity === "error"
                          ? "bg-red-500"
                          : alert.severity === "warning"
                            ? "bg-orange-500"
                            : "bg-[var(--color-accent-500)]"
                      }`}
                      style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      alert.severity === "error"
                        ? "text-red-600"
                        : alert.severity === "warning"
                          ? "text-orange-600"
                          : "text-[var(--color-accent-600)]"
                    }`}
                  >
                    {alert.percentage}%
                  </span>
                </div>
              </div>
            ))}
            {usageAlerts.length > 3 && (
              <p className="text-[11px] text-orange-600 font-medium">
                +{usageAlerts.length - 3} more limits approaching
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Section title ── */}
      <div>
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
          Available Plans
        </p>
        <p className="text-sm text-gray-600">
          {userData?.role === "buyer"
            ? "Scale your procurement with the right plan"
            : userData?.role === "seller"
              ? "Grow your business with the right plan"
              : "Start free, upgrade as you grow."}
        </p>
      </div>

      {/* ── Plan type tabs ── */}
      {availableTabs.length > 1 && (
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPlanTab(tab.id)}
              className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                planTab === tab.id
                  ? "bg-white text-[var(--color-accent-800)] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Plans Grid ── */}
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlans.map((plan, index) => {
            const isFreePlan = plan.price === 0;
            const isCurrentPlan =
              (isFreePlanUser && isFreePlan) ||
              userSubscription?.subscription?.plan_id === plan.plan_id;
            const canSubscribe =
              isAuthenticated &&
              (plan.plan_type === userData?.role ||
                plan.plan_type === "both") &&
              checkProfileCompletion(userData?.role) &&
              plan.price > 0;

            return (
              <PlanCard
                key={plan.plan_id}
                plan={plan}
                onSubscribe={handleSubscribe}
                subscribing={subscribing}
                canSubscribe={canSubscribe}
                featured={index === 1 && filteredPlans.length >= 3}
                isCurrentPlan={isCurrentPlan}
                isFreePlan={isFreePlan}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
          <p className="text-sm text-gray-400">
            No plans available for this category.
          </p>
        </div>
      )}

      {/* ── Profile completion nudge ── */}
      {isAuthenticated && !checkProfileCompletion(userData?.role) && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-[var(--color-accent-200)] rounded-xl">
          <span className="text-[var(--color-accent-500)] flex-shrink-0">
            <Icons.Warning />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--color-accent-800)]">
              Complete your profile to subscribe
            </p>
            <p className="text-[11px] text-[var(--color-accent-600)] mt-0.5">
              Profile setup is required before activating a paid plan.
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/settings")}
            className="px-3 py-1.5 bg-[var(--color-accent-600)] text-white text-[12px] font-semibold rounded-lg hover:bg-[var(--color-accent-700)] transition-colors flex-shrink-0"
          >
            Complete Profile
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Settings Page ───────────────────────────────────────────────────────
export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    userData,
    roleData,
    loading: profileLoading,
  } = useSelector((s) => s.profile);
  const { checkProfileCompletion } = useProfileCheck();

  const [activeTab, setActiveTab] = useState("profile");
  const [profileSubTab, setProfileSubTab] = useState("basic");
  const [roleProfileExists, setRoleProfileExists] = useState(false);
  const [saving, setSaving] = useState(false);

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
      {/* Header */}
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
          {/* Sidebar */}
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
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-semibold transition-all text-left relative ${
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

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              {/* ── PROFILE TAB ── */}
              {activeTab === "profile" && (
                <>
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

              {/* ── NOTIFICATIONS TAB ── */}
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

              {/* ── PRIVACY TAB ── */}
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

              {/* ── APPEARANCE TAB ── */}
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
                            className={`px-4 py-1.5 text-[12px] font-semibold rounded border transition-all ${settings.theme === t.toLowerCase() ? "bg-[var(--color-accent-700)] text-white border-[var(--color-accent-700)]" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
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
                            className={`px-4 py-1.5 text-[12px] font-semibold rounded border transition-all ${settings.fontSize === s.toLowerCase() ? "bg-[var(--color-accent-700)] text-white border-[var(--color-accent-700)]" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
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

              {/* ── SECURITY TAB ── */}
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

              {/* ── BILLING TAB ── */}
              {activeTab === "billing" && (
                <>
                  <SectionHeader
                    title="Billing & Subscription"
                    desc="Manage your subscription and payment methods"
                  />
                  <BillingTab
                    userData={userData}
                    checkProfileCompletion={checkProfileCompletion}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */
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
