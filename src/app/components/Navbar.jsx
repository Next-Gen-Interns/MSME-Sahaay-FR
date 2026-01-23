"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  ChevronDown,
  Menu,
  X,
  Briefcase,
  Users,
  Building,
  Search,
  Grid,
  Package,
  ShoppingCart,
  BarChart,
  Settings,
  HelpCircle,
  Bell,
  Mail,
  FileText,
  CreditCard,
  Shield,
  Globe,
  Clock,
  Star,
  TrendingUp,
  Users2,
  Calendar,
  MessageSquare,
  Download,
  Upload,
  Filter,
  Layers,
  Target,
  PieChart,
  Wallet,
  Headphones,
  BookOpen,
  Award,
  Zap,
} from "lucide-react";
import { fetchUserProfile } from "../lib/redux/slices/profileSlice";
import Image from "next/image";

export default function Navbar() {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state) => state.profile);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const megaMenuRef = useRef(null);
  const megaMenuButtonRef = useRef(null);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const megaMenuItems = [
    { name: "Dashboard", icon: Grid, route: "/dashboard" },
    { name: "All Products", icon: Package, route: "/products" },
    { name: "My Orders", icon: ShoppingCart, route: "/orders" },
    { name: "Analytics", icon: BarChart, route: "/analytics" },
    { name: "Settings", icon: Settings, route: "/settings" },
    { name: "Help Center", icon: HelpCircle, route: "/help" },
    { name: "Notifications", icon: Bell, route: "/notifications" },
    { name: "Messages", icon: Mail, route: "/messages" },
    { name: "Documents", icon: FileText, route: "/documents" },
    { name: "Billing", icon: CreditCard, route: "/billing" },
    { name: "Security", icon: Shield, route: "/security" },
    { name: "Global Market", icon: Globe, route: "/global-market" },
    { name: "Recent Activity", icon: Clock, route: "/activity" },
    { name: "Favorites", icon: Star, route: "/favorites" },
    { name: "Trending", icon: TrendingUp, route: "/trending" },
    { name: "Team", icon: Users2, route: "/team" },
    { name: "Calendar", icon: Calendar, route: "/calendar" },
    { name: "Chat", icon: MessageSquare, route: "/chat" },
  ];

  const navTabs = [
    ...(userData?.role === "seller"
      ? [{ name: "Lead Hub", route: "/seller/leads" }]
      : []),
    { name: "Privacy Policy", route: "/privacy-policy" },
  ];

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("token");
      const hasToken = !!token;
      setIsLoggedIn(hasToken);

      if (hasToken) {
        dispatch(fetchUserProfile())
          .unwrap()
          .catch((error) => {
            console.error("Failed to fetch user profile:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsLoggedIn(false);
          })
          .finally(() => {
            setIsInitializing(false);
          });
      } else {
        setIsInitializing(false);
      }
    };

    initializeAuth();

    const handleStorageChange = (e) => {
      if (!e || e.key === "token") initializeAuth();
    };

    const handleAuthChange = () => {
      initializeAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
      if (
        megaMenuRef.current && 
        !megaMenuRef.current.contains(event.target) &&
        megaMenuButtonRef.current && 
        !megaMenuButtonRef.current.contains(event.target)
      ) {
        setIsMegaMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("auth-change"));
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
    window.location.href = "/";
  };

  if (isInitializing || loading) {
    return (
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-accent-300)] to-[var(--color-accent-700)] rounded-xl animate-pulse"></div>
              <div className="w-32 h-6 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-20 h-6 bg-gray-300 rounded animate-pulse"
                ></div>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden group-hover:shadow-sm transition-all duration-300">
                <Image
                  src="/msmeshahhayonlylogo.png"
                  alt="MSME Guru Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                MSME Sahaay
              </span>
            </Link>

            {/* Search Bar - Desktop Only */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products, sellers, or categories..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-transparent"
                />
              </div>
            </div>

            {/* Desktop Nav - Only Menu Button */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Mega Menu Button Container */}
              <div 
                className="relative" 
                ref={megaMenuButtonRef}
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={(e) => {
                  const relatedTarget = e.relatedTarget;
                  if (
                    megaMenuRef.current && 
                    !megaMenuRef.current.contains(relatedTarget)
                  ) {
                    setIsMegaMenuOpen(false);
                  }
                }}
              >
                <button
                  className="flex items-center px-6 py-2.5 text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] transition-all duration-200 rounded-xl font-medium border border-gray-200 hover:border-[var(--color-accent-300)]"
                >
                  <Grid size={20} className="mr-2" />
                  Menu
                  <ChevronDown
                    size={16}
                    className={`ml-2 transition-transform duration-200 ${
                      isMegaMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Mega Menu Dropdown - FIXED: No horizontal scrollbar */}
                {isMegaMenuOpen && (
                  <div
                    ref={megaMenuRef}
                    onMouseEnter={() => setIsMegaMenuOpen(true)}
                    onMouseLeave={() => setIsMegaMenuOpen(false)}
                    className="fixed left-0 top-16 bg-white border-x border-b border-gray-200 shadow-2xl z-50"
                    style={{
                      width: "100vw",
                      maxHeight: "50vh",
                      overflowY: "auto",
                      overflowX: "hidden", // FIX: Prevent horizontal scrolling
                    }}
                  >
                    <div className="p-4 sm:p-6">
                      {/* FIXED: Responsive grid with proper constraints */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                        {megaMenuItems.map((item, index) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={index}
                              href={item.route}
                              onClick={() => setIsMegaMenuOpen(false)}
                              className="flex items-center p-2 sm:p-3 text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-lg transition-all duration-200 group"
                            >
                              <div className="flex-shrink-0 mr-2 sm:mr-3">
                                <Icon size={16} className="text-gray-500 group-hover:text-[var(--color-accent-700)]" />
                              </div>
                              <span className="text-xs sm:text-sm font-medium truncate">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Spacing between menu button and profile/sign-in */}
              <div className="w-6"></div>
            </div>

            {/* Right Side Auth */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
                  >
                    {userData?.avatar_url ? (
                      <img
                        src={`${baseUrl}${userData.avatar_url}`}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover border-2 border-[var(--color-accent-700)] shadow-sm"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--color-accent-300)] to-[var(--color-accent-700)] flex items-center justify-center shadow-sm">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-semibold text-gray-900 max-w-24 truncate">
                        {userData?.fullname || userData?.username || "User"}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {userData?.role || "user"}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                      <div className="px-4 py-3 bg-gradient-to-r from-[var(--color-accent-50)] to-[var(--color-accent-100)] border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userData?.fullname || userData?.username || "User"}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500 capitalize">
                            {userData?.role || "user"}
                          </p>
                          {userData?.has_complete_profile && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-2 space-y-1">
                        <Link
                          href="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-lg transition-all duration-150"
                        >
                          <User size={18} />
                          <span>My Profile</span>
                        </Link>
                        {userData?.role === "buyer" && (
                          <>
                            <Link
                              href="/my-leads"
                              className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-lg transition-all duration-150"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <Building size={18} />
                              <span>My Inquiries</span>
                            </Link>
                          </>
                        )}
                        {userData?.role === "seller" && (
                          <>
                            <Link
                              href="/list-products"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-lg"
                            >
                              <Briefcase size={18} />
                              <span>List Products</span>
                            </Link>

                            <Link
                              href="/seller/leads"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-lg"
                            >
                              <Users size={18} />
                              <span>Lead Management</span>
                            </Link>
                          </>
                        )}

                        <div className="border-t border-gray-200 my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150"
                        >
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-6 py-2.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-800)]"
                >
                  Sign In
                </Link>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
              >
                {isMobileMenuOpen ? (
                  <X size={20} className="text-gray-700" />
                ) : (
                  <Menu size={20} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Updated with Search */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden fixed inset-0 top-16 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 64px)" }}
        >
          <div className="px-4 sm:px-6 py-4">
            {/* Search in Mobile Menu */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)]"
                />
              </div>
            </div>

            <div className="space-y-1">
              {navTabs.map((tab, idx) => (
                <Link
                  key={idx}
                  href={tab.route}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-4 px-4 py-3 text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-xl transition-all duration-200 font-medium text-lg"
                >
                  <span>{tab.name}</span>
                </Link>
              ))}

              {/* Mega Menu Items in Mobile - Responsive grid */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Quick Access
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {megaMenuItems.slice(0, 12).map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={index}
                        href={item.route}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center p-3 text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-lg overflow-hidden"
                      >
                        <Icon size={18} className="mr-2 flex-shrink-0 min-w-[24px]" />
                        <span className="text-sm truncate">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {isLoggedIn && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-4 px-4 py-3 text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-xl font-medium"
                  >
                    <User size={20} />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-4 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}