import FeaturesSection from "../components/landing/FeaturesSection";
import DemoSection from "../components/landing/DemoSection";
import PricingSection from "../components/landing/PricingSection";
import CTA from "../components/landing/CTA";
import FAQ from "../components/landing/FAQ";
import Footer from "../components/landing/Footer";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white">
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-800 shadow-lg' : 'bg-gray-800 bg-opacity-90'}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <a href="#" className="flex items-center">
                <div className="w-auto text-indigo-600 rounded-md flex items-center justify-center">
                  <img src="/logo.png" alt="Logo" className="h-6 w-6" />
                </div>
                <span className="ml-2 text-xl font-bold text-white">Vision</span>
              </a>
            </div>


            <div className="items-center justify-end flex md:flex-1 lg:w-0">
              <a href="/signin" className="whitespace-nowrap text-base font-medium text-gray-300 hover:text-white">
                Sign in
              </a>
              <a
                href="/signup"
                className="ml-6 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-500 transition-colors"
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section - minimal, centered approach */}
      <div className="relative bg-gray-800 min-h-screen flex items-center justify-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Simple badge */}
          <div className="inline-flex items-center rounded-full bg-gray-700/50 px-3 py-1 text-sm font-medium text-indigo-300 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-2"></span>
            New Platform
          </div>

          {/* Clean, centered heading */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Secure, organized,
            <span className="block text-indigo-400 mt-2">intelligent image management</span>
          </h1>

          {/* Concise description */}
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
            A complete solution for businesses and teams who need to securely manage, organize,
            and share visual content. With powerful review workflows and smart features.
          </p>

          {/* Centered CTAs */}
          <div className="mt-10 flex justify-center gap-x-6">
            <a
              href="/signup"
              className="rounded-md bg-indigo-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              Get started
            </a>
            <a href="#demo" className="text-base font-medium text-gray-300 hover:text-white flex items-center group">
              View demo
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <FeaturesSection />
      <DemoSection />
      <PricingSection />
      <CTA />
      <FAQ />
      <Footer />
    </div>
  );
}
