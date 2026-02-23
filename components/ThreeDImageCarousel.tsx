import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface ThreeDCarouselImage {
    src: string;
    alt: string;
}

interface ThreeDImageCarouselProps {
    images: ThreeDCarouselImage[];
    className?: string;
    autoRotateMs?: number;
    centerOverlay?: React.ReactNode;
    centerOverlayClassName?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const ThreeDImageCarousel: React.FC<ThreeDImageCarouselProps> = ({
    images,
    className = '',
    autoRotateMs = 7000,
    centerOverlay,
    centerOverlayClassName = ''
}) => {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const dragSpeedRef = useRef(0.35);
    const animationRef = useRef<number | null>(null);
    const lastFrameRef = useRef<number>(0);
    const draggingRef = useRef<{
        pointerId: number | null;
        startX: number;
        prevX: number;
        hasDragged: boolean;
    }>({
        pointerId: null,
        startX: 0,
        prevX: 0,
        hasDragged: false
    });

    const [rotationDeg, setRotationDeg] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [stageWidth, setStageWidth] = useState(960);

    useEffect(() => {
        const node = stageRef.current;
        if (!node) return;

        const updateWidth = () => setStageWidth(node.clientWidth || 960);
        updateWidth();

        const observer = new ResizeObserver(updateWidth);
        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!images.length) return;
        const oneTurnMs = Math.max(autoRotateMs, 1200);
        const degPerMs = 360 / oneTurnMs;

        const tick = (time: number) => {
            const last = lastFrameRef.current || time;
            const dt = Math.min(40, time - last);
            lastFrameRef.current = time;

            if (!isDragging) {
                setRotationDeg((prev) => prev + degPerMs * dt);
            }

            animationRef.current = window.requestAnimationFrame(tick);
        };

        animationRef.current = window.requestAnimationFrame(tick);
        return () => {
            if (animationRef.current !== null) {
                window.cancelAnimationFrame(animationRef.current);
            }
            animationRef.current = null;
            lastFrameRef.current = 0;
        };
    }, [images.length, isDragging, autoRotateMs]);

    const completeDrag = () => {
        setIsDragging(false);
        draggingRef.current.pointerId = null;
        draggingRef.current.startX = 0;
        draggingRef.current.prevX = 0;
        setTimeout(() => {
            draggingRef.current.hasDragged = false;
        }, 0);
    };

    const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
        if (!images.length) return;
        draggingRef.current.pointerId = event.pointerId;
        draggingRef.current.startX = event.clientX;
        draggingRef.current.prevX = event.clientX;
        draggingRef.current.hasDragged = false;
        setIsDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
        if (draggingRef.current.pointerId !== event.pointerId) return;
        const overallDelta = event.clientX - draggingRef.current.startX;
        const frameDelta = event.clientX - draggingRef.current.prevX;
        draggingRef.current.prevX = event.clientX;
        if (Math.abs(overallDelta) > 6) draggingRef.current.hasDragged = true;
        setRotationDeg((prev) => prev + frameDelta * dragSpeedRef.current);
    };

    const handlePointerUp: React.PointerEventHandler<HTMLDivElement> = (event) => {
        if (draggingRef.current.pointerId !== event.pointerId) return;
        event.currentTarget.releasePointerCapture(event.pointerId);
        completeDrag();
    };

    const handlePointerCancel: React.PointerEventHandler<HTMLDivElement> = () => {
        if (draggingRef.current.pointerId === null) return;
        completeDrag();
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            setRotationDeg((prev) => prev - 22);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            setRotationDeg((prev) => prev + 22);
        }
    };

    const cardWidth = clamp(stageWidth * 0.24, 130, 280);
    const cardHeight = cardWidth * 1.32;
    const radius = clamp(stageWidth * 0.24, 160, 320);
    const angleStep = images.length ? 360 / images.length : 0;
    const orbitTilt = -7;

    const cardStates = useMemo(
        () =>
            images.map((image, idx) => {
                const angle = rotationDeg + idx * angleStep;
                const radians = (angle * Math.PI) / 180;
                const z = Math.cos(radians) * radius;
                const depthWeight = (z / radius + 1) / 2;
                const opacity = 0.1 + depthWeight * 0.9;
                const scale = 0.86 + depthWeight * 0.18;
                const zIndex = Math.floor(100 + depthWeight * 100);
                const blurPx = (1 - depthWeight) * 1.4;

                return {
                    image,
                    idx,
                    opacity,
                    scale,
                    zIndex,
                    blurPx,
                    transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px) scale(${scale})`
                };
            }),
        [images, rotationDeg, angleStep, radius]
    );

    return (
        <div className={`w-full ${className}`}>
            <div
                ref={stageRef}
                className={`relative mx-auto w-full max-w-[1180px] h-[310px] sm:h-[400px] md:h-[500px] [perspective:1600px] ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                role="region"
                aria-label="3D image carousel"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                style={{ touchAction: 'pan-y' }}
            >
                <div className="absolute left-1/2 top-1/2 h-[180px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dbe5de] blur-3xl opacity-70 pointer-events-none" />
                <div className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform: `rotateX(${orbitTilt}deg)` }}>
                    {centerOverlay ? (
                        <div
                            className={`pointer-events-none absolute left-1/2 top-1/2 ${centerOverlayClassName}`}
                            style={{
                                transform: 'translate(-50%, -50%) translate3d(0, 48px, 0) rotateX(7deg)',
                                zIndex: 130
                            }}
                        >
                            {centerOverlay}
                        </div>
                    ) : null}
                    {cardStates.map((card) => (
                        <div
                            key={`${card.image.src}-${card.idx}`}
                            className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
                            style={
                                {
                                    width: `${cardWidth}px`,
                                    height: `${cardHeight}px`,
                                    transform: card.transform,
                                    opacity: card.opacity,
                                    zIndex: card.zIndex,
                                    pointerEvents: card.opacity > 0.2 ? 'auto' : 'none',
                                    transition: isDragging
                                        ? 'none'
                                        : 'transform 360ms ease, opacity 260ms ease',
                                    filter: `drop-shadow(0 20px 22px rgba(20, 30, 28, 0.24)) blur(${card.blurPx}px)`
                                } as React.CSSProperties
                            }
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    if (draggingRef.current.hasDragged) return;
                                    setRotationDeg(-card.idx * angleStep);
                                }}
                                className="block h-full w-full overflow-hidden rounded-[24px] border border-white/35 bg-white/70 backdrop-blur-[1px]"
                                aria-label={card.image.alt}
                            >
                                <img
                                    src={card.image.src}
                                    alt={card.image.alt}
                                    draggable={false}
                                    className="h-full w-full select-none object-cover pointer-events-none"
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
