'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, User, Send, CheckCircle, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate sending email
    setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-black relative overflow-hidden border-t border-white/5">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[128px]" />
            <div className="absolute top-20 left-0 w-72 h-72 bg-emerald-900/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                
                {/* Text Content */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center lg:text-left"
                >
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                        Have Questions? <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">
                            Let's Talk.
                        </span>
                    </h2>
                    
                    <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
                        Whether you have questions about the book, need technical support, or just want to share your progress, our team is here to help you.
                    </p>

                    <div className="flex justify-center lg:justify-start">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 w-full max-w-md">
                            <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400">
                                <Mail size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="text-white font-bold mb-1">Email Us</h3>
                                <p className="text-gray-400 text-sm break-all">buildwithlive@gmail.com</p>
                                <p className="text-gray-500 text-xs mt-1">Typical response time: 2 hours</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative group"
                >
                    <form onSubmit={handleSubmit} className="relative space-y-5">
                        <div className="grid gap-2">
                            <Label htmlFor="c-name" className="text-gray-300">Your Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-500" size={18} />
                                <Input 
                                    id="c-name" 
                                    placeholder="John Doe" 
                                    className="bg-gray-900/50 border-gray-800 text-white pl-10 focus:border-blue-500 h-12"
                                    required 
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="c-email" className="text-gray-300">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                                <Input 
                                    id="c-email" 
                                    type="email" 
                                    placeholder="john@example.com" 
                                    className="bg-gray-900/50 border-gray-800 text-white pl-10 focus:border-blue-500 h-12"
                                    required 
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="c-message" className="text-gray-300">Message</Label>
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-3 text-gray-500" size={18} />
                                <textarea 
                                    id="c-message" 
                                    rows={4}
                                    placeholder="How can we help you?" 
                                    className="w-full bg-gray-900/50 border border-gray-800 rounded-md text-white pl-10 pt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    required 
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading || success}
                            className={`w-full h-12 font-bold text-lg transition-all ${
                                success 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-white text-black hover:bg-gray-200'
                            }`}
                        >
                            {loading ? (
                                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
                            ) : success ? (
                                <><CheckCircle className="mr-2 h-5 w-5" /> Message Sent!</>
                            ) : (
                                <><Send className="mr-2 h-5 w-5" /> Send Message</>
                            )}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    </section>
  );
};

export default ContactForm;