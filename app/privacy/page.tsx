'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="bg-black min-h-screen text-white selection:bg-emerald-500 selection:text-white">
      <Navbar />
      
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-emerald-900/20 rounded-2xl mb-6">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Privacy Policy
          </h1>
          <p className="text-gray-400">How we collect, use, and protect your data.</p>
        </motion.div>

        <div className="space-y-8 text-gray-300 leading-relaxed bg-[#0a0a0a] p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
            
            <section>
                <p>At BUILD WITH VIDEOS, we are committed to protecting the privacy and security of our customers' personal information. This Privacy Policy outlines how we safeguard your information.</p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">Information We Collect</h3>
                <ul className="list-disc pl-5 space-y-2 marker:text-emerald-500">
                    <li><strong>Personal Information:</strong> Name, email address, and phone number provided during checkout.</li>
                    <li><strong>Payment Information:</strong> Credit card details are securely handled by trusted third-party payment processors (PayHere). We do not store this data.</li>
                    <li><strong>Browsing Information:</strong> IP address, browser type, and device info collected via cookies.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">Use of Information</h3>
                <p className="mb-2">We use collected information to:</p>
                <ul className="list-disc pl-5 space-y-2 marker:text-emerald-500">
                    <li>Process and fulfill your orders.</li>
                    <li>Communicate with you regarding purchases and support.</li>
                    <li>Improve our website and prevent fraud.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">Information Sharing</h3>
                <p>We do not sell your personal information. We may share data with trusted service providers who assist us in operating our website and processing payments. These providers are obligated to handle your data securely.</p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">Data Security</h3>
                <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">Contact Us</h3>
                <p>If you have questions regarding our Privacy Policy, please contact us at: <a href="mailto:buildwithlive@gmail.com" className="text-emerald-400 hover:underline">buildwithlive@gmail.com</a></p>
            </section>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}