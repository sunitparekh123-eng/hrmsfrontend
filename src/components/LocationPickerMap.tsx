"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { apiGet } from "@/lib/api-client";
import { MapPin, Key, Target } from "lucide-react";

export interface LocationPickerMapProps {
    /** Initial center latitude */
    initialLat: number;
    /** Initial center longitude */
    initialLng: number;
    /** Geo-fence radius in meters */
    radius: number;
    /** Fired every time the user moves the pin */
    onChange: (lat: number, lng: number) => void;
}

/**
 * Interactive Google Map that lets the admin click or drag a pin
 * to set the exact office geo-fence center coordinates.
 *
 * Syncs back to the parent form via the `onChange` callback.
 */
export default function LocationPickerMap({
    initialLat,
    initialLng,
    radius,
    onChange,
}: LocationPickerMapProps) {
    const [googleMapsKey, setGoogleMapsKey] = useState<string | null | undefined>(undefined);
    const mapRef = useRef<HTMLDivElement>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Mutable refs so the map callbacks always read the latest props
    const latRef = useRef(initialLat);
    const lngRef = useRef(initialLng);
    const radiusRef = useRef(radius);
    const onChangeRef = useRef(onChange);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const circleRef = useRef<google.maps.Circle | null>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);

    // Keep refs in sync
    latRef.current = initialLat;
    lngRef.current = initialLng;
    radiusRef.current = radius;
    onChangeRef.current = onChange;

    // ── Fetch Google Maps API key ──────────────────────────────
    useEffect(() => {
        apiGet<{ googleMapsApiKey: string | null }>(
            `/config/maps-key?_t=${Date.now()}`
        )
            .then((res) => setGoogleMapsKey(res.googleMapsApiKey || null))
            .catch(() => setGoogleMapsKey(null));
    }, []);

    // ── Update marker & circle position when props change ──────
    // (avoids full map re-init on every lat/lng keystroke)
    useEffect(() => {
        if (!mapInstanceRef.current) return;
        const pos = new google.maps.LatLng(latRef.current, lngRef.current);

        if (markerRef.current) {
            markerRef.current.setPosition(pos);
        }
        if (circleRef.current) {
            circleRef.current.setCenter(pos);
            circleRef.current.setRadius(radiusRef.current);
        }
    }, [initialLat, initialLng, radius]);

    // ── Initialize the map ─────────────────────────────────────
    useEffect(() => {
        if (!googleMapsKey || !mapRef.current) return;

        const key = googleMapsKey;
        const mapDiv = mapRef.current;
        let cancelled = false;

        async function initMap() {
            try {
                const { setOptions, importLibrary } = await import(
                    "@googlemaps/js-api-loader"
                );

                setOptions({ key, v: "weekly" });
                await importLibrary("core");
                await importLibrary("maps");
                if (cancelled || !mapDiv) return;

                const center = {
                    lat: latRef.current,
                    lng: lngRef.current,
                };

                const map = new window.google.maps.Map(mapDiv, {
                    center,
                    zoom: 16,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                    zoomControl: true,
                    clickableIcons: false,
                    // Style to make geo-fence circle pop
                    styles: [
                        {
                            featureType: "all",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#64748b" }],
                        },
                    ],
                });

                mapInstanceRef.current = map;

                // ── Geo-fence circle ─────────────────────────────
                const circle = new google.maps.Circle({
                    strokeColor: "#10B981",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#10B981",
                    fillOpacity: 0.12,
                    map,
                    center,
                    radius: radiusRef.current,
                    zIndex: 1,
                    draggable: false,
                    editable: false,
                });
                circleRef.current = circle;

                // ── Outer pulse ring ─────────────────────────────
                new google.maps.Circle({
                    strokeColor: "#10B981",
                    strokeOpacity: 0.25,
                    strokeWeight: 1,
                    fillColor: "#10B981",
                    fillOpacity: 0.04,
                    map,
                    center,
                    radius: radiusRef.current * 1.0,
                    zIndex: 0,
                });

                // ── Draggable office-center pin ──────────────────
                const pinSvg = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="46" viewBox="0 0 38 46">
                      <defs>
                        <filter id="shadow" x="-20%" y="-10%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1e293b" flood-opacity="0.3"/>
                        </filter>
                      </defs>
                      <path d="M19 0C8.5 0 0 8.5 0 19c0 13.3 17.3 26.1 18 26.7.4.4 1 .4 1.4 0 .7-.6 18-13.4 18-26.7C37.4 8.5 28.9 0 19 0z" fill="#6366F1" filter="url(#shadow)"/>
                      <circle cx="19" cy="18" r="7" fill="white"/>
                      <circle cx="19" cy="18" r="4" fill="#6366F1"/>
                    </svg>
                `;

                const marker = new google.maps.Marker({
                    position: center,
                    map,
                    draggable: true,
                    title: "Drag to set office location",
                    icon: {
                        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pinSvg)}`,
                        scaledSize: new google.maps.Size(38, 46),
                        anchor: new google.maps.Point(19, 46),
                    },
                    animation: google.maps.Animation.DROP,
                    zIndex: 10,
                });
                markerRef.current = marker;

                // ── Click-on-map to move pin ─────────────────────
                map.addListener("click", (e: google.maps.MapMouseEvent) => {
                    if (!e.latLng) return;
                    const newLat = e.latLng.lat();
                    const newLng = e.latLng.lng();
                    marker.setPosition(e.latLng);
                    circle.setCenter(e.latLng);
                    map.panTo(e.latLng);
                    onChangeRef.current(
                        parseFloat(newLat.toFixed(6)),
                        parseFloat(newLng.toFixed(6))
                    );
                });

                // ── Drag-end callback ────────────────────────────
                marker.addListener("dragend", () => {
                    const pos = marker.getPosition();
                    if (!pos) return;
                    circle.setCenter(pos);
                    onChangeRef.current(
                        parseFloat(pos.lat().toFixed(6)),
                        parseFloat(pos.lng().toFixed(6))
                    );
                });

                // Auto-fit
                const bounds = new google.maps.LatLngBounds();
                bounds.extend(center);
                const latDelta = radiusRef.current / 111320;
                const lngDelta =
                    radiusRef.current /
                    (111320 * Math.cos((center.lat * Math.PI) / 180));
                bounds.extend({ lat: center.lat + latDelta, lng: center.lng + lngDelta });
                bounds.extend({ lat: center.lat - latDelta, lng: center.lng - lngDelta });
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
            mapInstanceRef.current = null;
            markerRef.current = null;
            circleRef.current = null;
        };
    }, [googleMapsKey]); // eslint-disable-line react-hooks/exhaustive-deps
    // We intentionally only re-init when the API key resolves.
    // After that, position updates are handled by the second useEffect above.

    // ── Render states ───────────────────────────────────────────

    if (googleMapsKey === undefined) {
        return (
            <div className="w-full h-[360px] flex items-center justify-center bg-slate-100 rounded-2xl border border-slate-200">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Loading map…
                    </span>
                </div>
            </div>
        );
    }

    if (!googleMapsKey) {
        return (
            <div className="w-full h-[360px] flex items-center justify-center bg-slate-100 rounded-2xl border border-slate-200">
                <div className="flex flex-col items-center gap-3 max-w-[260px] text-center">
                    <Key className="h-8 w-8 text-amber-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Google Maps API Key Required
                    </span>
                    <span className="text-[9px] text-slate-400 leading-relaxed">
                        Add{" "}
                        <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[8px]">
                            GOOGLE_MAPS_API_KEY
                        </code>{" "}
                        to your backend{" "}
                        <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[8px]">
                            .env
                        </code>{" "}
                        file
                    </span>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="w-full h-[360px] flex items-center justify-center bg-slate-100 rounded-2xl border border-slate-200">
                <div className="flex flex-col items-center gap-3 max-w-[260px] text-center">
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
        <div className="w-full rounded-2xl border border-indigo-100 shadow-sm overflow-hidden relative">
            {/* Google Maps container */}
            <div ref={mapRef} className="w-full h-[360px]" />

            {/* Bottom legend bar */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-md border border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            Drag pin or click map
                        </span>
                    </div>
                    <span className="text-[9px] text-slate-300">|</span>
                    <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/40 border border-emerald-500" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            {radius}m Geo-fence
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <Target className="h-3 w-3 text-indigo-400" />
                    <span className="text-[9px] font-mono font-bold text-slate-600">
                        {latRef.current.toFixed(6)}, {lngRef.current.toFixed(6)}
                    </span>
                </div>
            </div>
        </div>
    );
}
