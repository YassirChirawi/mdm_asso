"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "À propos", path: "/about" },
    { name: "Le Guide", path: "/guide" },
    { name: "Contact", path: "/contact" },
  ];

  const isHomePage = pathname === "/";
  // The navbar starts transparent on home, but white on other pages.
  const isTransparent = !scrolled && isHomePage;
  const navTextColor = isTransparent ? "text-white" : "text-brand-dark";
  const headerBgColor = scrolled ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-xl shadow-black/5" : (isHomePage ? "bg-transparent" : "bg-white border-b border-gray-100");

  return (
    <header
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${headerBgColor}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 md:h-28 transition-all duration-500">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-14 h-14 md:w-16 md:h-16 overflow-hidden rounded-2xl bg-white shadow-lg flex items-center justify-center p-2 border border-gray-100 group-hover:rotate-6 transition-all duration-500">
              <img src="/logo.png" alt="MDM Association Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className={`font-heading text-[10px] uppercase font-black tracking-[0.3em] opacity-60 ${navTextColor}`}>Association</span>
              <span className={`font-heading text-lg font-black tracking-tighter ${navTextColor}`}>
                Marocains en France
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-heading text-sm font-black uppercase tracking-widest transition-all hover:text-brand-green relative group ${
                  pathname === link.path && !isTransparent
                    ? "text-brand-green"
                    : navTextColor
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-green transition-all duration-300 group-hover:w-full ${pathname === link.path ? 'w-full' : ''}`}></span>
              </Link>
            ))}
            <a
              href="https://donate.stripe.com/5kQaEQ6t57LC7KZ2jPb3q00"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-all duration-500 bg-brand-green rounded-2xl hover:bg-brand-red hover:shadow-[0_15px_30px_rgba(193,39,45,0.2)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <Heart className="w-4 h-4 mr-2 relative z-10 fill-current" />
              <span className="relative z-10">Faire un don</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 transition-all ${navTextColor}`}
            aria-label="Menu principal"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-[112px] bg-white z-[90] px-4 py-12"
          >
            <div className="flex flex-col gap-8 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-heading text-3xl font-black ${
                    pathname === link.path ? "text-brand-green" : "text-brand-dark"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://donate.stripe.com/5kQaEQ6t57LC7KZ2jPb3q00"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full px-8 py-5 text-lg font-black uppercase tracking-widest text-white bg-brand-green rounded-[2rem] mt-8 shadow-2xl shadow-brand-green/30"
              >
                <Heart className="w-6 h-6 mr-3 fill-current" />
                Soutenir
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
