"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '#' },
    { name: 'Missions', href: '#missions' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-6' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center h-full">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-[#006233]">MDM <span className="text-gray-900">Étudiants</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-gray-600 font-bold hover:text-[#006233] transition-colors">
              {link.name}
            </a>
          ))}
          <a href="#don" className="bg-[#C1272D] text-white px-7 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-red-800 transition-all shadow-sm">
            <Heart size={20} className="fill-current" /> Faire un don
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-gray-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-xl border-t border-gray-100 py-6 px-6 flex flex-col gap-6 h-screen">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-gray-800 text-xl font-bold py-2 border-b border-gray-100">
              {link.name}
            </a>
          ))}
          <a href="#don" onClick={() => setMobileMenuOpen(false)} className="bg-[#C1272D] text-white px-6 py-4 rounded-2xl font-bold text-lg flex justify-center items-center gap-2 mt-4">
            <Heart size={20} className="fill-current" /> Faire un don
          </a>
        </div>
      )}
    </nav>
  );
}
