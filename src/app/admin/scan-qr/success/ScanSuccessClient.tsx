"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import createApiUrl from "../../../../lib/api";

interface UserData {
  _id: string;
  name: string;
  email: string;
  isvalidated: boolean;
  hasEntered: boolean;
  entryTime: string | null;
  allowEntry: boolean;
}

function extractId(data: string | null): string | null {
  if (!data) return null;
  
  try {
    // Try to parse as JSON
    const obj = JSON.parse(data);
    if (typeof obj === "object" && obj._id) return obj._id;
  } catch {
    // Not JSON, continue
  }
  
  // If it's a URL, try to get last part
  if (data.startsWith("http")) {
    const parts = data.split("/");
    return parts[parts.length - 1] || null;
  }
  
  // Otherwise, assume the data is the ID itself
  return data;
}

export default function ScanSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allowingEntry, setAllowingEntry] = useState(false);
  const [entryResult, setEntryResult] = useState<any>(null);

  // Extract ID from scanned data
  const userId = extractId(data);

  useEffect(() => {
    if (!userId) {
      setError("No valid user ID found in QR code");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(createApiUrl(`/admin/verify/${userId}`), {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error("User not found");
        }
        const user = await response.json();
        setUserData(user);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Do not auto-redirect; redirection will be handled after successful validation
    return () => {};
  }, [userId, router]);

  // No buzzer/audio functionality

  // Function to allow entry
  const handleAllowEntry = async () => {
    if (!userId) return;
    
    setAllowingEntry(true);
    try {
      const response = await fetch(createApiUrl(`/admin/allow-entry/${userId}`), {
        method: 'POST',
        credentials: 'include'
      });
      
      const result = await response.json();
      setEntryResult(result);
      
      // After successful first-time validation, redirect back to scanner
      // Update user data to reflect new entry status
      if (result.success && userData) {
        setUserData({
          ...userData,
          hasEntered: true,
          entryTime: result.entryTime,
          allowEntry: false
        });

        // Redirect to scanner immediately to continue scanning
        router.push("/admin/scan-qr?scan=1");
      }
      
    } catch (err) {
      setError('Failed to process entry');
    } finally {
      setAllowingEntry(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-28 pb-12 px-4 text-white font-sans">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col items-center carnival-card animate-fade-in-up">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-3 text-center bg-gradient-to-r from-green-400 to-cyan-400 text-transparent bg-clip-text leading-tight">
          Welcome to Sabrang 2025
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="mb-6 text-center text-red-400 flex flex-col items-center gap-3">
            <p>{error}</p>
            <button
              onClick={() => router.push('/admin/scan-qr?scan=1')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm"
            >
              Back to Scanner
            </button>
          </div>
        ) : userData ? (
          <>
            <div className="mb-6 text-center w-full">
              <span className="text-sm text-gray-200 block truncate">
                Hello <span className="font-semibold text-white">{userData.name}</span>
              </span>
              
              {/* Entry Status Display */}
              {userData.hasEntered ? (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg w-full">
                  <p className="text-red-300 font-bold text-base md:text-lg leading-snug">🚫 ACCESS DENIED</p>
                  <p className="text-red-400 text-xs md:text-sm mt-1">User has already entered</p>
                  {userData.entryTime && (
                    <p className="text-red-400 text-[11px] md:text-xs mt-1 break-words">
                      Entry time: {new Date(userData.entryTime).toLocaleString()}
                    </p>
                  )}
                  <div className="mt-3">
                    <button
                      onClick={() => router.push('/admin/scan-qr?scan=1')}
                      className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm"
                    >
                      Back to Scanner
                    </button>
                  </div>
                  
                </div>
              ) : (
                <div className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg w-full">
                  <p className="text-green-300 font-bold text-base md:text-lg leading-snug">✅ ENTRY ALLOWED</p>
                  <p className="text-green-400 text-xs md:text-sm mt-1">First-time entry</p>
                  
                  {!entryResult && (
                    <button
                      onClick={handleAllowEntry}
                      disabled={allowingEntry}
                      className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 
                               text-white rounded-lg transition-colors duration-200 text-sm font-semibold"
                    >
                      {allowingEntry ? 'Processing...' : 'ALLOW ENTRY'}
                    </button>
                  )}
                  
                  {entryResult && (
                    <div className={`mt-3 p-2 rounded ${entryResult.success ? 'bg-green-600' : 'bg-red-600'} w-full`}>
                      <p className="text-white text-xs md:text-sm break-words whitespace-pre-wrap">{entryResult.message}</p>
                      {entryResult.success && entryResult.entryTime && (
                        <p className="text-white text-[11px] md:text-xs mt-1 break-words">
                          Entry recorded at: {new Date(entryResult.entryTime).toLocaleString()}
                        </p>
                      )}
                      {!entryResult.success && (
                        <div className="mt-2">
                          <button
                            onClick={() => router.push('/admin/scan-qr?scan=1')}
                            className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-white text-xs md:text-sm"
                          >
                            Back to Scanner
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
              <div className="p-3 bg-black/30 rounded-lg overflow-hidden">
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-white text-xs md:text-sm break-words">{userData.email}</p>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <p className="text-xs text-gray-400">Status</p>
                <p className={`text-xs md:text-sm font-semibold ${userData.hasEntered ? 'text-red-400' : 'text-green-400'}`}>
                  {userData.hasEntered ? 'Already Entered' : 'New Entry'}
                </p>
              </div>
            </div>
          </>
        ) : null}

        <div className="mt-2 mb-6 p-3 md:p-4 bg-black/60 rounded-lg border border-green-400 text-green-300 w-full text-center overflow-hidden">
          <span className="font-bold text-xs md:text-sm">Scanned ID:</span>
          <div className="text-[11px] md:text-xs break-words mt-1">{userId || "No ID found"}</div>
        </div>

        <p className="text-gray-300 text-center text-xs md:text-sm">
          {loading ? "Fetching user details..." : ""}
        </p>
      </div>
    </div>
  );
}
