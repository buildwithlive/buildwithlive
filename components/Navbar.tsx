'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 cursor-pointer">
            <Link href="/">
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                BUILD WITH LIVE
                </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <a href="/#features" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium">Features</a>
              <a href="/#preview" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium">Inside the Book</a>
              
              {/* Member Login Button */}
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
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black/95 border-b border-white/10"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col gap-2">
            <a href="/#features" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Features</a>
            <Link href="/login" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Member Login</Link>
            <a href="/#pricing" className="text-blue-400 font-bold block px-3 py-2 rounded-md text-base">Buy Now</a>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;