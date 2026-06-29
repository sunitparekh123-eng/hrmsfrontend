"use client";

import { useEffect, useRef, useState } from "react";
import { apiGet } from "@/lib/api-client";
import { MapPin, Key, Building2 } from "lucide-react";

interface AttendanceMapProps {
  latitude: number | null;
  longitude: number | null;
  location: string;
  employeeName: string;
  /** Office center lat for geofence circle */
  officeLat?: number | null;
  /** Office center lng for geofence circle */
  officeLon?: number | null;
  /** Radius in meters (defaults to 200) */
  officeRadius?: number | null;
}

export default function AttendanceMap({
  latitude,
  longitude,
  location,
  employeeName,
  officeLat,
  officeLon,
  officeRadius = 200,
}: AttendanceMapProps) {
  const [googleMapsKey, setGoogleMapsKey] = useState<string | null | undefined>(undefined);
  const mapRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch Google Maps API key from backend
  useEffect(() => {
    apiGet<{ googleMapsApiKey: string | null }>(
      `/config/maps-key?_t=${Date.now()}`
    )
      .then((res) => setGoogleMapsKey(res.googleMapsApiKey || null))
      .catch(() => setGoogleMapsKey(null));
  }, []);

  // Initialize the map once key + coordinates are available
  useEffect(() => {
    if (!googleMapsKey || !latitude || !longitude || !mapRef.current) return;

    // Coerce to numbers (API may return strings) and capture for the async closure
    const lat = Number(latitude);
    const lng = Number(longitude);
    const oLat = officeLat != null ? Number(officeLat) : null;
    const oLon = officeLon != null ? Number(officeLon) : null;
    const oRadius = officeRadius != null ? Number(officeRadius) : null;
    // Reject NaN after coercion
    if (isNaN(lat) || isNaN(lng)) return;
    const key = googleMapsKey;
    const mapDiv = mapRef.current;

    let cancelled = false;

    async function initMap() {
      try {
        // Dynamically import the v4+ functional API (only on client)
        const { setOptions, importLibrary } = await import(
          "@googlemaps/js-api-loader"
        );

        // Configure API key before loading any library
        setOptions({
          key,
          v: "weekly",
        });

        // Load core + maps libraries (populates google.maps namespace)
        await importLibrary("core");
        await importLibrary("maps");
        if (cancelled || !mapDiv) return;

        const map = new window.google.maps.Map(mapDiv, {
          // Placeholder center — fitBounds will override
          center: { lat: lat, lng: lng },
          zoom: 16,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });

        // Build bounds to auto-fit both punch + geofence in view
        const bounds = new window.google.maps.LatLngBounds();

        // --- Punch location marker (red) ---
        const punchPos = { lat: lat, lng: lng };
        bounds.extend(punchPos);
        new window.google.maps.Marker({
          position: punchPos,
          map,
          title: `${employeeName}'s punch — ${location}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#EF4444", // red-500
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          },
        });

        // --- Office geofence circle (green) ---
        if (oLat != null && oLon != null && oRadius != null) {
          const officePos = { lat: oLat, lng: oLon };
          // Expand bounds to cover the geofence circle extent
          bounds.extend(officePos);
          // Also extend bounds by approx radius in each direction (degrees)
          const latDelta = oRadius / 111320; // 1° lat ≈ 111.32 km
          const lngDelta = oRadius / (111320 * Math.cos((oLat * Math.PI) / 180));
          bounds.extend({ lat: oLat + latDelta, lng: oLon + lngDelta });
          bounds.extend({ lat: oLat - latDelta, lng: oLon - lngDelta });
          bounds.extend({ lat: oLat + latDelta, lng: oLon - lngDelta });
          bounds.extend({ lat: oLat - latDelta, lng: oLon + lngDelta });

          new window.google.maps.Circle({
            strokeColor: "#10B981", // emerald-500
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#10B981",
            fillOpacity: 0.1,
            map,
            center: officePos,
            radius: oRadius,
            zIndex: 1,
          });

          // Office center dot
          new window.google.maps.Marker({
            position: officePos,
            map,
            title: `Office: ${location}`,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: "#10B981",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
            },
            zIndex: 2,
          });
        }

        // Auto zoom/pan to show everything
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      } catch (err: any) {
        if (!cancelled) {
          setLoadError(err?.message || "Failed to load Google Maps");
        }
      }
    }

    initMap();

    return () => {
      cancelled = true;
    };
  }, [googleMapsKey, latitude, longitude, officeLat, officeLon, officeRadius, employeeName, location]);

  // --- Render states ---

  // Still loading API key
  if (googleMapsKey === undefined) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Loading map…
          </span>
        </div>
      </div>
    );
  }

  // No API key
  if (!googleMapsKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3 max-w-[240px] text-center">
          <Key className="h-8 w-8 text-amber-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Google Maps API Key Required
          </span>
          <span className="text-[9px] text-slate-400 leading-relaxed">
            Add <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[8px]">GOOGLE_MAPS_API_KEY</code> to your backend <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[8px]">.env</code> file
          </span>
        </div>
      </div>
    );
  }

  // No location data
  if (!latitude || !longitude) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <MapPin className="h-8 w-8 text-slate-300" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            No location data available
          </span>
          {location && (
            <span className="text-[9px] text-slate-400">{location}</span>
          )}
        </div>
      </div>
    );
  }

  // Failed to load Google Maps JS
  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3 max-w-[240px] text-center">
          <Key className="h-8 w-8 text-rose-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Map Failed to Load
          </span>
          <span className="text-[9px] text-slate-400 leading-relaxed">
            {loadError}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Google Maps container */}
      <div ref={mapRef} className="w-full h-full rounded-b-3xl" />

      {/* Geofence legend */}
      {officeLat != null && officeLon != null && officeRadius != null && (
        <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-slate-200 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Geofence Radius: {officeRadius}m
          </span>
          <Building2 className="h-3 w-3 text-emerald-500" />
        </div>
      )}
    </div>
  );
}
