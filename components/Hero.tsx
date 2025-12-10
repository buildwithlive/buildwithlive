'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import Image from 'next/image';
import CheckoutModal from './CheckoutModal'; 

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-12 overflow-hidden bg-[#050505]">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] opacity-50 sm:opacity-100" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px] opacity-50 sm:opacity-100" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left order-2 lg:order-1"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-blue-400 text-[10px] sm:text-xs font-bold tracking-wider uppercase">World&apos;s First Live Video Book</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            TRANSFORM <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">
              WITH LIVE ACTION.
            </span>
          </h1>
          
          <p className="text-sm sm:text-lg text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Forget static images. <strong>&quot;Build With Live&quot;</strong> revolutionizes bodybuilding with over <strong>250+ embedded videos</strong>. See the muscle fibers work, master the form, and unlock your true potential.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start w-full">
            
            {/* Modal Connected Button */}
            <div className="w-full sm:w-auto">
              <CheckoutModal>
                  <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                    Let's Start Now. <ArrowRight size={20} />
                  </button>
              </CheckoutModal>
            </div>
          </div>
        </motion.div>

        {/* 3D Book Mockup Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative perspective-1000 flex justify-center order-1 lg:order-2 py-8 lg:py-0"
        >
          {/* Glass Card Container behind book */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-[3rem] blur-xl transform rotate-6 scale-90"></div>
          
          {/* Book Image Placeholder - FULLY RESPONSIVE */}
          <div className="relative w-[260px] sm:w-[320px] md:w-[400px] aspect-[2/3] rounded-r-2xl shadow-2xl shadow-blue-900/50 transform transition-transform hover:scale-105 duration-500 group">
             <div className="absolute inset-0 bg-gray-800 rounded-r-2xl overflow-hidden border-l-4 sm:border-l-8 border-gray-900">
                <Image 
                  src="/sample.jpg" 
                  alt="Build With Live Book Cover" 
                  fill 
                  className="object-cover"
                  priority
                />
                
                {/* Overlay Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
             </div>
             
             {/* Floating Badge */}
             <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-black border border-gray-700 p-3 sm:p-4 rounded-xl shadow-xl flex items-center gap-3 z-20">
                <div className="bg-red-600 p-2 rounded-full">
                    <Play size={16} className="text-white fill-current sm:w-5 sm:h-5" />
                </div>
                <div>
                    <p className="text-white font-bold text-xs sm:text-sm">250+ Videos</p>
                    <p className="text-gray-400 text-[10px] sm:text-xs">Scan & Watch</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;