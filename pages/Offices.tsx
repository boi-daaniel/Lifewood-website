import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

declare global {
    interface Window {
        L: any;
    }
}

type MapPoint = {
    country: string;
    lat: number;
    lng: number;
    flagCode?: string;
};

const mapPoints: MapPoint[] = [
    { country: 'United States', flagCode: 'us', lat: 39.8283, lng: -98.5795 },
    { country: 'Brazil', flagCode: 'br', lat: -14.235, lng: -51.9253 },
    { country: 'United Kingdom', flagCode: 'gb', lat: 54.5, lng: -2.5 },
    { country: 'Germany', flagCode: 'de', lat: 51.1657, lng: 10.4515 },
    { country: 'Finland', flagCode: 'fi', lat: 64.5, lng: 26.0 },
    { country: 'Africa', lat: 2.0, lng: 20.0 },
    { country: 'South Africa', flagCode: 'za', lat: -30.5595, lng: 22.9375 },
    { country: 'Middle East', lat: 29.0, lng: 45.0 },
    { country: 'Madagascar', flagCode: 'mg', lat: -18.7669, lng: 46.8691 },
    { country: 'India', flagCode: 'in', lat: 22.9734, lng: 78.6569 },
    { country: 'Bangladesh', flagCode: 'bd', lat: 23.685, lng: 90.3563 },
    { country: 'China', flagCode: 'cn', lat: 35.8617, lng: 104.1954 },
    { country: 'Thailand', flagCode: 'th', lat: 15.87, lng: 100.9925 },
    { country: 'Malaysia', flagCode: 'my', lat: 4.2105, lng: 101.9758 },
    { country: 'Vietnam', flagCode: 'vn', lat: 14.0583, lng: 108.2772 },
    { country: 'Hong Kong', flagCode: 'hk', lat: 22.3193, lng: 114.1694 },
    { country: 'Philippines', flagCode: 'ph', lat: 12.8797, lng: 121.774 },
    { country: 'Indonesia', flagCode: 'id', lat: -0.7893, lng: 113.9213 },
    { country: 'Australia', flagCode: 'au', lat: -25.2744, lng: 133.7751 }
];

const ensureStyleTag = (id: string, href: string) => {
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
};

const ensureScriptTag = (id: string, src: string) =>
    new Promise<void>((resolve, reject) => {
        const existing = document.getElementById(id) as HTMLScriptElement | null;
        if (existing) {
            if (existing.dataset.loaded === 'true') resolve();
            else existing.addEventListener('load', () => resolve(), { once: true });
            return;
        }
        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.async = true;
        script.onload = () => {
            script.dataset.loaded = 'true';
            resolve();
        };
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
    });

type CountUpProps = {
    end: number;
    suffix?: string;
    durationMs?: number;
    delayMs?: number;
    className?: string;
};

const CountUp: React.FC<CountUpProps> = ({ end, suffix = '', durationMs = 1200, delayMs = 0, className }) => {
    const ref = useRef<HTMLParagraphElement | null>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let frameId = 0;
        let timeoutId: number | null = null;
        let startAt = 0;

        const tick = (now: number) => {
            if (!startAt) startAt = now;
            const progress = Math.min((now - startAt) / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(end * eased));
            if (progress < 1) frameId = requestAnimationFrame(tick);
        };

        const start = () => {
            frameId = requestAnimationFrame(tick);
        };

        if (delayMs > 0) timeoutId = window.setTimeout(start, delayMs);
        else start();

        return () => {
            if (timeoutId !== null) window.clearTimeout(timeoutId);
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [delayMs, durationMs, end, isInView]);

    return (
        <motion.p
            ref={ref}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className={className}
        >
            {new Intl.NumberFormat('en-US').format(value)}
            {suffix}
        </motion.p>
    );
};

export const Offices: React.FC = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const headingWords = useMemo(() => ['Largest', 'Global', 'Data', 'Collection', 'Resources', 'Distribution'], []);
    const defaultCenter: [number, number] = [12, 0];

    useEffect(() => {
        let map: any = null;
        let disposed = false;

        const initMap = async () => {
            ensureStyleTag('leaflet-css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
            ensureStyleTag('leaflet-fullscreen-css', 'https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/leaflet.fullscreen.css');
            await ensureScriptTag('leaflet-js', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
            await ensureScriptTag('leaflet-fullscreen-js', 'https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/Leaflet.fullscreen.min.js');

            if (disposed || !mapRef.current || !window.L) return;
            const L = window.L;
            const worldBounds = L.latLngBounds([[-85, -180], [85, 180]]);
            map = L.map(mapRef.current, {
                zoomControl: true,
                fullscreenControl: true,
                fullscreenControlOptions: { position: 'topright', forcePseudoFullscreen: false },
                worldCopyJump: false,
                maxBounds: worldBounds,
                maxBoundsViscosity: 1,
                zoomSnap: 1,
                zoomDelta: 1,
                fadeAnimation: false
            });
            let minZoomToFillViewport = 0;
            const getPanelFillMinZoom = () => {
                const width = Math.max(1, map.getSize().x);
                return Math.max(0, Math.ceil(Math.log2(width / 256)));
            };
            const updateViewportZoomLimit = (forceRecenter = false) => {
                minZoomToFillViewport = getPanelFillMinZoom();
                map.setMinZoom(minZoomToFillViewport);
                if (forceRecenter || map.getZoom() < minZoomToFillViewport) {
                    map.setView(defaultCenter, minZoomToFillViewport, { animate: false });
                }
            };
            updateViewportZoomLimit(true);

            const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                minZoom: 0,
                noWrap: true,
                bounds: [[-85, -180], [85, 180]],
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
            const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                maxZoom: 17,
                minZoom: 0,
                noWrap: true,
                bounds: [[-85, -180], [85, 180]],
                attribution: '&copy; OpenStreetMap contributors'
            });
            L.control.layers(
                { Streets: osmLayer, Terrain: topoLayer },
                undefined,
                { collapsed: true, position: 'topright' }
            ).addTo(map);
            const resetControl = L.control({ position: 'topleft' });
            resetControl.onAdd = () => {
                const container = L.DomUtil.create('div', 'leaflet-bar');
                const button = L.DomUtil.create('a', 'lifewood-reset-control', container);
                button.href = '#';
                button.title = 'Reset map view';
                button.innerHTML = 'Reset';
                L.DomEvent.disableClickPropagation(container);
                L.DomEvent.on(button, 'click', (e: Event) => {
                    L.DomEvent.preventDefault(e);
                    map.setView(defaultCenter, minZoomToFillViewport, { animate: true });
                });
                return container;
            };
            resetControl.addTo(map);

            const markerIcon = L.divIcon({
                className: 'lifewood-map-marker',
                html: '<span class="pin-head"></span><span class="pin-tail"></span>',
                iconSize: [22, 34],
                iconAnchor: [11, 34],
                popupAnchor: [0, -28]
            });
            let lockedMarker: any = null;

            mapPoints.forEach((point) => {
                const marker = L.marker([point.lat, point.lng], { icon: markerIcon }).addTo(map);
                const leadingVisual = point.flagCode
                    ? `<img class="lifewood-popup-flag" src="https://flagcdn.com/w40/${point.flagCode}.png" alt="${point.country} flag" />`
                    : '<span class="lifewood-popup-region-dot" aria-hidden="true"></span>';
                marker.bindPopup(
                    `<div class="lifewood-popup-row">${leadingVisual}<div class="lifewood-popup-name">${point.country}</div></div>`,
                    {
                        offset: [0, -8],
                        opacity: 1,
                        className: 'lifewood-country-popup',
                        closeButton: true,
                        autoPan: false,
                        closeOnClick: false
                    }
                );
                marker.off('click', marker.openPopup, marker);
                marker.on('click', () => {
                    if (lockedMarker && lockedMarker !== marker) {
                        lockedMarker.closePopup();
                    }
                    lockedMarker = marker;
                    marker.openPopup();
                });
                marker.on('mouseover', () => {
                    if (lockedMarker && lockedMarker !== marker) return;
                    marker.openPopup();
                });
                marker.on('mouseout', () => {
                    if (lockedMarker === marker) return;
                    marker.closePopup();
                });
                marker.on('popupclose', () => {
                    if (lockedMarker === marker) {
                        lockedMarker = null;
                    }
                });
            });

            setTimeout(() => {
                map?.invalidateSize();
                if (map) updateViewportZoomLimit(true);
            }, 180);
            map.on('resize', () => updateViewportZoomLimit());
            map.on('fullscreenchange', () => {
                setTimeout(() => {
                    map?.invalidateSize();
                    if (map) updateViewportZoomLimit(true);
                }, 100);
            });
            map.on('enterFullscreen', () => {
                setTimeout(() => {
                    map?.invalidateSize();
                    if (map) updateViewportZoomLimit(true);
                }, 100);
            });
            map.on('exitFullscreen', () => {
                setTimeout(() => {
                    map?.invalidateSize();
                    if (map) updateViewportZoomLimit(true);
                }, 100);
            });
        };

        initMap();

        return () => {
            disposed = true;
            if (map) map.remove();
        };
    }, []);

    return (
        <div className="bg-[#f3f3f3] dark:bg-brand-green min-h-screen pt-22 md:pt-32 pb-20 scroll-smooth transition-colors duration-300 dark:[&_h1]:text-white dark:[&_h2]:text-white dark:[&_h3]:text-white dark:[&_h4]:text-white dark:[&_p]:text-gray-200 dark:[&_blockquote]:text-gray-100">
            <style>{`
                .lifewood-map-marker {
                    background: transparent;
                    border: 0;
                    width: 22px !important;
                    height: 34px !important;
                    position: relative;
                }
                .lifewood-map-marker .pin-head {
                    display: block;
                    width: 18px;
                    height: 18px;
                    border-radius: 9999px;
                    background: #f07f22;
                    box-shadow: 0 8px 16px rgba(240, 127, 34, 0.45);
                    position: absolute;
                    top: 0;
                    left: 2px;
                }
                .lifewood-map-marker .pin-tail {
                    display: block;
                    position: absolute;
                    left: 50%;
                    bottom: 0;
                    width: 2px;
                    height: 14px;
                    transform: translateX(-50%);
                    background: #f07f22;
                    border-radius: 2px;
                }
                .offices-map .leaflet-pane,
                .offices-map .leaflet-control,
                .offices-map .leaflet-top,
                .offices-map .leaflet-bottom {
                    z-index: 10 !important;
                }
                .offices-map .leaflet-container {
                    z-index: 1 !important;
                    background: #9fcfdf;
                }
                .offices-map .leaflet-container.leaflet-fullscreen-on,
                .offices-map .leaflet-container:fullscreen,
                .offices-map .leaflet-container:-webkit-full-screen {
                    width: 100vw !important;
                    height: 100vh !important;
                    border-radius: 0 !important;
                    z-index: 9999 !important;
                }
                .offices-map .leaflet-tile {
                    border: 0 !important;
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                }
                .lifewood-country-popup .leaflet-popup-content-wrapper {
                    background: #ffffff;
                    color: #1f2937;
                    border-radius: 12px;
                    border: 1px solid #e9edf2;
                    box-shadow: 0 8px 18px rgba(16, 24, 40, 0.16);
                    padding: 0;
                }
                .lifewood-country-popup .leaflet-popup-content {
                    margin: 0;
                    padding: 10px 30px 10px 14px;
                    width: max-content;
                    white-space: nowrap;
                    max-width: none !important;
                }
                .lifewood-country-popup .leaflet-popup-tip {
                    background: #ffffff;
                    box-shadow: none;
                }
                .lifewood-country-popup .leaflet-popup-close-button {
                    color: #8d97a5;
                    font-size: 16px;
                    line-height: 1;
                    padding: 8px 8px 0 0;
                }
                .lifewood-country-popup .leaflet-popup-close-button:hover {
                    color: #5f6a78;
                }
                .lifewood-popup-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    white-space: nowrap;
                    width: max-content;
                    min-height: 30px;
                }
                .lifewood-popup-name {
                    display: block;
                    white-space: nowrap;
                    line-height: 1.2;
                    font-weight: 600;
                    flex: 0 0 auto;
                    font-size: 15px;
                    letter-spacing: 0.1px;
                    color: #2a3441;
                }
                .lifewood-popup-flag {
                    width: 30px;
                    height: 20px;
                    border-radius: 4px;
                    object-fit: cover;
                    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.14);
                }
                .lifewood-popup-region-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 9999px;
                    background: #f07f22;
                    box-shadow: 0 0 0 4px rgba(240, 127, 34, 0.2);
                    display: inline-block;
                }
                .offices-map .lifewood-reset-control {
                    width: auto;
                    min-width: 54px;
                    text-align: center;
                    padding: 0 10px;
                    font-weight: 700;
                    font-size: 12px;
                    color: #0d3a2a;
                    background: #ffffff;
                    text-decoration: none;
                }
            `}</style>
            <section className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    <div className="lg:col-span-4">
                        <h1 className="text-4xl md:text-7xl font-semibold leading-[0.95] text-[#0d3a2a] max-w-5xl">
                            {headingWords.map((word, idx) => (
                                <motion.span
                                    key={word}
                                    initial={{ opacity: 0, y: 26 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.45, delay: idx * 0.06 }}
                                    whileHover={{ y: -6, scale: 1.03, color: '#0a2f22' }}
                                    className="inline-block mr-4 transition-colors duration-200 cursor-default"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h1>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6 mt-10" id="office-map">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    <div className="offices-map xl:col-span-3 bg-[#9fcfdf] rounded-3xl overflow-hidden relative min-h-[320px] sm:min-h-[420px] md:min-h-[560px]">
                        <div ref={mapRef} className="absolute inset-0" />
                    </div>

                    <div className="relative flex flex-col items-center xl:items-stretch">
                        <div className="hidden xl:flex flex-col items-center absolute -top-44 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                className="relative w-40 h-40"
                            >
                                <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full">
                                    <defs>
                                        <path
                                            id="be-amazed-circle"
                                            d="M 60,60 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                                        />
                                    </defs>
                                    <text fill="#0d3a2a" fontSize="10.5" fontWeight="800" letterSpacing="0.55">
                                        <textPath href="#be-amazed-circle" startOffset="0%">
                                            be • amazed • be • amazed • be • amazed •
                                        </textPath>
                                    </text>
                                </svg>
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#f9e5bd] flex items-center justify-center">
                                    <div className="w-3.5 h-3.5 rounded-full bg-white" />
                                </div>
                            </motion.div>
                            <div className="h-8 w-px bg-gradient-to-b from-[#f2b142]/40 to-transparent -mt-4 mb-0.5" />
                            <p className="text-3xl text-[#f2b142] leading-none">↓</p>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.1 }}
                            className="w-full bg-[#f2b142] rounded-3xl p-6 md:p-10 flex flex-col justify-center min-h-[320px] sm:min-h-[420px] md:min-h-[560px]"
                            id="office-stats"
                        >
                        <div>
                            <CountUp end={56788} className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0d3a2a]" />
                            <p className="text-2xl sm:text-3xl md:text-4xl mt-2 text-[#0d3a2a]">Online Resources</p>
                        </div>
                        <div className="h-px bg-white/70 my-6 md:my-10" />
                        <div>
                            <CountUp end={30} suffix="+" delayMs={100} className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0d3a2a]" />
                            <p className="text-2xl sm:text-3xl md:text-4xl mt-2 text-[#0d3a2a]">Countries</p>
                        </div>
                        <div className="h-px bg-white/70 my-6 md:my-10" />
                        <div>
                            <CountUp end={40} suffix="+" delayMs={200} className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0d3a2a]" />
                            <p className="text-2xl sm:text-3xl md:text-4xl mt-2 text-[#0d3a2a]">Centers</p>
                        </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};
