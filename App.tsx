import React, { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { GlobalReach } from './components/GlobalReach';
import { Clients } from './components/Clients';
import { Innovation } from './components/Innovation';
import { Services } from './components/Services';
import { Footer } from './components/Footer';
import { AIServices } from './pages/AIServices';
import { AIProjects } from './pages/AIProjects';
import { AboutUs } from './pages/AboutUs';
import { Offices } from './pages/Offices';
import { WhatWeOfferTypeA, WhatWeOfferTypeB, WhatWeOfferTypeC } from './pages/WhatWeOfferTypes';
import { WhatWeOfferTypeD } from './pages/WhatWeOfferTypeD';
import { PhilanthropyImpact } from './pages/PhilanthropyImpact';
import { Careers } from './pages/Careers';
import { ContactUs } from './pages/ContactUs';
import { InternalNews } from './pages/InternalNews';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { SupportChatbot } from './components/SupportChatbot';
import GradualBlur from './components/GradualBlur';

let lenisInstance: Lenis | null = null;

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    lenisInstance?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

function GlobalSmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const originalScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.08,
      touchMultiplier: 1.2
    });
    lenisInstance = lenis;

    let frameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };
    frameId = requestAnimationFrame(raf);

    const onResize = () => {
      lenis.resize();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (frameId) cancelAnimationFrame(frameId);
      lenis.destroy();
      if (lenisInstance === lenis) lenisInstance = null;
      root.style.scrollBehavior = originalScrollBehavior;
    };
  }, []);

  return null;
}

function HomePage() {
  return (
    <div className="min-h-screen font-sans text-gray-900 dark:text-white selection:bg-brand-gold selection:text-white transition-colors duration-300">
      <main>
        <Hero />
        <About />
        <GlobalReach />
        <Clients />
        <Innovation />
        <Services />
      </main>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -18 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/ai-services" element={<AIServices />} />
          <Route path="/ai-projects" element={<AIProjects />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/offices" element={<Offices />} />
          <Route path="/philanthropy-impact" element={<PhilanthropyImpact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/internal-news" element={<InternalNews />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/what-we-offer/type-a" element={<WhatWeOfferTypeA />} />
          <Route path="/what-we-offer/type-b" element={<WhatWeOfferTypeB />} />
          <Route path="/what-we-offer/type-c" element={<WhatWeOfferTypeC />} />
          <Route path="/what-we-offer/type-d" element={<WhatWeOfferTypeD />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <GlobalSmoothScroll />
      <ScrollToTop />
      <div className="min-h-screen font-sans text-gray-900 dark:text-white selection:bg-brand-gold selection:text-white transition-colors duration-300">
        <Navbar />
        <AnimatedRoutes />
        <Footer />
        <GradualBlur
          target="page"
          position="bottom"
          height="7rem"
          strength={2}
          divCount={5}
          curve="bezier"
          exponential
          opacity={1}
          zIndex={5}
        />
        <SupportChatbot />
      </div>
    </Router>
  );
}

export default App;
