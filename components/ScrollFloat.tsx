import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

type ScrollFloatProps = {
    children: ReactNode;
    scrollContainerRef?: RefObject<HTMLElement | null>;
    containerClassName?: string;
    textClassName?: string;
    animationDuration?: number;
    ease?: string;
    scrollStart?: string;
    scrollEnd?: string;
    stagger?: number;
};

const ScrollFloat: React.FC<ScrollFloatProps> = ({
    children,
    scrollContainerRef,
    containerClassName = '',
    textClassName = '',
    animationDuration = 1,
    ease = 'back.inOut(2)',
    scrollStart = 'center bottom+=50%',
    scrollEnd = 'bottom bottom-=40%',
    stagger = 0.03
}) => {
    const containerRef = useRef<HTMLHeadingElement | null>(null);

    const splitText = useMemo(() => {
        const text = typeof children === 'string' ? children : '';
        return text.split('').map((char, index) => (
            <span className="char" key={index}>
                {char === ' ' ? '\u00A0' : char}
            </span>
        ));
    }, [children]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const scroller = scrollContainerRef?.current ?? window;
        const charElements = el.querySelectorAll('.char');

        const ctx = gsap.context(() => {
            gsap.fromTo(
                charElements,
                {
                    willChange: 'opacity, transform',
                    opacity: 0,
                    yPercent: 120,
                    scaleY: 2.3,
                    scaleX: 0.7,
                    transformOrigin: '50% 0%'
                },
                {
                    duration: animationDuration,
                    ease,
                    opacity: 1,
                    yPercent: 0,
                    scaleY: 1,
                    scaleX: 1,
                    stagger,
                    scrollTrigger: {
                        trigger: el,
                        scroller: scroller === window ? undefined : scroller,
                        start: scrollStart,
                        end: scrollEnd,
                        scrub: true
                    }
                }
            );
        }, el);

        return () => {
            ctx.revert();
        };
    }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

    return (
        <h2 ref={containerRef} className={`scroll-float ${containerClassName}`.trim()}>
            <span className={`scroll-float-text ${textClassName}`.trim()}>
                {typeof children === 'string' ? splitText : children}
            </span>
        </h2>
    );
};

export default ScrollFloat;
