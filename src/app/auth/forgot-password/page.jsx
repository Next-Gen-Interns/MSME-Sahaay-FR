"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { requestOtp, verifyOtp, resetPassword } from "@/app/api/authAPI";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await requestOtp({ email });
      setSuccess(res.data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await verifyOtp({ email, otp_code: otp });
      if (!res.data.reset_token) throw new Error("Invalid OTP");
      setResetToken(res.data.reset_token);
      setSuccess("OTP verified successfully");
      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "OTP verification failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword({
        reset_token: resetToken,
        new_password: newPassword,
      });
      setSuccess(res.data.message || "Password reset successfully!");
      setTimeout(() => router.push("/auth/login?message=password_reset"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, label: "Email" },
    { number: 2, label: "Verify OTP" },
    { number: 3, label: "New Password" },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ══════════════════════════════════════════════
          LEFT — dark info panel (matches login/signup)
      ══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden">
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
              Recover your
              <br />
              account in
              <br />3 easy steps.
            </h1>
            <p className="text-white/75 text-sm leading-relaxed max-w-xs mb-8">
              We'll send a one-time password to your registered email to verify
              your identity and reset your password securely.
            </p>

            {/* Step guide */}
            <div className="space-y-4">
              {[
                {
                  num: "01",
                  title: "Enter your email",
                  desc: "We send a 6-digit OTP to your inbox",
                },
                {
                  num: "02",
                  title: "Verify OTP",
                  desc: "Enter the code to confirm your identity",
                },
                {
                  num: "03",
                  title: "Set new password",
                  desc: "Choose a strong new password",
                },
              ].map((item) => (
                <div key={item.num} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-black text-white/70">
                      {item.num}
                    </span>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-white">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-white/55 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
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
          RIGHT — form with background image
      ══════════════════════════════════════════════ */}
      <div className="lg:w-1/2 w-full relative flex flex-col min-h-screen overflow-hidden">
        {/* Background image */}
        <img
          src="/images/msme-login-bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-white/65 backdrop-blur-[3px]" />

        {/* Mobile logo */}
        <div className="relative z-10 lg:hidden flex items-center gap-2 px-6 py-4 bg-[var(--color-accent-800)]">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center flex-shrink-0">
            <img
              src="/msmeshahhayonlylogo.png"
              alt=""
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
                  Recover your account
                </h2>
              </div>
              <p className="text-[12px] text-gray-400 ml-3">
                Remembered your password?{" "}
                <Link
                  href="/auth/login"
                  className="text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] font-bold"
                >
                  Sign in →
                </Link>
              </p>
            </div>

            {/* White card */}
            <div className="bg-white border border-gray-200 rounded-sm p-7 shadow-sm space-y-6">
              {/* ── Step Progress ── */}
              <div className="flex items-center">
                {steps.map((s, idx) => (
                  <div key={s.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black border-2 transition-all ${
                          step > s.number
                            ? "bg-green-500 border-green-500 text-white"
                            : step === s.number
                              ? "bg-[var(--color-accent-700)] border-[var(--color-accent-700)] text-white"
                              : "bg-white border-gray-300 text-gray-400"
                        }`}
                      >
                        {step > s.number ? (
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          s.number
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-semibold mt-1 whitespace-nowrap ${
                          step >= s.number ? "text-gray-700" : "text-gray-400"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>

                    {idx < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 mb-4 transition-all ${
                          step > s.number ? "bg-green-400" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* ── Alerts ── */}
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded px-3 py-2.5">
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
              {success && (
                <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded px-3 py-2.5">
                  <svg
                    className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"
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
                  <p className="text-[12px] text-green-700 font-semibold">
                    {success}
                  </p>
                </div>
              )}

              {/* ══════════════
                  STEP 1 — EMAIL
              ══════════════ */}
              {step === 1 && (
                <form onSubmit={handleRequestOtp} className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 text-[13px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] bg-white text-gray-800 placeholder-gray-400 transition-all"
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5">
                      We'll send a 6-digit OTP to this email address.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-sm font-bold rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                        Sending OTP...
                      </>
                    ) : (
                      "Send OTP →"
                    )}
                  </button>
                </form>
              )}

              {/* ══════════════
                  STEP 2 — OTP
              ══════════════ */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Enter 6-digit OTP
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="• • • • • •"
                      className="w-full px-4 py-3 text-center text-2xl font-black tracking-[0.6em] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] bg-white text-gray-800 placeholder-gray-300 transition-all"
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5">
                      OTP sent to{" "}
                      <span className="font-bold text-gray-600">{email}</span>.{" "}
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-[var(--color-accent-700)] font-bold hover:underline"
                      >
                        Change email
                      </button>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full py-3 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-sm font-bold rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                        Verifying...
                      </>
                    ) : (
                      "Verify OTP →"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={loading}
                    className="w-full py-2 text-[12px] font-semibold text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] transition-colors"
                  >
                    Resend OTP
                  </button>
                </form>
              )}

              {/* ══════════════════════
                  STEP 3 — NEW PASSWORD
              ══════════════════════ */}
              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  {/* New password */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full px-4 py-3 pr-11 text-[13px] border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)] bg-white text-gray-800 placeholder-gray-400 transition-all"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowNew((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <EyeIcon open={showNew} />
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className={`w-full px-4 py-3 pr-11 text-[13px] border rounded focus:outline-none focus:ring-1 bg-white text-gray-800 placeholder-gray-400 transition-all ${
                          confirmPassword && confirmPassword !== newPassword
                            ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                            : "border-gray-300 focus:ring-[var(--color-accent-500)] focus:border-[var(--color-accent-500)]"
                        }`}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirm((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <EyeIcon open={showConfirm} />
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p className="text-[10px] text-red-500 mt-1 font-semibold">
                        Passwords don't match
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-900)] text-white text-sm font-bold rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                        Resetting...
                      </>
                    ) : (
                      "Reset Password →"
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Back link */}
            <div className="text-center mt-5">
              <Link
                href="/auth/login"
                className="text-[12px] text-[var(--color-accent-700)] hover:text-[var(--color-accent-900)] font-semibold transition-colors"
              >
                ← Back to Login
              </Link>
            </div>
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

/* ── Eye icon ── */
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
