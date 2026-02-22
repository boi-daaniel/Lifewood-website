import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface ThreeDCarouselImage {
    src: string;
    alt: string;
}

interface ThreeDImageCarouselProps {
    images: ThreeDCarouselImage[];
    className?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const normalizeIndexDiff = (index: number, centerIndex: number, total: number) => {
    let diff = index - centerIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
};

export const ThreeDImageCarousel: React.FC<ThreeDImageCarouselProps> = ({ images, className = '' }) => {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const draggingRef = useRef<{
        pointerId: number | null;
        startX: number;
        deltaX: number;
        hasDragged: boolean;
    }>({
        pointerId: null,
        startX: 0,
        deltaX: 0,
        hasDragged: false
    });

    const [centerIndex, setCenterIndex] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
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

    const cardWidth = clamp(stageWidth * 0.46, 180, 560);
    const cardHeight = cardWidth * 0.72;
    const spacing = clamp(stageWidth * 0.17, 88, 220);
    const swipeThreshold = clamp(stageWidth * 0.08, 35, 80);

    const shiftCenter = (delta: number) => {
        if (!images.length) return;
        setCenterIndex((prev) => (prev + delta + images.length) % images.length);
    };

    const completeDrag = () => {
        const delta = draggingRef.current.deltaX;
        const abs = Math.abs(delta);

        if (abs > swipeThreshold) {
            const step = abs > spacing * 1.25 ? 2 : 1;
            shiftCenter(delta < 0 ? step : -step);
        }

        setDragOffset(0);
        setIsDragging(false);
        draggingRef.current.pointerId = null;
        draggingRef.current.startX = 0;
        draggingRef.current.deltaX = 0;
        setTimeout(() => {
            draggingRef.current.hasDragged = false;
        }, 0);
    };

    const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
        if (!images.length) return;
        draggingRef.current.pointerId = event.pointerId;
        draggingRef.current.startX = event.clientX;
        draggingRef.current.deltaX = 0;
        draggingRef.current.hasDragged = false;
        setIsDragging(true);
        setDragOffset(0);
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
        if (draggingRef.current.pointerId !== event.pointerId) return;
        const delta = event.clientX - draggingRef.current.startX;
        draggingRef.current.deltaX = delta;
        if (Math.abs(delta) > 6) draggingRef.current.hasDragged = true;
        setDragOffset(delta);
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
            shiftCenter(-1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            shiftCenter(1);
        }
    };

    const cardStates = useMemo(
        () =>
            images.map((image, idx) => {
                const diff = normalizeIndexDiff(idx, centerIndex, images.length);
                const abs = Math.abs(diff);
                const visible = abs <= 3;
                const dragInfluence = clamp(dragOffset * 0.45, -140, 140);
                const x = diff * spacing + dragInfluence;
                const rotateY = -diff * 20;
                const z = diff === 0 ? 145 : Math.max(-210, 95 - abs * 95);
                const scale = diff === 0 ? 1 : Math.max(0.7, 1 - abs * 0.12);
                const opacity = visible ? 1 - Math.max(0, abs - 1) * 0.22 : 0;
                const isCenter = diff === 0;
                const zIndex = 400 - abs * 40;

                return {
                    image,
                    idx,
                    diff,
                    isCenter,
                    visible,
                    opacity,
                    zIndex,
                    transform: `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${rotateY}deg) scale(${scale})`
                };
            }),
        [images, centerIndex, spacing, dragOffset]
    );

    return (
        <div className={`w-full ${className}`}>
            <div
                ref={stageRef}
                className="relative mx-auto w-full max-w-[1180px] h-[280px] sm:h-[360px] md:h-[460px] [perspective:1800px]"
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
                <div className="absolute inset-0 [transform-style:preserve-3d]">
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
                                    pointerEvents: card.visible ? 'auto' : 'none',
                                    transition: isDragging
                                        ? 'none'
                                        : 'transform 560ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease, filter 260ms ease',
                                    filter: card.isCenter ? 'none' : 'saturate(0.86) brightness(0.9)'
                                } as React.CSSProperties
                            }
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    if (draggingRef.current.hasDragged || card.isCenter) return;
                                    setCenterIndex(card.idx);
                                }}
                                className="block h-full w-full overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-[0_22px_44px_-26px_rgba(15,23,42,0.55)]"
                                aria-label={card.isCenter ? card.image.alt : `Focus ${card.image.alt}`}
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
