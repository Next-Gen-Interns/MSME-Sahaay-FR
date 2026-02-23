// app/auth/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/app/api/authAPI";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);

  const router = useRouter();

  /* ── Redirect if already logged in ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAlreadyLoggedIn(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setTimeout(() => {
        router.replace(user?.role === "admin" ? "/admin/dashboard" : "/");
      }, 1500);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser({ email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("auth-change"));

      toast.success("Welcome Back!");
      setTimeout(() => {
        router.replace(user?.role === "admin" ? "/admin/dashboard" : "/");
      }, 800);
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password. Try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Already logged in screen ── */
  if (alreadyLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-sm p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-[var(--color-accent-50)] border border-[var(--color-accent-200)] rounded flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-[var(--color-accent-600)]"
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
          </div>
          <h2 className="text-sm font-bold text-gray-900 mb-1">
            Already Signed In
          </h2>
          <p className="text-[11px] text-gray-400 mb-4">
            You're already logged in. Redirecting you to the homepage...
          </p>
          <div className="w-6 h-6 border-2 border-[var(--color-accent-700)] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ══════════════════════════════════════════════
          LEFT — Full-height background image panel
      ══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden">
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-[var(--color-accent-900)]" />

        {/* Content over image */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded flex items-center justify-center flex-shrink-0">
              <img
                src="/msmeshahhayonlylogo.png"
                className="text-[var(--color-accent-800)] text-sm font-black"
              />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-none">
                MSME Sahaay
              </p>
              <p className="text-white/60 text-[10px] mt-0.5">
                India's MSME Marketplace
              </p>
            </div>
          </div>

          {/* Center text */}
          <div>
            <h1 className="text-3xl font-extrabold text-white leading-tight mb-4">
              Connect.
              <br />
              Grow.
              <br />
              Succeed.
            </h1>
            <p className="text-white/75 text-sm leading-relaxed max-w-xs mb-8">
              India's trusted platform for MSME business growth, verified
              sellers, mentors, and funding resources.
            </p>

            <ul className="space-y-3">
              {[
                {
                  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                  text: "5,000+ Verified Sellers",
                },
                {
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
                  text: "Connect with Mentors & Experts",
                },
                {
                  icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  text: "Access Funding & Growth Tools",
                },
                {
                  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                  text: "Track Leads & Inquiries",
                },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                  </div>
                  <span className="text-[12px] text-white/85 font-medium">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom trust stat */}
          <div className="border-t border-white/20 pt-6">
            <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1 font-semibold">
              Trusted by
            </p>
            <p className="text-white text-2xl font-extrabold leading-none">
              10,000+
            </p>
            <p className="text-white/60 text-[11px] mt-0.5">
              MSMEs across India
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          RIGHT — Login form (full height, scrollable)
      ══════════════════════════════════════════════ */}
      <div className="lg:w-1/2 w-full bg-[#f5f5f5] flex flex-col min-h-screen">
        {/* Mobile logo bar */}
        <div className="lg:hidden flex items-center gap-2 px-6 py-4 bg-[var(--color-accent-800)]">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center flex-shrink-0">
            <img
              src="/msmeshahhayonlylogo.png"
              className="text-[var(--color-accent-800)] text-sm font-black"
            />
          </div>
          <span className="text-white text-sm font-bold">MSME Sahaay</span>
        </div>

        {/* Form container — centered vertically */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10">
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-6 rounded-full bg-[var(--color-accent-700)]" />
                <h2 className="text-xl font-extrabold text-gray-900">
                  Sign in to your account
                </h2>
              </div>
              <p className="text-[12px] text-gray-400 ml-3">
                New to MSME Sahaay?{" "}
                <Link
                  href="/auth/signup"
                  className="text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] font-bold"
                >
                  Create a free account →
                </Link>
              </p>
            </div>

            {/* White form card */}
            <div className="bg-white border border-gray-200 rounded-sm p-7 shadow-sm">
              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded px-3 py-2.5 mb-5">
                  <svg
                    className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-[12px] text-red-700 font-semibold">
                    {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-[13px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] bg-white text-gray-800 placeholder-gray-400 transition-all"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                      Password
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-[11px] text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] font-semibold"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-11 text-[13px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] bg-white text-gray-800 placeholder-gray-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? (
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
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 border-gray-300 rounded accent-[var(--color-accent-700)] cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="text-[12px] text-gray-600 cursor-pointer select-none"
                  >
                    Keep me signed in
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-sm font-bold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In →"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                  or
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Register CTA */}
              <Link
                href="/auth/signup"
                className="flex items-center justify-center w-full py-3 border border-[var(--color-accent-300)] text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] text-[13px] font-bold rounded transition-colors"
              >
                Create Free Account
              </Link>
            </div>

            {/* Legal */}
            <p className="text-[10px] text-gray-400 text-center mt-5 leading-relaxed">
              By signing in, you agree to MSME Sahaay's{" "}
              <Link
                href="/terms"
                className="text-[var(--color-accent-600)] hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-[var(--color-accent-600)] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-center gap-5 py-5 border-t border-gray-200 bg-white">
          {["About", "Help", "Terms", "Privacy-Policy"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(" ", "-")}`}
              className="text-[10px] text-gray-400 hover:text-gray-700 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
