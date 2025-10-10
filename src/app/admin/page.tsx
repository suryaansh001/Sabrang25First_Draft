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
  Trophy,
  ArrowRight,
  Lock,
  X,
  LogOut
} from "lucide-react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import createApiUrl from "../../lib/api";
import { events } from "../../lib/events.data";
import CoordinatorPage from "../coordinatorPage/page";

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
  const [userRole, setUserRole] = useState<'coordinator' | 'admin' | null>(null);
  const [activeTab, setActiveTab] = useState('coordinator');
  const [isAdminPanelAuthenticated, setIsAdminPanelAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
    determineUserRole();
  }, []);

  const determineUserRole = async () => {
    try {
      const response = await fetch(createApiUrl('/api/user'), {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        // Check user role based on email or other criteria
        if (userData.email === 'admin@sabrang.com' || userData.isAdmin) {
          setUserRole('admin');
        } else if (userData.email === 'coordinator@sabrang.com' || userData.role === 'coordinator') {
          setUserRole('coordinator');
        } else {
          // Default to coordinator for other users
          setUserRole('coordinator');
        }
      }
    } catch (error) {
      console.error('Error determining user role:', error);
      setUserRole('coordinator'); // Default to coordinator
    }
  };

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

  const handleTabChange = (tab: 'coordinator' | 'admin') => {
    if (tab === 'admin') {
      if (userRole !== 'admin') {
        // Show access denied message for non-admin users
        alert('Access Denied: You do not have permission to access the Admin Panel.');
        return;
      }
      if (!isAdminPanelAuthenticated) {
        // Show admin login modal for admin panel access
        setShowAdminLogin(true);
        return;
      }
    }
    setActiveTab(tab);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError('');
    setAdminLoginLoading(true);

    try {
      // Admin panel credentials (separate from user login)
      const ADMIN_PANEL_EMAIL = 'letme@cum.com';
      const ADMIN_PANEL_PASSWORD = 'cumcum@123';
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (adminCredentials.email === ADMIN_PANEL_EMAIL && adminCredentials.password === ADMIN_PANEL_PASSWORD) {
        setIsAdminPanelAuthenticated(true);
        setShowAdminLogin(false);
        setActiveTab('admin');
        setAdminCredentials({ email: '', password: '' });
      } else {
        setAdminLoginError('Invalid admin panel credentials. Please check your email and password.');
      }
    } catch (error) {
      setAdminLoginError('Authentication failed. Please try again.');
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminPanelAuthenticated(false);
    setActiveTab('coordinator');
  };

  const closeAdminLogin = () => {
    setShowAdminLogin(false);
    setAdminCredentials({ email: '', password: '' });
    setAdminLoginError('');
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


  // Show coordinator-only view for coordinator users
  if (userRole === 'coordinator') {
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
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    Coordinator Dashboard
                  </span>
                </h1>
                <p className="mt-2 text-sm text-gray-300">Manage participant entries and event coordination.</p>
              </div>
            </div>
            
            {/* Coordinator Page Content */}
            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
              <CoordinatorPage />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full admin view for admin users
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    Admin Console
                  </span>
                </h1>
                <p className="mt-2 text-sm text-gray-300">Manage Sabrang 2025 resources, users, and operations.</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-400 font-medium">Admin Access</p>
                <p className="text-xs text-gray-400">Full system privileges</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex space-x-1 rounded-xl bg-black/40 p-1 backdrop-blur-md border border-white/10">
              <button
                onClick={() => handleTabChange('coordinator')}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'coordinator'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <QrCode className="w-4 h-4 inline mr-2" />
                Coordinator Dashboard
              </button>
              <button
                onClick={() => handleTabChange('admin')}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'admin'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {isAdminPanelAuthenticated ? (
                  <Settings className="w-4 h-4 inline mr-2" />
                ) : (
                  <Lock className="w-4 h-4 inline mr-2" />
                )}
                Admin Panel
                {isAdminPanelAuthenticated && (
                  <span className="ml-2 text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                    Authenticated
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'coordinator' ? (
            <div>
              {/* Coordinator Page Content */}
              <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                <CoordinatorPage />
              </div>
            </div>
          ) : (
            <div>
              {/* Admin Panel Header with Logout */}
              <div className="mb-6 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
                    <p className="text-gray-300">Full administrative access to all system functions</p>
                  </div>
                  <button
                    onClick={handleAdminLogout}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg hover:from-red-600 hover:to-rose-600 transition-all duration-200 font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Admin Logout
                  </button>
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
          )}
          
          {/* Admin Panel Login Modal */}
          {showAdminLogin && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gray-900 rounded-2xl border border-white/20 p-8 max-w-md w-full shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Lock className="w-6 h-6 text-purple-400 mr-3" />
                    <h3 className="text-2xl font-bold text-white">Admin Panel Access</h3>
                  </div>
                  <button
                    onClick={closeAdminLogin}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <p className="text-gray-300 mb-6 text-sm">
                  Enter admin panel credentials to access full administrative functions.
                </p>
                
                {adminLoginError && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                    {adminLoginError}
                  </div>
                )}
                
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={adminCredentials.email}
                      onChange={(e) => setAdminCredentials(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Enter admin email"
                      required
                      disabled={adminLoginLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Admin Password
                    </label>
                    <input
                      type="password"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Enter admin password"
                      required
                      disabled={adminLoginLoading}
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeAdminLogin}
                      className="flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                      disabled={adminLoginLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      disabled={adminLoginLoading}
                    >
                      {adminLoginLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Authenticating...
                        </>
                      ) : (
                        'Access Admin Panel'
                      )}
                    </button>
                  </div>
                </form>
                
                
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
