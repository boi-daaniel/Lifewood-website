import React from 'react';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { GlobalReach } from '../components/GlobalReach';
import { Clients } from '../components/Clients';
import { Innovation } from '../components/Innovation';
import { Services } from '../components/Services';

export const Home = () => (
  <>
    <Hero />
    <About />
    <GlobalReach />
    <Clients />
    <Innovation />
    <Services />
  </>
);
