'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ScrollText, ShieldCheck } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-black min-h-screen text-white selection:bg-blue-500 selection:text-white">
      <Navbar />
      
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-900/20 rounded-2xl mb-6">
            <ScrollText className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Terms & Conditions
          </h1>
          <p className="text-gray-400">Please read these terms carefully before using our platform.</p>
        </motion.div>

        <div className="space-y-8 text-gray-300 leading-relaxed bg-[#0a0a0a] p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
            
            <section>
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to BUILD WITH VIDEOS</h2>
                <p>These Terms and Conditions govern your use of our website and the purchase and sale of products from our platform. By accessing and using our website, you agree to comply with these terms.</p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">1. Use of the Website</h3>
                <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                    <li>You are responsible for maintaining the confidentiality of your account information, including your username and password.</li>
                    <li>You agree to provide accurate and current information during the registration and checkout process.</li>
                    <li>You may not use our website for any unlawful or unauthorized purposes.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">2. Product Information and Pricing</h3>
                <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                    <li>We strive to provide accurate product descriptions, images, and pricing information. However, we do not guarantee the accuracy or completeness of such information.</li>
                    <li>Prices are subject to change without notice. Any promotions or discounts are valid for a limited time.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">3. Orders and Payments</h3>
                <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                    <li>By placing an order on our website, you are making an offer to purchase the selected products.</li>
                    <li>We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing, or suspected fraudulent activity.</li>
                    <li>We use trusted third-party payment processors (PayHere) to handle your payment information securely. We do not store your full payment details.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">4. Intellectual Property</h3>
                <p>All content and materials on our website, including text, images, logos, and graphics, are the property of BUILD WITH VIDEOS and are protected by intellectual property rights. You may not use, reproduce, or distribute content without our consent.</p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">5. Limitation of Liability</h3>
                <p>In no event shall BUILD WITH VIDEOS be liable for any direct, indirect, incidental, or consequential damages arising out of your use of our website or products.</p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3">6. Amendments</h3>
                <p>We reserve the right to modify these Terms and Conditions at any time. It is your responsibility to review these terms periodically for any changes.</p>
            </section>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}