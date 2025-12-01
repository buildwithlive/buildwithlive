'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';

export default function RefundPage() {
  return (
    <div className="bg-black min-h-screen text-white selection:bg-red-500 selection:text-white">
      <Navbar />
      
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-red-900/20 rounded-2xl mb-6">
            <RefreshCcw className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Refund Policy
          </h1>
          <p className="text-gray-400">Our policy regarding returns and refunds.</p>
        </motion.div>

        <div className="space-y-8 text-gray-300 leading-relaxed bg-[#0a0a0a] p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
            
            <section>
                <p>Thank you for shopping at BUILD WITH VIDEOS. We value your satisfaction and strive to provide you with the world's best video book experience.</p>
            </section>

            <section className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    Returns & Refunds
                </h3>
                <p className="text-gray-300">
                    Due to the digital nature of our product (Video Book/E-Book), <strong>we do not offer returns or refunds</strong> once the product has been purchased and access has been granted.
                </p>
                <p className="mt-4 text-sm text-gray-400">
                    Please ensure you review all product information before making a purchase.
                </p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">Contact Us</h3>
                <p>If you have any questions or concerns regarding our refund policy, or if you are experiencing technical issues accessing your product, please email us immediately.</p>
                <div className="mt-4">
                    <a href="mailto:buildwithlive@gmail.com" className="text-white font-bold text-lg hover:text-red-400 transition-colors">
                        buildwithlive@gmail.com
                    </a>
                </div>
            </section>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}