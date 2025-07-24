"use client";
import React from "react";
import Link from "next/link";

function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-32 pb-16 px-4 text-white font-sans">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-10 flex flex-col items-center carnival-card animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-fuchsia-400 to-rose-400 text-transparent bg-clip-text">Admin Dashboard</h1>
        <div className="flex flex-col gap-6 w-full">
          <Link href="/admin_dashboard/add-event" className="w-full">
            <button className="w-full py-3 px-6 rounded-full text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">Add Event</button>
          </Link>
          <Link href="/admin_dashboard/edit-event" className="w-full">
            <button className="w-full py-3 px-6 rounded-full text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-500 hover:to-cyan-500 text-white">Edit Event</button>
          </Link>
          <Link href="/admin_dashboard/scan-qr" className="w-full">
            <button className="w-full py-3 px-6 rounded-full text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">Scan QR</button>
          </Link>
          <Link href="/admin_dashboard/users" className="w-full">
            <button className="w-full py-3 px-6 rounded-full text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">View Users</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Wrap with admin protection
export default AdminDashboard;