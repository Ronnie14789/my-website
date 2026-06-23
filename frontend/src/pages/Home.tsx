import React from 'react';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Home: React.FC = () => (
  <>
    <Hero />
    <About />
    <Projects />
    <Contact />
    <Footer />
  </>
);

export default Home;
