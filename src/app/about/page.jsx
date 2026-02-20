import React from "react";
import Image from "next/image";
import Link from "next/link";

const AboutPage = () => {
  // Platform statistics
  const stats = [
    { value: "10,000+", label: "Trusted MSMEs" },
    { value: "5,000+", label: "Verified Listings" },
    { value: "50+", label: "Business Categories" },
    { value: "100+", label: "Cities Covered" },
  ];

  // Core values/features
  const features = [
    {
      title: "Verified Business Network",
      description:
        "Every partner is thoroughly verified to ensure authentic business connections and trustworthy collaborations.",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    },
    {
      title: "Pan-India Reach",
      description:
        "Connect with businesses across all major cities and industrial hubs in India, from metros to emerging clusters.",
      icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      title: "Category-Wise Discovery",
      description:
        "Easily find partners in Professional Services, Manufacturing, Logistics, Handicrafts, and 45+ other categories.",
      icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    },
    {
      title: "Growth Support",
      description:
        "Access resources, insights, and a community dedicated to helping small and medium enterprises scale.",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    },
  ];

  // Team/leadership section
  const leadership = [
    {
      name: "Rajesh Mehta",
      role: "Founder & CEO",
      expertise: "20+ years in MSME ecosystem",
    },
    {
      name: "Priya Sharma",
      role: "Head of Partnerships",
      expertise: "Ex-Industry body leader",
    },
    {
      name: "Anil Gupta",
      role: "Technology Director",
      expertise: "SaaS platform expert",
    },
    {
      name: "Sunita Rao",
      role: "Community Manager",
      expertise: "MSME networking specialist",
    },
  ];

  // Categories grid (matching platform data)
  const categories = [
    { name: "Professional Services (CA, Legal, IT)", count: "1,200+ listings" },
    { name: "Logistics & Transport", count: "850+ listings" },
    { name: "Machinery & Equipment", count: "600+ listings" },
    { name: "Manufacturing Services", count: "950+ listings" },
    { name: "Raw Materials", count: "720+ listings" },
    { name: "Handicrafts & Textiles", count: "1,500+ listings" },
    { name: "Packaging & Printing", count: "430+ listings" },
    { name: "Tools & Industrial Products", count: "560+ listings" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--color-accent-50)] to-white pt-20 pb-16 overflow-hidden">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-accent-100)] rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[var(--color-accent-100)] text-[var(--color-accent-700)] mb-6">
              🇮🇳 India's Premier MSME Network
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Empowering India's{" "}
              <span className="text-[var(--color-accent-600)]">MSMEs</span>
              <br />
              to Connect & Grow
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              MSME Sahaay brings together verified businesses, suppliers, and
              buyers on a single platform—simplifying how small and medium
              enterprises discover opportunities and build lasting partnerships.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/register"
                className="px-6 py-3 bg-[var(--color-accent-600)] text-white font-medium rounded-xl hover:bg-[var(--color-accent-700)] transition-colors shadow-lg shadow-[var(--color-accent-200)]"
              >
                Join as Business
              </Link>
              <Link
                href="/categories"
                className="px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-300 hover:border-[var(--color-accent-400)] hover:text-[var(--color-accent-600)] transition-colors"
              >
                Explore Categories
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-[var(--color-accent-600)] uppercase tracking-wider">
                Our Mission
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-3 mb-6">
                Bridging the gap in India's MSME ecosystem
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Millions of small businesses in India struggle to find the right
                partners, suppliers, and buyers. MSME Sahaay was founded to
                solve this—creating a trusted digital space where businesses can
                discover each other, collaborate, and thrive together.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From a humble textile unit in Surat to a tech startup in
                Bangalore, we're building tools that make business networking
                accessible, verified, and productive for every MSME.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--color-accent-50)] p-6 rounded-2xl">
                <div className="text-3xl font-bold text-[var(--color-accent-600)] mb-2">
                  50K+
                </div>
                <div className="text-sm text-gray-600">
                  Monthly Active Connections
                </div>
              </div>
              <div className="bg-indigo-50 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  ₹100Cr+
                </div>
                <div className="text-sm text-gray-600">Facilitated Trade</div>
              </div>
              <div className="bg-[var(--color-accent-50)] p-6 rounded-2xl col-span-2">
                <div className="text-3xl font-bold text-[var(--color-accent-600)] mb-2">
                  45+
                </div>
                <div className="text-sm text-gray-600">
                  Business Categories Supported
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[var(--color-accent-600)] uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">
              Built for MSMEs, by MSME experts
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Every feature is designed to solve real challenges faced by small
              and medium enterprises in India.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-[var(--color-accent-200)] hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-[var(--color-accent-100)] rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[var(--color-accent-600)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Explore by Category
            </h2>
            <p className="text-gray-600 mt-3">
              Connect with businesses in your industry
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/categories/${category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-[var(--color-accent-300)] hover:shadow-md transition-all"
              >
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-[var(--color-accent-600)] transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{category.count}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent-600)] hover:text-[var(--color-accent-700)]"
            >
              View all categories
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[var(--color-accent-600)] uppercase tracking-wider">
              The Team
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">
              Experienced leadership,
            </h2>
            <p className="text-gray-600 mt-3">passionate about MSME growth</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((person, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-gray-200 text-center"
              >
                <div className="w-20 h-20 bg-[var(--color-accent-100)] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[var(--color-accent-600)]">
                    {person.name[0]}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{person.name}</h3>
                <p className="text-sm text-[var(--color-accent-600)] mt-1">
                  {person.role}
                </p>
                <p className="text-xs text-gray-500 mt-2">{person.expertise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--color-accent-600)]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to grow your business?
          </h2>
          <p className="text-[var(--color-accent-100)] mb-8 text-lg">
            Join thousands of MSMEs already connecting and thriving on MSME
            Sahaay.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/list-products"
              className="px-8 py-4 bg-white text-[var(--color-accent-600)] font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
            >
              Create Free Listing
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-[var(--color-accent-700)] text-white font-semibold rounded-xl hover:bg-[var(--color-accent-800)] transition-colors"
            >
              Contact Team
            </Link>
          </div>
          <p className="text-[var(--color-accent-200)] text-sm mt-6">
            No credit card required. Free plan available.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
