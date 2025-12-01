'use client';

import React, { useState } from 'react';
import { BookOpen, Home, LogOut, ChevronRight, PlayCircle, Menu, X, Download } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReaderPage() {
  const [activeChapter, setActiveChapter] = useState('Introduction');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Chapters List (ඔයාගේ පොතේ පිටු අංක අනුව)
  const chapters = [
    { id: 'intro', title: 'Introduction', page: 2 },
    { id: 'anatomy', title: 'Full Body Anatomy', page: 3 },
    { id: 'biceps', title: 'Biceps Training', page: 5 },
    { id: 'triceps', title: 'Triceps Training', page: 33 },
    { id: 'shoulders', title: 'Shoulder Mastery', page: 82 },
    { id: 'chest', title: 'Chest Development', page: 130 },
    { id: 'back', title: 'Back Width & Thickness', page: 181 },
    { id: 'legs', title: 'Legs (Quads & Hams)', page: 241 },
  ];

  // Sidebar Component (Mobile & Desktop දෙකටම පාවිච්චි කරන්න)
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-r border-white/10">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div>
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 cursor-pointer">
            BUILD WITH LIVE
            </h1>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Premium Reader</p>
        </div>
        {/* Mobile Close Button */}
        <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400">
            <X size={24} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-800">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Table of Contents</div>
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => {
                setActiveChapter(chapter.title);
                setIsMobileMenuOpen(false); // Mobile එකේදී Click කළාම Menu එක වැහෙනවා
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
              activeChapter === chapter.title 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <PlayCircle size={16} className={`transition-colors ${activeChapter === chapter.title ? 'text-blue-400' : 'text-gray-600 group-hover:text-white'}`} />
              {chapter.title}
            </div>
            {activeChapter === chapter.title && <ChevronRight size={14} />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1 bg-black/20">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors text-sm">
          <Home size={18} /> Home Page
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 rounded-xl hover:bg-red-500/10 transition-colors text-sm">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:block w-80 h-full">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 left-0 w-4/5 max-w-xs z-50 md:hidden"
                >
                    <SidebarContent />
                </motion.div>
            </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative w-full">
        
        {/* Top Header */}
        <header className="h-16 bg-[#0a0a0a]/90 backdrop-blur border-b border-white/10 flex items-center justify-between px-4 md:px-8 z-10">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-gray-300 hover:text-white bg-white/5 rounded-lg">
                    <Menu size={20} />
                </button>
                <div className="flex flex-col">
                    <h2 className="text-sm md:text-lg font-bold flex items-center gap-2 text-white">
                        <BookOpen size={18} className="text-blue-500" /> 
                        <span className="truncate max-w-[150px] md:max-w-none">{activeChapter}</span>
                    </h2>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="hidden md:inline-flex px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20 items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Access Granted
                </span>
            </div>
        </header>

        {/* PDF Viewer Container */}
        <div className="flex-1 bg-[#111] p-0 md:p-6 overflow-hidden flex flex-col relative">
            
            {/* The PDF Viewer */}
            <div className="flex-1 md:rounded-2xl md:border border-white/10 overflow-hidden shadow-2xl relative bg-gray-900 w-full h-full">
                
                {/* PDF Loading / Missing Error Handler */}
                <object 
                    data="/book.pdf#toolbar=0&navpanes=0&scrollbar=0" 
                    type="application/pdf" 
                    className="w-full h-full block"
                >
                    {/* This shows ONLY if PDF fails to load (e.g., on some mobile browsers) */}
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                            <BookOpen className="text-gray-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Preview Not Available</h3>
                        <p className="text-gray-400 max-w-sm">
                            Your browser doesn't support embedded PDFs, or the file is missing.
                        </p>
                        <a 
                            href="/book.pdf" 
                            target="_blank"
                            download 
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all"
                        >
                            <Download size={18} /> Download Book
                        </a>
                    </div>
                </object>

                {/* Security Watermark (Overlay) */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 overflow-hidden">
                    <div className="rotate-[-45deg] text-5xl md:text-8xl font-black text-white/5 whitespace-nowrap select-none">
                        BUILD WITH LIVE • PRIVATE
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}