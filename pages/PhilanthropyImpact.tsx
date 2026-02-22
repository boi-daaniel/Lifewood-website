import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack';
import Aurora from '../components/Aurora';
import ScrollFloat from '../components/ScrollFloat';
import { ContactUsButton } from '../components/ContactUsButton';
import './ElegantTextEffects.css';

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

type ImpactItem = {
    title: string;
    description: string;
    image: string;
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

const impactItems: ImpactItem[] = [
    {
        title: 'Partnership',
        description:
            'Through purposeful partnerships and sustainable investment, we empower communities across Africa and the Indian sub-continent to create lasting economic and social transformation.',
        image: 'https://framerusercontent.com/images/ifVOmevTJG4uimv3rRPBuoDvYM.jpg?scale-down-to=1024&width=5245&height=7867'
    },
    {
        title: 'Application',
        description:
            'We deploy practical programs in education and workforce development so local communities can scale access to opportunity and build resilient, future-ready capabilities.',
        image: 'https://framerusercontent.com/images/UZnPJgTru2Os9pqnz20ckvASCI8.jpg?scale-down-to=1024&width=4160&height=6240'
    },
    {
        title: 'Expanding',
        description:
            'Our teams continue to expand impact networks through local collaboration, transparent delivery, and long-term support that keeps communities moving forward.',
        image: 'https://framerusercontent.com/images/8USU1OFCcARiIIvcdJBJlzA8EA4.jpg?scale-down-to=512&width=5184&height=3456'
    }
];

const heroRevealContainer = {
    hidden: {},
    show: {
        transition: {
            delayChildren: 0.08,
            staggerChildren: 0.12
        }
    }
};

const heroRevealItem = {
    hidden: { opacity: 0, y: 22, filter: 'blur(8px)' },
    show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
    }
};

const heroRevealCta = {
    hidden: { opacity: 0, y: 18, scale: 0.98, filter: 'blur(6px)' },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }
    }
};

const FadeImageSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    });

    const fade = useTransform(scrollYProgress, [0.2, 0.75], [1, 0.05]);
    const zoom = useTransform(scrollYProgress, [0.2, 0.75], [1, 1.05]);
    const rise = useTransform(scrollYProgress, [0.2, 0.75], [0, -30]);

    const imageUrl = 'https://framerusercontent.com/images/7RZ9ESz7UTTmxn6ifh8I9jHlHA.png?width=1004&height=591';

    return (
        <section ref={sectionRef} className="relative mt-10 h-[115vh] md:h-[150vh]">
            <div className="sticky top-16 md:top-20 h-[58vh] md:h-[75vh] flex items-center justify-center">
                <motion.img
                    src={imageUrl}
                    alt="People helping each other"
                    style={{ opacity: fade, scale: zoom, y: rise }}
                    className="w-full max-h-full object-contain object-center rounded-[1.75rem]"
                />
            </div>
        </section>
    );
};

const ImpactScrollStack: React.FC = () => (
    <ScrollStack
        className="mt-10"
        useWindowScroll
        itemDistance={24}
        itemStackDistance={30}
        stackPosition="16%"
        scaleEndPosition="8%"
        baseScale={0.94}
        itemScale={0.03}
    >
        {impactItems.map((item, idx) => (
            <ScrollStackItem key={item.title} itemClassName="!h-auto !p-0 !rounded-3xl !shadow-none !bg-[#f3f3f3]">
                <article className="border border-gray-200 rounded-3xl bg-[#f3f3f3] px-6 md:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[180px_minmax(0,1fr)_320px] gap-7 lg:gap-10 items-center">
                        <h3 className="text-3xl md:text-4xl text-gray-700 font-medium">{item.title}</h3>
                        <p className="text-lg md:text-xl leading-relaxed text-gray-700">
                            {item.description}
                        </p>
                        <div className="overflow-hidden rounded-2xl shadow-[0_14px_40px_rgba(15,23,42,0.16)]">
                            <img
                                src={item.image}
                                alt={`${item.title} impact`}
                                className={`w-full h-52 md:h-56 object-cover transition-transform duration-500 ${
                                    idx % 2 === 0 ? 'hover:scale-[1.03]' : 'hover:scale-[1.05]'
                                }`}
                            />
                        </div>
                    </div>
                </article>
            </ScrollStackItem>
        ))}
    </ScrollStack>
);

const ImpactMap: React.FC = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);
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
            L.control.layers({ Streets: osmLayer, Terrain: topoLayer }, undefined, { collapsed: true, position: 'topright' }).addTo(map);

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
                    if (lockedMarker && lockedMarker !== marker) lockedMarker.closePopup();
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
                    if (lockedMarker === marker) lockedMarker = null;
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
        };

        initMap();

        return () => {
            disposed = true;
            if (map) map.remove();
        };
    }, []);

    return (
        <>
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
                .impact-map .leaflet-pane,
                .impact-map .leaflet-control,
                .impact-map .leaflet-top,
                .impact-map .leaflet-bottom {
                    z-index: 10 !important;
                }
                .impact-map .leaflet-container {
                    z-index: 1 !important;
                    background: #9fcfdf;
                }
                .impact-map .leaflet-container.leaflet-fullscreen-on,
                .impact-map .leaflet-container:fullscreen,
                .impact-map .leaflet-container:-webkit-full-screen {
                    width: 100vw !important;
                    height: 100vh !important;
                    border-radius: 0 !important;
                    z-index: 9999 !important;
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
            `}</style>
            <div className="impact-map bg-[#9fcfdf] rounded-3xl overflow-hidden relative min-h-[360px] md:min-h-[520px]">
                <div ref={mapRef} className="absolute inset-0" />
            </div>
        </>
    );
};

export const PhilanthropyImpact: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="elegant-textfx relative overflow-hidden bg-[#f3f3f3] dark:bg-brand-green min-h-screen pt-20 md:pt-24 pb-24 transition-colors duration-300 dark:[&_h1]:text-white dark:[&_h2]:text-white dark:[&_h3]:text-white dark:[&_h4]:text-white dark:[&_p]:text-gray-200 dark:[&_blockquote]:text-gray-100"
        >
            <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
                <div className="h-full w-full" style={{ maskImage: 'linear-gradient(180deg, #000 0%, #000 70%, transparent 100%)' }}>
                    <Aurora
                        colorStops={['#7cff67', '#B19EEF', '#ffb347']}
                        blend={0.5}
                        amplitude={1.0}
                        speed={1}
                    />
                </div>
            </div>

            <div className="relative z-10">
            <section className="container mx-auto px-6 min-h-[280px] md:min-h-[340px]">
                <motion.div
                    className="relative z-10 pointer-events-none"
                    variants={heroRevealContainer}
                    initial="hidden"
                    animate="show"
                >
                    <motion.h1 variants={heroRevealItem} className="text-4xl sm:text-5xl md:text-6xl font-semibold text-black">
                        Philanthropy and Impact
                    </motion.h1>
                    <motion.p variants={heroRevealItem} className="mt-6 text-lg md:text-xl leading-relaxed text-gray-700 max-w-4xl">
                        We direct resources into education and development projects that create lasting change. Our approach goes
                        beyond giving: it builds sustainable growth and empowers communities for the future.
                    </motion.p>
                    <motion.div variants={heroRevealCta} className="mt-7 pointer-events-auto">
                        <ContactUsButton />
                    </motion.div>
                </motion.div>
            </section>

            <FadeImageSection />

            <section className="container mx-auto px-6 mt-12">
                <ScrollFloat
                    animationDuration={1}
                    ease="back.inOut(2)"
                    scrollStart="center bottom+=50%"
                    scrollEnd="bottom bottom-=40%"
                    stagger={0.02}
                    containerClassName="text-left"
                    textClassName="!text-xl md:!text-[28px] !font-medium !leading-[1.3] !text-gray-700 !text-left"
                >
                    {'Our vision is of a world where financial investment plays a central role in solving the social and environmental challenges facing the global community, specifically in Africa and the Indian sub-continent.'}
                </ScrollFloat>
            </section>

            <section className="container mx-auto px-6 mt-14">
                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_240px] gap-6 items-end">
                    <ScrollFloat
                        animationDuration={1}
                        ease="back.inOut(2)"
                        scrollStart="center bottom+=50%"
                        scrollEnd="bottom bottom-=40%"
                        stagger={0.03}
                        containerClassName="text-left"
                        textClassName="!text-3xl sm:!text-4xl md:!text-6xl !font-semibold !leading-[0.95] !text-[#0d3a2a] !text-left"
                    >
                        {'Transforming Communities Worldwide'}
                    </ScrollFloat>

                    <div className="hidden xl:flex flex-col items-center justify-end">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="relative w-40 h-40"
                        >
                            <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full">
                                <defs>
                                    <path
                                        id="be-amazed-circle-impact"
                                        d="M 60,60 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                                    />
                                </defs>
                                <text fill="#0d3a2a" fontSize="10.5" fontWeight="800" letterSpacing="0.55">
                                    <textPath href="#be-amazed-circle-impact" startOffset="0%">
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
                </div>
            </section>

            <section className="container mx-auto px-6 mt-6">
                <ImpactMap />
            </section>

            <section className="container mx-auto px-6 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-[180px_minmax(0,1fr)] gap-6 md:gap-8 items-start">
                    <div className="flex items-center gap-2 text-gray-700 text-lg md:text-3xl pt-1">
                        <span className="inline-block w-10 h-px bg-gray-500" />
                        <ScrollFloat
                            animationDuration={1}
                            ease="back.inOut(2)"
                            scrollStart="center bottom+=50%"
                            scrollEnd="bottom bottom-=40%"
                            stagger={0.04}
                            containerClassName="text-left"
                            textClassName="!text-gray-700 !text-lg md:!text-3xl !font-medium !leading-none !text-left"
                        >
                            {'Impact'}
                        </ScrollFloat>
                    </div>
                    <div className="flex justify-center lg:justify-end">
                        <ScrollFloat
                            animationDuration={1}
                            ease="back.inOut(2)"
                            scrollStart="center bottom+=50%"
                            scrollEnd="bottom bottom-=40%"
                            stagger={0.015}
                            containerClassName="text-center max-w-3xl"
                            textClassName="!text-xl md:!text-2xl !font-normal !leading-snug !text-gray-800 !text-center"
                        >
                            {'Through purposeful partnerships and sustainable investment, we empower communities across Africa and the Indian sub-continent to create lasting economic and social transformation.'}
                        </ScrollFloat>
                    </div>
                </div>

                <ImpactScrollStack />
            </section>

            <section className="container mx-auto px-6 mt-16 text-center">
                <ScrollFloat
                    animationDuration={1}
                    ease="back.inOut(2)"
                    scrollStart="center bottom+=50%"
                    scrollEnd="bottom bottom-=40%"
                    stagger={0.03}
                    containerClassName="text-center"
                    textClassName="!text-3xl md:!text-5xl !font-medium !leading-tight !text-gray-800 !text-center"
                >
                    {'Working with new intelligence for a better world.'}
                </ScrollFloat>
            </section>
            </div>
        </motion.div>
    );
};
