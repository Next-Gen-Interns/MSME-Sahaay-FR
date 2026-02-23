"use client";

import { useState } from "react";

// ── Animated orbiting avatar ──────────────────────────────────────────────────
const avatars = [
  { color: "#e74c3c", initials: "RK", top: "0%", left: "50%", delay: "0s" },
  { color: "#e67e22", initials: "AM", top: "25%", left: "93%", delay: "0.1s" },
  { color: "#27ae60", initials: "PS", top: "75%", left: "93%", delay: "0.2s" },
  { color: "#2980b9", initials: "NV", top: "100%", left: "50%", delay: "0.3s" },
  { color: "#8e44ad", initials: "DJ", top: "75%", left: "7%", delay: "0.4s" },
  { color: "#16a085", initials: "SR", top: "25%", left: "7%", delay: "0.5s" },
];

const shareChannels = [
  {
    name: "WhatsApp",
    color: "#25D366",
    bg: "#dcfce7",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.114.553 4.1 1.523 5.824L.057 23.428a.5.5 0 0 0 .609.61l5.7-1.494A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.944 0-3.77-.497-5.353-1.367l-.383-.217-3.981 1.044 1.02-3.88-.232-.388A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
  },
  {
    name: "Email",
    color: "#EA4335",
    bg: "#fee2e2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    color: "#0088cc",
    bg: "#dbeafe",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    color: "#0A66C2",
    bg: "#dbeafe",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Twitter/X",
    color: "#000000",
    bg: "#f1f5f9",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Copy Link",
    color: "#6366f1",
    bg: "#ede9fe",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-7 h-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
  },
];

export default function ShareAppPage() {
  const [copied, setCopied] = useState(false);
  const [hoveredChannel, setHoveredChannel] = useState(null);

  const referralLink = "https://msmesahaay.in/ref/USER123";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (channel) => {
    const msg = encodeURIComponent(
      `Join me on MSME Sahaay — India's fastest growing MSME platform! ${referralLink}`,
    );
    const urls = {
      WhatsApp: `https://wa.me/?text=${msg}`,
      Telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${msg}`,
      "Twitter/X": `https://twitter.com/intent/tweet?text=${msg}`,
      LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
      Email: `mailto:?subject=Join%20MSME%20Sahaay&body=${msg}`,
      "Copy Link": null,
    };
    if (channel === "Copy Link") {
      handleCopy();
    } else if (urls[channel]) {
      window.open(urls[channel], "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        * { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }

        @keyframes orbit {
          from { transform: rotate(var(--start)) translateX(160px) rotate(calc(-1 * var(--start))); }
          to   { transform: rotate(calc(var(--start) + 360deg)) translateX(160px) rotate(calc(-1 * (var(--start) + 360deg))); }
        }
        .orbit-avatar {
          animation: orbit 12s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        .float { animation: float 3s ease-in-out infinite; }

        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }

        @keyframes fadein {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fadein { animation: fadein 0.6s ease both; }

        .card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12);
        }

        .link-box {
          background: linear-gradient(135deg, #1e3a5f, #243b6e);
        }
        .invite-btn {
          background: linear-gradient(135deg, #1e3a5f, #2d4f8a);
          transition: all 0.2s ease;
        }
        .invite-btn:hover {
          background: linear-gradient(135deg, #162d4a, #1e3a5f);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(30,58,95,0.4);
        }
      `}</style>

      {/* ── Page layout ── */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* ── Header ── */}
        <div className="fadein mb-10">
          <h1 className="font-display text-4xl font-800 text-[#1e3a5f] leading-tight">
            Invite Friends &<br />
            <span className="text-[var(--color-accent-500)]">
              Grow Together
            </span>
          </h1>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* ── LEFT: Orbit visual ── */}
          <div
            className="fadein flex flex-col items-center"
            style={{ animationDelay: "0.1s" }}
          >
            <div
              className="relative flex items-center justify-center"
              style={{ width: 380, height: 380 }}
            >
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2d4f8a] opacity-10" />

              {/* Dashed orbit ring */}
              <div
                className="absolute rounded-full border-2 border-dashed border-[var(--color-accent-300)] opacity-50"
                style={{ width: 320, height: 320 }}
              />

              {/* Pulse rings */}
              <div
                className="absolute rounded-full border border-[var(--color-accent-400)] opacity-20 pulse-ring"
                style={{ width: 260, height: 260 }}
              />

              {/* Orbiting avatars */}
              {avatars.map((av, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    width: 380,
                    height: 380,
                    top: 0,
                    left: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "--start": `${i * 60}deg`,
                    animation: `orbit 14s linear infinite`,
                    animationDelay: `${-i * (14 / 6)}s`,
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: av.color, flexShrink: 0 }}
                  >
                    {av.initials}
                  </div>
                </div>
              ))}

              {/* Center: phone mockup */}
              <div className="relative z-10 float">
                <div
                  className="rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-2 border-4 border-white"
                  style={{
                    width: 110,
                    height: 190,
                    background: "linear-gradient(160deg, #1e3a5f, #243b6e)",
                  }}
                >
                  {/* Notch */}
                  <div className="absolute top-3 w-8 h-2 bg-white/20 rounded-full" />
                  <div className="mt-4 flex flex-col items-center gap-1">
                    {/* Logo mark */}
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-1 border border-white/20">
                      <span className="text-white font-display font-bold text-lg">
                        M
                      </span>
                    </div>
                    <span className="text-white/80 text-[9px] font-semibold tracking-wider">
                      MSME SAHAAY
                    </span>
                  </div>
                  {/* Share icon */}
                  <div className="w-10 h-10 rounded-full bg-[var(--color-accent-500)] flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11A2.994 2.994 0 0 0 18 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81A2.994 2.994 0 0 0 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.76 0 1.44-.3 1.96-.77l7.13 4.16c-.05.21-.09.43-.09.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Tagline below orbit */}
            <p className="mt-6 text-center text-sm text-gray-500 max-w-xs leading-relaxed">
              Spread the joy of{" "}
              <strong className="text-[#1e3a5f]">MSME Sahaay</strong> with your
              network.
              <br />
              Every Invite helps build India's MSME ecosystem.
            </p>
          </div>

          {/* ── RIGHT: Share panel ── */}
          <div
            className="fadein flex flex-col gap-5"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Referral link box */}
            <div className="link-box rounded-2xl p-5">
              <p className="text-xs text-[var(--color-accent-300)] uppercase tracking-widest font-semibold mb-3">
                Invite Link
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm font-mono truncate">
                  {referralLink}
                </div>
                <button
                  onClick={handleCopy}
                  className="shrink-0 px-4 py-3 rounded-lg bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-400)] text-white text-sm font-semibold transition-all"
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Share via */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">
                Share Via
              </p>
              <div className="grid grid-cols-3 gap-3">
                {shareChannels.map((ch) => (
                  <button
                    key={ch.name}
                    onClick={() => handleShare(ch.name)}
                    onMouseEnter={() => setHoveredChannel(ch.name)}
                    onMouseLeave={() => setHoveredChannel(null)}
                    className="card-hover flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 cursor-pointer"
                    style={{
                      background:
                        hoveredChannel === ch.name ? ch.bg : "#fafafa",
                    }}
                  >
                    <div style={{ color: ch.color }}>{ch.icon}</div>
                    <span className="text-[11px] font-semibold text-gray-600">
                      {ch.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Big invite button */}
            <button
              onClick={() => handleShare("WhatsApp")}
              className="invite-btn w-full py-4 rounded-2xl text-white font-display font-bold text-lg tracking-wide shadow-lg"
            >
              INVITE FRIENDS NOW
            </button>

            <p className="text-center text-xs text-gray-400">
              Share with colleagues, partners, and business contacts to help
              them grow on MSME Sahaay.
            </p>
          </div>
        </div>

        {/* ── How it works ── */}
        <div className="fadein mt-14" style={{ animationDelay: "0.3s" }}>
          <h2 className="font-display text-xl font-bold text-[#1e3a5f] mb-6 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Share Your Link",
                desc: "Copy your unique referral link and share it with friends, colleagues, or on social media.",
              },
              {
                step: "02",
                title: "They Join MSME Sahaay",
                desc: "Your friend signs up using your link and creates their business profile on the platform.",
              },
              {
                step: "03",
                title: "Both of You Benefit",
                desc: "Earn rewards for every successful referral. The more you share, the more you earn.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="card-hover bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden"
              >
                <span className="font-display text-6xl font-bold text-gray-50 absolute -top-2 -right-1 select-none">
                  {item.step}
                </span>
                <div className="relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-100)] flex items-center justify-center mb-3">
                    <span className="text-[var(--color-accent-600)] text-xs font-bold font-display">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-[#1e3a5f] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
