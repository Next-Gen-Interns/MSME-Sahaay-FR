"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { registerUser } from "@/app/api/authAPI";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({
        email: formData.email,
        password: formData.password,
        fullname: formData.fullname,
        role: formData.role,
      });
      toast.success("Account created successfully!");
      router.push("/auth/login");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to create account. Try again.";
      toast.error(msg);
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
            You're already logged in. Redirecting...
          </p>
          <div className="w-6 h-6 border-2 border-[var(--color-accent-700)] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ══════════════════════════════════════════════
          LEFT — Full-height dark info panel
      ══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden">
        {/* Dark bg overlay */}
        <div className="absolute inset-0 bg-[var(--color-accent-900)]" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded flex items-center justify-center flex-shrink-0">
              <img
                src="/msmeshahhayonlylogo.png"
                alt="MSME Sahaay"
                className="w-6 h-6 object-contain"
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
              Join India's
              <br />
              Fastest Growing
              <br />
              MSME Network.
            </h1>
            <p className="text-white/75 text-sm leading-relaxed max-w-xs mb-8">
              Create your free account and start connecting with buyers,
              sellers, mentors, and funding opportunities across India.
            </p>

            <ul className="space-y-3">
              {[
                {
                  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                  text: "Free account — no credit card needed",
                },
                {
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
                  text: "Buyers & Sellers marketplace",
                },
                {
                  icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  text: "Access Funding & Growth Tools",
                },
                {
                  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                  text: "Verified MSME connections",
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
              MSMEs across India 🇮🇳
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          RIGHT — Signup form with background image
      ══════════════════════════════════════════════ */}
      <div className="lg:w-1/2 w-full relative flex flex-col min-h-screen overflow-hidden">
        {/* Background image */}
        <img
          src="https://i.pinimg.com/1200x/5b/da/11/5bda119312dada771297b235414b4df8.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* White frosted overlay */}
        <div className="absolute inset-0 bg-white/65 backdrop-blur-[3px]" />

        {/* Mobile logo bar */}
        <div className="relative z-10 lg:hidden flex items-center gap-2 px-6 py-4 bg-[var(--color-accent-800)]">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center flex-shrink-0">
            <img
              src="/msmeshahhayonlylogo.png"
              alt="MSME Sahaay"
              className="w-5 h-5 object-contain"
            />
          </div>
          <span className="text-white text-sm font-bold">MSME Sahaay</span>
        </div>

        {/* Form container */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10">
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-6 rounded-full bg-[var(--color-accent-700)]" />
                <h2 className="text-xl font-extrabold text-gray-900">
                  Create your account
                </h2>
              </div>
              <p className="text-[12px] text-gray-400 ml-3">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] font-bold"
                >
                  Sign in →
                </Link>
              </p>
            </div>

            {/* White form card */}
            <div className="bg-white border border-gray-200 rounded-sm p-7 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    required
                    placeholder="Enter your full name"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-[13px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] bg-white text-gray-800 placeholder-gray-400 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-[13px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] bg-white text-gray-800 placeholder-gray-400 transition-all"
                  />
                </div>

                {/* Password row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Password */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        placeholder="Min. 6 chars"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-3 pr-9 text-[13px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] bg-white text-gray-800 placeholder-gray-400 transition-all"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <EyeIcon open={showPassword} />
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Confirm
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        name="confirmPassword"
                        required
                        placeholder="Re-enter"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-3 py-3 pr-9 text-[13px] border rounded focus:outline-none focus:ring-1 bg-white text-gray-800 placeholder-gray-400 transition-all ${
                          formData.confirmPassword &&
                          formData.confirmPassword !== formData.password
                            ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                            : "border-gray-300 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)]"
                        }`}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirm((p) => !p)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <EyeIcon open={showConfirm} />
                      </button>
                    </div>
                    {formData.confirmPassword &&
                      formData.confirmPassword !== formData.password && (
                        <p className="text-[10px] text-red-500 mt-1 font-semibold">
                          Passwords don't match
                        </p>
                      )}
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">
                    I want to
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        value: "buyer",
                        title: "Buy Services",
                        desc: "Find & hire MSME service providers",
                        icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
                      },
                      {
                        value: "seller",
                        title: "Sell Services",
                        desc: "List your services & get leads",
                        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                      },
                    ].map((option) => {
                      const isSelected = formData.role === option.value;
                      return (
                        <label
                          key={option.value}
                          className={`flex flex-col gap-2 p-4 border-2 rounded cursor-pointer transition-all ${
                            isSelected
                              ? "border-[var(--color-accent-600)] bg-[var(--color-accent-50)]"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={option.value}
                            checked={isSelected}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? "border-[var(--color-accent-600)]"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-[var(--color-accent-600)]" />
                              )}
                            </div>
                            <div
                              className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? "bg-[var(--color-accent-100)]"
                                  : "bg-gray-100"
                              }`}
                            >
                              <svg
                                className={`w-3.5 h-3.5 ${isSelected ? "text-[var(--color-accent-700)]" : "text-gray-500"}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d={option.icon}
                                />
                              </svg>
                            </div>
                          </div>
                          <div>
                            <p
                              className={`text-[12px] font-bold leading-none ${isSelected ? "text-[var(--color-accent-800)]" : "text-gray-700"}`}
                            >
                              {option.title}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">
                              {option.desc}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
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
                      Creating account...
                    </>
                  ) : (
                    "Create Account →"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                  or
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Login CTA */}
              <Link
                href="/auth/login"
                className="flex items-center justify-center w-full py-3 border border-[var(--color-accent-300)] text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] text-[13px] font-bold rounded transition-colors"
              >
                Sign In Instead
              </Link>
            </div>

            {/* Legal */}
            <p className="text-[10px] text-gray-400 text-center mt-5 leading-relaxed">
              By creating an account, you agree to MSME Sahaay's{" "}
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
        <div className="relative z-10 flex items-center justify-center gap-5 py-5 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
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

/* ── Eye icon toggle ── */
function EyeIcon({ open }) {
  return open ? (
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
  );
}
