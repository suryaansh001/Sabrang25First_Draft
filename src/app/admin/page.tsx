"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Plus, 
  Edit3, 
  QrCode, 
  Users, 
  Tag, 
  Package, 
  BarChart3, 
  Settings,
  Calendar,
  Gift,
  Mail,
  Trophy
} from "lucide-react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import createApiUrl from "../../lib/api";
import { events } from "../../lib/events.data";

interface AnalyticsData {
  totalUsers: number;
  totalEvents: number;
  totalOffers: number;
  totalPromoCodes: number;
  activePurchases: number;
  usedPromoCodes: number;
  totalRevenue: number;
}


function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(createApiUrl('/admin/analytics/dashboard'), {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        // Fix the events count - use the correct count from frontend data
        const correctedData = {
          ...data,
          totalEvents: events.length // Use the actual events count (17)
        };
        setAnalytics(correctedData);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminActions = [
    {
      title: "Coordinator Page",
      href: "/coordinatorPage",
      icon: <QrCode className="w-6 h-6" />,
      gradient: "from-blue-400 to-cyan-500",
      hoverGradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Manage Users",
      href: "/admin/manage-users",
      icon: <Settings className="w-6 h-6" />,
      gradient: "from-green-400 to-emerald-500",
      hoverGradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Scan QR",
      href: "/admin/scan-qr",
      icon: <QrCode className="w-6 h-6" />,
      gradient: "from-yellow-400 to-orange-500",
      hoverGradient: "from-yellow-500 to-orange-600"
    },
    {
      title: "View Users",
      href: "/admin/users",
      icon: <Users className="w-6 h-6" />,
      gradient: "from-purple-500 to-pink-600",
      hoverGradient: "from-purple-600 to-pink-700"
    },
    {
      title: "Recent Registrations",
      href: "/admin/recent-registrations",
      icon: <Calendar className="w-6 h-6" />,
      gradient: "from-teal-500 to-emerald-600",
      hoverGradient: "from-teal-600 to-emerald-700"
    },
    {
      title: "Registrations & Teams",
      href: "/admin/registrations",
      icon: <Users className="w-6 h-6" />,
      gradient: "from-indigo-500 to-purple-600",
      hoverGradient: "from-indigo-600 to-purple-700"
    },
    {
      title: "Email Management",
      href: "/admin/email-management",
      icon: <Mail className="w-6 h-6" />,
      gradient: "from-cyan-500 to-blue-600",
      hoverGradient: "from-cyan-600 to-blue-700"
    },
    {
      title: "Promo Codes",
      href: "/admin/promo-codes",
      icon: <Tag className="w-6 h-6" />,
      gradient: "from-red-500 to-rose-600",
      hoverGradient: "from-red-600 to-rose-700"
    },
    {
      title: "Checkout Offers",
      href: "/admin/checkout-offers",
      icon: <Package className="w-6 h-6" />,
      gradient: "from-indigo-500 to-blue-600",
      hoverGradient: "from-indigo-600 to-blue-700"
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      gradient: "from-emerald-500 to-teal-600",
      hoverGradient: "from-emerald-600 to-teal-700"
    },
    {
      title: "Bulk Promo",
      href: "/admin/bulk-promo",
      icon: <Gift className="w-6 h-6" />,
      gradient: "from-pink-500 to-violet-600",
      hoverGradient: "from-pink-600 to-violet-700"
    }
  ];


  return (
    <div className="relative min-h-screen w-full text-white font-sans">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-cyan-600/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[40rem] bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 pt-20 pb-16 px-4">
        <div className="mx-auto w-full max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Admin Console
                </span>
              </h1>
              <p className="mt-2 text-sm text-gray-300">Manage Sabrang 2025 resources, users, and operations.</p>
            </div>
          </div>

          {/* Top KPIs */}
          <div className="mb-10">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[0,1,2,3].map((i) => (
                  <div key={i} className="animate-pulse rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="h-8 w-8 rounded-md bg-white/10 mb-3" />
                    <div className="h-6 w-20 bg-white/10 rounded mb-2" />
                    <div className="h-3 w-24 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            ) : analytics ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-4 backdrop-blur-md transition hover:border-white/20">
                  <Users className="w-8 h-8 mb-2 text-blue-400" />
                  <p className="text-2xl font-bold tracking-tight">{analytics.totalUsers}</p>
                  <p className="text-xs text-gray-300">Total Users</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-4 backdrop-blur-md transition hover:border-white/20">
                  <Calendar className="w-8 h-8 mb-2 text-green-400" />
                  <p className="text-2xl font-bold tracking-tight">{analytics.totalEvents}</p>
                  <p className="text-xs text-gray-300">Events</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-4 backdrop-blur-md transition hover:border-white/20">
                  <Package className="w-8 h-8 mb-2 text-purple-400" />
                  <p className="text-2xl font-bold tracking-tight">{analytics.totalOffers}</p>
                  <p className="text-xs text-gray-300">Active Offers</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-4 backdrop-blur-md transition hover:border-white/20">
                  <Tag className="w-8 h-8 mb-2 text-yellow-400" />
                  <p className="text-2xl font-bold tracking-tight">{analytics.totalPromoCodes}</p>
                  <p className="text-xs text-gray-300">Promo Codes</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {adminActions.map((action, index) => (
              <Link href={action.href} key={index} className="group">
                <div className="relative rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-md transition-transform duration-200 hover:-translate-y-1 hover:border-white/20">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className={`relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${action.gradient} mb-4 ring-1 ring-white/20 shadow-lg shadow-black/30`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-1 tracking-tight">
                    {action.title}
                  </h3>
                  <div className={`h-[2px] w-0 bg-gradient-to-r ${action.gradient} rounded-full transition-all duration-300 group-hover:w-24`}></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Stats */}
          {!loading && analytics && (
            <div className="mt-12 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">System Metrics</h2>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-wide text-gray-300">live</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl border border-white/10 bg-gradient-to-b from-emerald-400/5 to-transparent p-4">
                  <div className="text-3xl font-bold text-emerald-400">₹{analytics.totalRevenue}</div>
                  <div className="text-sm text-gray-300">Total Revenue</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-gradient-to-b from-blue-400/5 to-transparent p-4">
                  <div className="text-3xl font-bold text-blue-400">{analytics.activePurchases}</div>
                  <div className="text-sm text-gray-300">Completed Purchases</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-gradient-to-b from-purple-400/5 to-transparent p-4">
                  <div className="text-3xl font-bold text-purple-400">{analytics.usedPromoCodes}</div>
                  <div className="text-sm text-gray-300">Used Promo Codes</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrap with admin protection
export default function ProtectedAdminDashboard() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
