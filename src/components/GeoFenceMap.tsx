"use client";

import { useEffect, useRef, useState } from "react";
import { apiGet } from "@/lib/api-client";
import { MapPin, Key, Target } from "lucide-react";

interface GeoFenceMapProps {
    /** Office center latitude */
    latitude: number;
    /** Office center longitude */
    longitude: number;
    /** Geo-fence radius in meters */
    radius: number;
    /** Office name for the marker title */
    officeName: string;
}

export default function GeoFenceMap({
    latitude,
    longitude,
    radius,
    officeName,
}: GeoFenceMapProps) {
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
        if (!googleMapsKey || !mapRef.current) return;

        const lat = Number(latitude);
        const lng = Number(longitude);
        const r = Number(radius);
        if (isNaN(lat) || isNaN(lng) || isNaN(r)) return;

        const key = googleMapsKey;
        const mapDiv = mapRef.current;

        let cancelled = false;

        async function initMap() {
            try {
                const { setOptions, importLibrary } = await import(
                    "@googlemaps/js-api-loader"
                );

                setOptions({
                    key,
                    v: "weekly",
                });

                await importLibrary("core");
                await importLibrary("maps");
                if (cancelled || !mapDiv) return;

                const officePos = { lat, lng };

                const map = new window.google.maps.Map(mapDiv, {
                    center: officePos,
                    zoom: 16,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                    zoomControl: true,
                });

                // Build bounds to cover the geofence circle extent
                const bounds = new window.google.maps.LatLngBounds();
                bounds.extend(officePos);

                // Extend bounds by approx radius in each direction (degrees)
                const latDelta = r / 111320; // 1° lat ≈ 111.32 km
                const lngDelta = r / (111320 * Math.cos((lat * Math.PI) / 180));
                bounds.extend({ lat: lat + latDelta, lng: lng + lngDelta });
                bounds.extend({ lat: lat - latDelta, lng: lng - lngDelta });
                bounds.extend({ lat: lat + latDelta, lng: lng - lngDelta });
                bounds.extend({ lat: lat - latDelta, lng: lng + lngDelta });

                // Geo-fence circle (emerald)
                new window.google.maps.Circle({
                    strokeColor: "#10B981",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#10B981",
                    fillOpacity: 0.1,
                    map,
                    center: officePos,
                    radius: r,
                    zIndex: 1,
                });

                // Pulsing outer ring for visual effect
                new window.google.maps.Circle({
                    strokeColor: "#10B981",
                    strokeOpacity: 0.3,
                    strokeWeight: 1,
                    fillColor: "#10B981",
                    fillOpacity: 0.04,
                    map,
                    center: officePos,
                    radius: r * 1.0,
                    zIndex: 0,
                });

                // Office center marker (indigo pin)
                new window.google.maps.Marker({
                    position: officePos,
                    map,
                    title: `${officeName} — ${r}m Geo-fence`,
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 12,
                        fillColor: "#6366F1", // indigo-500
                        fillOpacity: 1,
                        strokeColor: "#FFFFFF",
                        strokeWeight: 3,
                    },
                    zIndex: 10,
                });

                // Auto zoom/pan to show the geo-fence
                map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
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
    }, [googleMapsKey, latitude, longitude, radius, officeName]);

    // --- Render states ---

    // Still loading API key
    if (googleMapsKey === undefined) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
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
                        Add <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[8px]">GOOGLE_MAPS_API_KEY</code> to your backend{" "}
                        <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[8px]">.env</code> file
                    </span>
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

            {/* Geo-fence legend */}
            <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-slate-200 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-indigo-500 border-2 border-white shadow-sm" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    {officeName}
                </span>
                <span className="text-[9px] text-slate-400">•</span>
                <span className="h-3 w-3 rounded-full bg-emerald-500/40 border border-emerald-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    {radius}m Radius
                </span>
                <Target className="h-3 w-3 text-indigo-500" />
            </div>
        </div>
    );
}