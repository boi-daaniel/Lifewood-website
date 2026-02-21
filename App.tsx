import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen font-sans text-gray-900 dark:text-white selection:bg-brand-gold selection:text-white transition-colors duration-300">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ai-services" element={<AIServices />} />
          <Route path="/ai-projects" element={<AIProjects />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/offices" element={<Offices />} />
          <Route path="/what-we-offer/type-a" element={<WhatWeOfferTypeA />} />
          <Route path="/what-we-offer/type-b" element={<WhatWeOfferTypeB />} />
          <Route path="/what-we-offer/type-c" element={<WhatWeOfferTypeC />} />
          <Route path="/what-we-offer/type-d" element={<WhatWeOfferTypeD />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
