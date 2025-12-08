'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Home, LogOut, ChevronRight, PlayCircle, Menu, X, Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic'; 

// 1. IMPORTANT FIX: Top-level import අයින් කළා. 
// කලින් තිබ්බ "import { pdfjs } from 'react-pdf';" එක මෙතනින් අයින් කළා.

// 2. Document Component එක Dynamic කළා (SSR False)
const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), {
  ssr: false, // Server එකේ Run වෙන්නේ නෑ
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full gap-4 pt-20">
       <Loader2 className="animate-spin text-blue-500" size={48} />
       <p className="text-gray-400">Initializing Reader...</p>
    </div>
  ),
});

// 3. Page Component එක Dynamic කළා
const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), {
  ssr: false,
});

export default function ReaderPage() {
  const router = useRouter();
  const [activeChapter, setActiveChapter] = useState('Introduction');
  const [activePage, setActivePage] = useState(2); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [pageWidth, setPageWidth] = useState(600);
  const pdfWrapperRef = useRef<HTMLDivElement>(null);

  const chapters = [
    { id: 'intro', title: 'Introduction', page: 2 },
    { id: 'anatomy', title: 'Full Body Anatomy', page: 3 },
    { id: 'biceps', title: 'Biceps Training', page: 5 },
    { id: 'triceps', title: 'Triceps Training', page: 33 },
    { id: 'shoulders', title: 'Shoulder Mastery', page: 82 },
    { id: 'chest', title: 'Chest Development', page: 130 },
    { id: 'back', title: 'Back Width & Thickness', page: 181 },
    { id: 'legs', title: 'Legs (Quads & Hams)', page: 241 },
    { id: 'cardio', title: 'Cardio & Burpees', page: 350 },
  ];

  // 4. IMPORTANT FIX: Worker එක Load කරන එක useEffect ඇතුලට දැම්මා
  useEffect(() => {
    const setupPdfWorker = async () => {
        // මෙතනදි තමයි අපි pdfjs එක import කරගන්නේ (Client Side විතරයි)
        const { pdfjs } = await import('react-pdf');
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    };
    
    setupPdfWorker();
  }, []);

  // Resize Listener
  useEffect(() => {
    function handleResize() {
      if (pdfWrapperRef.current) {
        setPageWidth(pdfWrapperRef.current.clientWidth);
      }
    }
    setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Security: Disable Right Click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Security: Disable Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'u')) || 
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        alert("Protected Content: Screenshots and downloading are disabled.");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChapterChange = (chapter: typeof chapters[0]) => {
    setActiveChapter(chapter.title);
    setActivePage(chapter.page);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-r border-white/10 select-none">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div>
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 cursor-pointer">
            BUILD WITH LIVE
            </h1>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Premium Reader</p>
        </div>
        <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400">
            <X size={24} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-800">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Content Index</div>
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => handleChapterChange(chapter)}
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
    <div 
      className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans select-none" 
      onContextMenu={handleContextMenu}
    >
      <aside className="hidden md:block w-80 h-full">
        <SidebarContent />
      </aside>

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

      <main className="flex-1 flex flex-col h-full relative w-full">
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
                    Live Access
                </span>
            </div>
        </header>

        <div className="flex-1 bg-[#111] p-0 md:p-6 overflow-hidden flex flex-col relative">
            <div 
                ref={pdfWrapperRef} 
                className="flex-1 md:rounded-2xl md:border border-white/10 overflow-y-auto shadow-2xl relative bg-gray-900 w-full h-full flex justify-center p-4 scrollbar-thin scrollbar-thumb-blue-600/20"
            >
                <Document
                    file="/book.pdf"
                    loading={
                        <div className="flex flex-col items-center justify-center h-full gap-4 pt-20">
                            <Loader2 className="animate-spin text-blue-500" size={48} />
                            <p className="text-gray-400">Loading Secure Document...</p>
                        </div>
                    }
                    error={
                        <div className="flex flex-col items-center justify-center h-full gap-4 pt-20">
                            <ShieldAlert className="text-red-500" size={48} />
                            <p className="text-red-400">Failed to load document. Please refresh.</p>
                        </div>
                    }
                    className="flex flex-col items-center"
                >
                    <Page 
                        pageNumber={activePage} 
                        width={pageWidth > 800 ? 800 : pageWidth - 32} 
                        renderTextLayer={false} 
                        renderAnnotationLayer={false} 
                        className="shadow-2xl"
                    />
                </Document>

                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 overflow-hidden opacity-10">
                    <div className="rotate-[-45deg] grid grid-cols-2 gap-20">
                        {Array.from({ length: 8 }).map((_, i) => (
                             <div key={i} className="text-4xl font-black text-white whitespace-nowrap select-none">
                                PRIVATE • DO NOT COPY
                             </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
}