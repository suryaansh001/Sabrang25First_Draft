"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, AlertCircle, RefreshCw, Settings } from "lucide-react";

export default function ScanQR() {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [isMobile, setIsMobile] = useState(false);
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<any>(null);
  const isStartedRef = useRef<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if device is mobile and get available cameras
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      return mobileKeywords.some(keyword => userAgent.includes(keyword));
    };
    
    setIsMobile(checkMobile());
    
    // Get available cameras
    const getCameras = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const devices = await Html5Qrcode.getCameras();
        setCameras(devices);
        if (devices.length > 0) {
          // Prefer back camera on mobile
          const backCamera = devices.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('rear') ||
            device.label.toLowerCase().includes('environment')
          );
          setSelectedCamera(backCamera?.id || devices[0].id);
        }
      } catch (err) {
        console.warn('Could not get cameras:', err);
      }
    };
    
    getCameras();
  }, []);

  // Automatically start scanning if redirected with ?scan=1
  useEffect(() => {
    if (searchParams.get("scan") === "1") {
      setScanning(true);
    }
  }, [searchParams]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (html5QrCodeRef.current && isStartedRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current.clear().catch(() => {});
        isStartedRef.current = false;
      }
    };
  }, []);

  // Check camera permissions
  const checkCameraPermission = async () => {
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setPermissionStatus(permission.state as 'granted' | 'denied');
        return permission.state === 'granted';
      }
      return true; // Assume granted if permissions API not available
    } catch (err) {
      console.warn('Could not check camera permission:', err);
      return true;
    }
  };

  useEffect(() => {
    let mounted = true;
    
    if (scanning && scannerRef.current) {
      const runScanner = async () => {
        try {
          setError('');
          
          // Check camera permission first
          const hasPermission = await checkCameraPermission();
          if (!hasPermission && permissionStatus === 'denied') {
            setError('Camera permission denied. Please enable camera access in your browser settings.');
            setScanning(false);
            return;
          }

          const { Html5Qrcode } = await import("html5-qrcode");
          
          // Ensure previous instance is fully stopped and cleared
          if (html5QrCodeRef.current) {
            try {
              if (isStartedRef.current) {
                await html5QrCodeRef.current.stop();
                isStartedRef.current = false;
              }
              await html5QrCodeRef.current.clear();
            } catch (e) {
              console.warn('Error cleaning up previous scanner:', e);
            }
            html5QrCodeRef.current = null;
          }

          // Wait for DOM to be ready and ensure component is still mounted
          await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
          
          if (!mounted || !scannerRef.current) return;
          
          // Create new scanner instance
          html5QrCodeRef.current = new Html5Qrcode(scannerRef.current.id);

          // Mobile-optimized configuration
          const cameraConfig = selectedCamera ? 
            { deviceId: { exact: selectedCamera } } : 
            { facingMode: isMobile ? "environment" : "user" };
            
          const scanConfig = {
            fps: isMobile ? 5 : 10,
            qrbox: function(viewfinderWidth: number, viewfinderHeight: number) {
              const minEdgePercentage = 0.7;
              const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
              const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
              return {
                width: qrboxSize,
                height: qrboxSize
              };
            },
            aspectRatio: 1.0,
            disableFlip: false,
            videoConstraints: {
              advanced: [{ focusMode: "continuous" }]
            }
          };

          if (!mounted) return;

          await html5QrCodeRef.current.start(
            cameraConfig,
            scanConfig,
            (decodedText: string) => {
              // Vibrate on successful scan (mobile only)
              if ('vibrate' in navigator) {
                navigator.vibrate(200);
              }
              
              // Stop scanner and navigate
              if (html5QrCodeRef.current && isStartedRef.current) {
                isStartedRef.current = false;
                html5QrCodeRef.current
                  .stop()
                  .catch(() => {})
                  .finally(() => {
                    router.push(`/admin/scan-qr/success?data=${encodeURIComponent(decodedText)}`);
                  });
              } else {
                router.push(`/admin/scan-qr/success?data=${encodeURIComponent(decodedText)}`);
              }
            },
            (errorMessage: string) => {
              // Handle scan errors silently - this fires frequently during normal operation
            }
          );
          
          if (mounted) {
            isStartedRef.current = true;
            setPermissionStatus('granted');
            
            // Hide loading overlay once camera is initialized
            setTimeout(() => {
              const loadingOverlay = document.getElementById('loading-overlay');
              if (loadingOverlay && mounted) {
                loadingOverlay.style.display = 'none';
              }
            }, 1500);
          }
        } catch (err: any) {
          if (!mounted) return;
          
          console.error('Scanner error:', err);
          let errorMsg = 'Camera error: ';
          
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMsg = 'Camera permission denied. Please allow camera access and try again.';
            setPermissionStatus('denied');
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            errorMsg = 'No camera found. Please ensure your device has a camera.';
          } else if (err.name === 'NotSupportedError') {
            errorMsg = 'Camera not supported in this browser. Try using Chrome or Safari.';
          } else if (err.name === 'NotReadableError') {
            errorMsg = 'Camera is being used by another application. Please close other camera apps and try again.';
          } else {
            errorMsg += (err?.message || String(err));
          }
          
          setError(errorMsg);
          setScanning(false);
        }
      };
      
      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(runScanner, 100);
      
      return () => {
        clearTimeout(timeoutId);
        mounted = false;
      };
    }
    
    // Cleanup when scanning stops
    return () => {
      mounted = false;
      if (html5QrCodeRef.current && isStartedRef.current) {
        isStartedRef.current = false;
        html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current.clear().catch(() => {});
      }
    };
  }, [scanning, router, selectedCamera, isMobile]);

  const handleStartScan = async () => {
    // Unlock audio on user gesture so failure buzzer can play later
    try {
      const audio = new Audio('/audio/buzzer.mp3');
      audio.volume = 0;
      audio.play()
        .then(() => {
          try { audio.pause(); audio.currentTime = 0; } catch {}
          (window as any).__audioUnlocked = true;
        })
        .catch(() => { (window as any).__audioUnlocked = false; });
    } catch { (window as any).__audioUnlocked = false; }
    
    // Request camera permission explicitly on mobile
    if (isMobile) {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setPermissionStatus('granted');
      } catch (err) {
        setPermissionStatus('denied');
        setError('Camera permission is required to scan QR codes. Please enable camera access in your browser settings.');
        return;
      }
    }
    
    setScanning(true);
  };

  const handleRetry = async () => {
    setError('');
    
    // Stop current scanner if running
    if (html5QrCodeRef.current && isStartedRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        isStartedRef.current = false;
      } catch (e) {
        console.warn('Error stopping scanner during retry:', e);
      }
    }
    
    setScanning(false);
    
    // Small delay to ensure cleanup
    setTimeout(() => {
      setScanning(true);
    }, 300);
  };

  const openCameraSettings = () => {
    if (isMobile) {
      // On mobile, guide user to settings
      alert('To enable camera access:\n\n1. Tap the camera icon in your browser\'s address bar\n2. Select "Allow"\n3. Refresh this page and try again\n\nOr go to your browser settings and enable camera permissions for this site.');
    } else {
      alert('Please enable camera permissions in your browser settings and refresh the page.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-28 pb-12 px-4 sm:px-6 lg:px-8 text-white font-sans">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col items-center carnival-card animate-fade-in-up">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-fuchsia-400 to-rose-400 text-transparent bg-clip-text leading-tight">Scan QR Code</h1>
        
        {/* Camera Selection for Multiple Cameras */}
        {cameras.length > 1 && !scanning && (
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-300">Select Camera:</label>
            <select 
              value={selectedCamera} 
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white"
            >
              {cameras.map((camera) => (
                <option key={camera.id} value={camera.id} className="bg-gray-800">
                  {camera.label || `Camera ${camera.id}`}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="w-full flex flex-col items-center gap-6">
          {error && (
            <div className="w-full p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-300 text-sm">{error}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleRetry}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry
                  </button>
                  {permissionStatus === 'denied' && (
                    <button
                      onClick={openCameraSettings}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm flex items-center gap-1"
                    >
                      <Settings className="w-3 h-3" />
                      Settings
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {!scanning ? (
            <>
              <button
                onClick={handleStartScan}
                disabled={cameras.length === 0}
                className="w-full py-3 px-6 rounded-full text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-500 hover:to-cyan-500 text-white mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                {cameras.length === 0 ? 'No Camera Available' : 'Start Camera'}
              </button>
              
              {isMobile && (
                <div className="w-full p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                  <p className="text-blue-300 text-sm text-center">
                    📱 Mobile Tips:
                  </p>
                  <ul className="text-blue-200 text-xs mt-2 space-y-1">
                    <li>• Hold your device steady</li>
                    <li>• Ensure good lighting</li>
                    <li>• Allow camera permissions</li>
                    <li>• Use the back camera for better focus</li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="w-full aspect-square bg-black rounded-lg border border-white/20 overflow-hidden relative">
                <div ref={scannerRef} id="qr-scanner" className="w-full h-full" />
                {/* Loading overlay while camera initializes */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10" id="loading-overlay">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-white text-sm">Initializing camera...</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full flex gap-2">
                <button
                  onClick={handleRetry}
                  className="flex-1 py-3 px-6 rounded-full text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
                <button
                  onClick={async () => { 
                    // Stop scanner before exiting
                    if (html5QrCodeRef.current && isStartedRef.current) {
                      try {
                        await html5QrCodeRef.current.stop();
                        isStartedRef.current = false;
                      } catch (e) {
                        console.warn('Error stopping scanner on exit:', e);
                      }
                    }
                    setScanning(false); 
                    router.push('/admin'); 
                  }}
                  className="flex-1 py-3 px-6 rounded-full text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-gradient-to-r from-rose-400 to-fuchsia-400 hover:from-rose-500 hover:to-fuchsia-500 text-white"
                >
                  Exit
                </button>
              </div>
            </>
          )}
          
          <p className="text-gray-300 text-center text-xs md:text-sm mt-2">
            {scanning ? 'Point your camera at a QR code to scan' : 'Allow camera access to scan QR codes for event check-in'}
          </p>
          
          {permissionStatus === 'denied' && (
            <div className="w-full p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
              <p className="text-yellow-300 text-sm text-center">
                ⚠️ Camera access is required. Please enable it in your browser settings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
