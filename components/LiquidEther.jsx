import { useEffect, useMemo, useRef } from 'react';
import './LiquidEther.css';

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export default function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = true,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
  style = {},
  className = '',
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 3000,
  autoRampDuration = 0.6,
  color0,
  color1,
  color2
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const resizeObserverRef = useRef(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, px: 0.5, py: 0.5, active: false, lastMove: 0 });
  const timeRef = useRef(0);

  void iterationsViscous;
  void iterationsPoisson;
  void dt;
  void BFECC;
  void isBounce;
  void takeoverDuration;
  void autoRampDuration;

  const palette = useMemo(() => {
    const fromSingle = [color0, color1, color2].filter(Boolean);
    if (fromSingle.length) return fromSingle;
    return colors.length ? colors : ['#5227FF', '#FF9FFC', '#B19EEF'];
  }, [colors, color0, color1, color2]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 1;
    let height = 1;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particleCount = clamp(Math.round(42 * clamp(resolution, 0.3, 1)), 20, 64);
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.002,
      vy: (Math.random() - 0.5) * 0.002,
      r: 0.012 + Math.random() * 0.028,
      color: palette[i % palette.length]
    }));

    const onPointerMove = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = (clientX - rect.left) / rect.width;
      const ny = (clientY - rect.top) / rect.height;
      pointerRef.current.x = clamp(nx, 0, 1);
      pointerRef.current.y = clamp(ny, 0, 1);
      pointerRef.current.active = true;
      pointerRef.current.lastMove = performance.now();
    };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;
      onPointerMove(e.clientX, e.clientY);
    };
    const handleTouchMove = (e) => {
      if (!e.touches.length) return;
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleLeave = () => {
      pointerRef.current.active = false;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    resizeObserverRef.current = new ResizeObserver(resize);
    resizeObserverRef.current.observe(container);

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('mouseleave', handleLeave);
    container.addEventListener('touchend', handleLeave);

    const animate = () => {
      timeRef.current += 0.016;
      const now = performance.now();
      const p = pointerRef.current;

      if (autoDemo && (!p.active || now - p.lastMove > autoResumeDelay)) {
        const t = timeRef.current * autoSpeed;
        p.x = 0.5 + Math.cos(t * 0.9) * 0.24;
        p.y = 0.5 + Math.sin(t * 1.3) * 0.22;
      }

      const dx = p.x - p.px;
      const dy = p.y - p.py;
      p.px = p.x;
      p.py = p.y;
      const flow = Math.hypot(dx, dy) * (mouseForce / 12) * autoIntensity;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, width, height);

      const damping = isViscous ? 1 - clamp(viscous / 600, 0.02, 0.2) : 0.985;
      const cursorNorm = clamp(cursorSize / Math.max(width, 1), 0.08, 0.35);
      const pullRadius = cursorNorm * 1.4;

      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        const rx = p.x - pt.x;
        const ry = p.y - pt.y;
        const dist = Math.max(0.0001, Math.hypot(rx, ry));
        if (dist < pullRadius) {
          const power = (1 - dist / pullRadius) * 0.0018 * mouseForce * (0.5 + flow);
          pt.vx += (rx / dist) * power;
          pt.vy += (ry / dist) * power;
        }

        pt.vx *= damping;
        pt.vy *= damping;
        pt.x += pt.vx;
        pt.y += pt.vy;

        if (pt.x < -0.08) pt.x = 1.08;
        if (pt.x > 1.08) pt.x = -0.08;
        if (pt.y < -0.08) pt.y = 1.08;
        if (pt.y > 1.08) pt.y = -0.08;
      }

      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        const x = pt.x * width;
        const y = pt.y * height;
        const radius = (pt.r + flow * 0.004) * Math.min(width, height) * 2.6;
        const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
        g.addColorStop(0, `${pt.color}dd`);
        g.addColorStop(0.55, `${pt.color}66`);
        g.addColorStop(1, `${pt.color}00`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('mouseleave', handleLeave);
      container.removeEventListener('touchend', handleLeave);
    };
  }, [
    autoDemo,
    autoIntensity,
    autoResumeDelay,
    autoSpeed,
    cursorSize,
    isViscous,
    mouseForce,
    palette,
    resolution,
    viscous
  ]);

  return (
    <div ref={containerRef} className={`liquid-ether-container ${className}`} style={style}>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
