'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import CheckoutModal from './CheckoutModal'; 

const Pricing = () => {
    return (
        <section id="pricing" className="py-16 md:py-24 relative bg-black overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-blue-900/10 blur-[100px]"></div>
            
            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-3xl p-6 md:p-12 text-center shadow-2xl shadow-blue-900/20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Start Building Today</h2>
                    <p className="text-gray-400 mb-8 text-sm md:text-base">Get instant access to the digital revolution of bodybuilding.</p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-8">
                        <span className="text-xl sm:text-2xl text-gray-500 line-through decoration-red-500 decoration-2">$21.00</span>
                        {/* Mobile price text size adjustment */}
                        <span className="text-5xl sm:text-6xl font-black text-white">$20.00</span>
                    </div>
                    
                    <div className="flex flex-col gap-4 max-w-md mx-auto">
                        
                        {/* Modal Connected Button */}
                        <CheckoutModal>
                            <button className="w-full bg-white text-black font-bold text-lg sm:text-xl py-4 rounded-xl hover:bg-gray-200 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3">
                                <ShoppingCart size={24} /> Buy Now via PayHere
                            </button>
                        </CheckoutModal>

                        <p className="text-xs text-gray-500 mt-4 px-4">
                            Secure payment processed by PayHere. Instant digital delivery via Email.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;