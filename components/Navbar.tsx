'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/10 bg-black/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer">
            <Link href="/">
                <span className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                BUILD WITH LIVE
                </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <a href="/#features" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium">Features</a>
              <a href="/#preview" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium">Inside the Book</a>
              
              <Link href="/login" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium border border-white/20 px-4 py-2 rounded-full hover:bg-white/10">
                <User size={16} /> Member Login
              </Link>

              <a href="/#pricing" className="bg-white text-black hover:bg-gray-200 transition-colors duration-300 px-5 py-2.5 rounded-full text-sm font-bold">
                Get it Now
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-400 hover:text-white p-2 rounded-md focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-4 flex flex-col">
              <a href="/#features" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Features</a>
              <a href="/#preview" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Inside the Book</a>
              <Link href="/login" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium flex items-center gap-2">
                <User size={18}/> Member Login
              </Link>
              <a href="/#pricing" onClick={() => setIsOpen(false)} className="text-blue-400 font-bold block px-3 py-3 rounded-xl text-base bg-blue-900/10 border border-blue-500/20 text-center mt-2">
                Buy Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;