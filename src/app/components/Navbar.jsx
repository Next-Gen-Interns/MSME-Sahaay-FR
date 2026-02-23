"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
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
  Heart,
  Truck,
  MessageCircle,
  CheckCircle,
  Share2,
  Info,
  Settings2,
} from "lucide-react";
import { fetchUserProfile } from "../lib/redux/slices/profileSlice";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
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

  // Common menu items for all users
  const commonMenuItems = [
    { name: "Home", icon: Grid, route: "/" },
    { name: "Ship with MSME Sahaay", icon: Truck, route: "/listings" },
    { name: "View All Categories", icon: Package, route: "/categories" },
    { name: "Become a Seller for Free", icon: Users, route: "/auth/signup" },
  ];

  // Menu items for logged-in users only
  const loggedInMenuItems = [
    {
      name: "Post Your requirement",
      icon: ShoppingCart,
      route: "/list-products",
    },
    // { name: "Messages", icon: MessageCircle, route: "/seller/leads" },
    { name: "My Inquiries", icon: BarChart, route: "/my-leads" },
    { name: "My Favourites", icon: Heart, route: "/favorites" },
  ];

  // Business-related items for all
  const businessMenuItems = [
    { name: "Verified Experts", icon: CheckCircle, route: "/verified-experts" },
  ];

  // Additional items for all users
  const additionalMenuItems = [
    { name: "Feedback", icon: MessageSquare, route: "/feedback" },
    { name: "Help & Support", icon: HelpCircle, route: "/help" },
    { name: "Share App", icon: Share2, route: "/share" },
    { name: "About MSME Sahaay", icon: Info, route: "/about" },
    { name: "Settings", icon: Settings, route: "/settings" },
  ];

  // Generate mega menu items based on login status
  const megaMenuItems = [
    ...commonMenuItems,
    ...(isLoggedIn ? loggedInMenuItems : []),
    ...businessMenuItems,
    ...additionalMenuItems,
  ];

  // Navigation tabs - conditionally shown based on user role
  const navTabs = [
    // Role-specific tabs
    ...(isLoggedIn && userData?.role === "seller"
      ? [{ name: "Lead Hub", route: "/seller/leads" }]
      : []),
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

  // Function to handle menu item click - closes mega menu
  const handleMenuItemClick = () => {
    setIsMegaMenuOpen(false);
  };

  // Function to toggle mega menu
  const toggleMegaMenu = () => {
    setIsMegaMenuOpen(!isMegaMenuOpen);
  };
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
    }
  };

  if (isInitializing || loading) {
    return (
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-accent-300)] to-[var(--color-accent-700)] rounded-xs animate-pulse"></div>
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
              <div className="w-24 h-10 bg-gray-300 rounded-xs animate-pulse"></div>
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
              <div className="relative w-14 h-14 rounded-xs overflow-hidden group-hover:shadow-sm transition-all duration-300">
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
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search products, sellers, or categories..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-transparent"
                />
              </div>
            </div>

            {/* Desktop Nav - Navigation Tabs + Menu Button */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Navigation Tabs */}
              <div className="flex items-center space-x-4">
                {navTabs.map((tab, idx) => (
                  <Link
                    key={idx}
                    href={tab.route}
                    className="px-4 py-2 text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] transition-all duration-200 rounded-xs font-medium"
                  >
                    {tab.name}
                  </Link>
                ))}
              </div>

              {/* Mega Menu Button Container */}
              <div className="relative" ref={megaMenuButtonRef}>
                <button
                  onClick={toggleMegaMenu}
                  className="flex items-center px-6 py-2.5 text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] transition-all duration-200 rounded-xs font-medium border border-gray-200 hover:border-[var(--color-accent-300)]"
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

                {/* Mega Menu Dropdown */}
                {isMegaMenuOpen && (
                  <div
                    ref={megaMenuRef}
                    className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-xs shadow-2xl z-50 min-w-[280px]"
                    style={{
                      maxHeight: "60vh",
                      overflowY: "auto",
                    }}
                  >
                    <div className="p-3">
                      {/* Show login message if not logged in */}
                      {/* {!isLoggedIn && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-sm text-blue-800 font-medium">
                            Log in to access more features!
                          </p>
                          <Link
                            href="/auth/login"
                            onClick={handleMenuItemClick}
                            className="mt-2 block w-full text-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            Sign In
                          </Link>
                        </div>
                      )} */}

                      {/* Menu Items */}
                      <div className="flex flex-col space-y-1">
                        {megaMenuItems.map((item, index) => {
                          const Icon = item.icon;
                          // Highlight logged-in only items
                          const isLoggedInOnly = loggedInMenuItems.some(
                            (loggedInItem) => loggedInItem.name === item.name,
                          );

                          return (
                            <Link
                              key={index}
                              href={
                                isLoggedInOnly && !isLoggedIn
                                  ? "/auth/login"
                                  : item.route
                              }
                              onClick={handleMenuItemClick}
                              className={`flex items-center p-3 text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-xs transition-all duration-200 group w-full ${
                                isLoggedInOnly && !isLoggedIn
                                  ? "opacity-60"
                                  : ""
                              }`}
                            >
                              <div className="flex-shrink-0 mr-3">
                                <Icon
                                  size={18}
                                  className={`${
                                    isLoggedInOnly && !isLoggedIn
                                      ? "text-gray-400"
                                      : "text-gray-500 group-hover:text-[var(--color-accent-700)]"
                                  }`}
                                />
                              </div>
                              <span className="text-sm font-medium flex-1">
                                {item.name}
                                {isLoggedInOnly && !isLoggedIn && (
                                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                    Login Required
                                  </span>
                                )}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Auth */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 bg-white hover:bg-gray-50 px-4 py-2 rounded-xs transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
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
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xs shadow-xl z-50 overflow-hidden">
                      <div className="px-4 py-3 bg-gradient-to-r from-[var(--color-accent-50)] to-[var(--color-accent-100)] border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userData?.fullname || userData?.username || "User"}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500 capitalize">
                            {userData?.role || "user"}
                          </p>
                          {userData?.has_complete_profile && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-xs font-medium">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-2 space-y-1">
                        {/* Logged-in specific menu items */}
                        {/* <Link
                          href="/messages"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-xs transition-all duration-150"
                        >
                          <MessageCircle size={18} />
                          <span>Messages</span>
                        </Link> */}

                        {/* <Link
                          href="/orders"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-lg transition-all duration-150"
                        >
                          <ShoppingCart size={18} />
                          <span>My Orders</span>
                        </Link> */}

                        <Link
                          href="/favorites"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-xs transition-all duration-150"
                        >
                          <Heart size={18} />
                          <span>My Favourites</span>
                        </Link>

                        {userData?.role === "buyer" && (
                          <Link
                            href="/my-leads"
                            className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-xs transition-all duration-150"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <Building size={18} />
                            <span>My Inquiries</span>
                          </Link>
                        )}

                        {userData?.role === "seller" && (
                          <>
                            <Link
                              href="/list-products"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-xs"
                            >
                              <Briefcase size={18} />
                              <span>List Your Services</span>
                            </Link>

                            <Link
                              href="/seller/leads"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-xs"
                            >
                              <Users size={18} />
                              <span>Manage Your Leads</span>
                            </Link>
                          </>
                        )}
                        <Link
                          href="/settings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-xs transition-all duration-150"
                        >
                          <Settings2 size={18} />
                          <span>Settings</span>
                        </Link>
                        <div className="border-t border-gray-200 my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xs transition-all duration-150"
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
                  className="px-6 py-2.5 rounded-xs font-semibold text-white shadow-lg transition-all duration-200 bg-[var(--color-accent-700)] hover:bg-[var(--color-accent-800)]"
                >
                  Sign In
                </Link>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xs bg-gray-100 hover:bg-gray-200"
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
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)]"
                />
              </div>
            </div>

            {/* Navigation Tabs in Mobile */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Navigation
              </h3>
              <div className="space-y-1">
                {navTabs.map((tab, idx) => (
                  <Link
                    key={idx}
                    href={tab.route}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-4 px-4 py-3 text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-xs transition-all duration-200 font-medium"
                  >
                    <span>{tab.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Menu Items in Mobile */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Menu
              </h3>
              <div className="space-y-1">
                {megaMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isLoggedInOnly = loggedInMenuItems.some(
                    (loggedInItem) => loggedInItem.name === item.name,
                  );

                  return (
                    <Link
                      key={index}
                      href={
                        isLoggedInOnly && !isLoggedIn
                          ? "/auth/login"
                          : item.route
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center p-3 text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-xs ${
                        isLoggedInOnly && !isLoggedIn ? "opacity-60" : ""
                      }`}
                    >
                      <Icon size={18} className="mr-3 flex-shrink-0" />
                      <span className="text-sm flex-1">
                        {item.name}
                        {isLoggedInOnly && !isLoggedIn && (
                          <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            Login Required
                          </span>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {isLoggedIn && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Account
                </h3>
                <Link
                  href="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-4 px-4 py-3 text-gray-700 hover:text-[var(--color-accent-700)] hover:bg-[var(--color-accent-50)] rounded-xs font-medium"
                >
                  <User size={20} />
                  <span>My Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-4 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xs"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
