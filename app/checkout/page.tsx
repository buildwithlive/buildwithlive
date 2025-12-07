'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script'; // PayHere Script එක Load කරන්න
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Shield, CheckCircle, Globe } from 'lucide-react';

declare global {
  interface Window { payhere: any; }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: 'International', // Default for Digital Goods
    city: 'Online',
    country: 'Global'
  });

  // Load Email from previous step
  useEffect(() => {
    const savedEmail = localStorage.getItem('checkout_email');
    if (!savedEmail) {
        router.push('/'); // No email found, go back
    } else {
        setEmail(savedEmail);
    }
  }, [router]);

  // Phone Number Validation (International Format)
  const isValidPhone = (phone: string) => /^\+?[0-9\s-]{9,20}$/.test(phone);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !isValidPhone(formData.phone)) {
        alert("Please enter a valid Name and International Phone Number.");
        setLoading(false);
        return;
    }

    try {
      const orderId = `ORD-${Date.now()}`;
      const amount = "20.00";

      // 1. Create Pending Order
      const saveRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: formData.name,
            email: email,
            phone: formData.phone,
            order_id: orderId,
            amount: amount
        })
      });
      if (!saveRes.ok) throw new Error("Order failed");

      // 2. Get Hash
      const hashRes = await fetch('/api/payhere-hash', {
        method: 'POST',
        body: JSON.stringify({ order_id: orderId, amount, currency: "USD" }),
      });
      const { hash } = await hashRes.json();

      // 3. Start PayHere Payment
      const payment = {
        sandbox: false, // LIVE MODE
        merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID,
        return_url: `${window.location.origin}/payment/success?order_id=${orderId}`,
        cancel_url: `${window.location.origin}/checkout`,
        notify_url: `${window.location.origin}/api/payhere-notify`,
        order_id: orderId,
        items: "Build With Live - Full Access",
        amount: amount,
        currency: "USD",
        hash: hash,
        first_name: formData.name,
        last_name: "",
        email: email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
      };

      if (window.payhere) {
        window.payhere.startPayment(payment);
        
        window.payhere.onCompleted = function onCompleted(oid: string) {
            router.push(`/payment/success?order_id=${oid}`);
        };
        window.payhere.onDismissed = () => setLoading(false);
        window.payhere.onError = (error: string) => {
            alert("Payment Error: " + error);
            setLoading(false);
        };
      } else {
          alert("Payment gateway is loading. Please wait a moment and try again.");
          setLoading(false);
      }

    } catch (err) {
      alert("Something went wrong. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* PayHere SDK Script */}
      <Script src="https://www.payhere.lk/lib/payhere.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* --- RIGHT COLUMN (SUMMARY) --- */}
          {/* Mobile: Order 1 (First) | Desktop: Order 2 (Right Side) */}
          <div className="order-1 md:order-2 bg-gradient-to-br from-blue-900/20 to-emerald-900/20 border border-white/10 p-8 rounded-2xl h-full flex flex-col justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
              
              <h3 className="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">
                  Summary <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-400">Step 1 of 2</span>
              </h3>
              
              <div className="flex items-start gap-4 mb-8">
                  <div className="w-24 h-32 bg-gray-800 rounded-lg shadow-lg bg-[url('/sample.jpg')] bg-cover bg-center border border-white/10"></div>
                  <div>
                      <h1 className="text-2xl font-black text-white leading-tight">BUILD WITH LIVE</h1>
                      <p className="text-sm text-gray-400 mt-1">Digital Interactive Book</p>
                      <div className="flex items-center gap-2 mt-4 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                          <CheckCircle size={14} /> Lifetime Access
                      </div>
                  </div>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-3">
                  <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span>$20.00</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                      <span>Processing Fee</span>
                      <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-white pt-2 border-t border-white/5 mt-2">
                      <span>Total</span>
                      <span className="text-blue-400">$20.00</span>
                  </div>
              </div>

              <div className="mt-8 bg-black/40 p-4 rounded-xl border border-white/5">
                  <p className="text-sm text-gray-400 leading-relaxed italic">
                      "Once you complete the payment, you will get instant access to the reader. No waiting time."
                  </p>
              </div>
          </div>

          {/* --- LEFT COLUMN (FORM) --- */}
          {/* Mobile: Order 2 (Second) | Desktop: Order 1 (Left Side) */}
          <div className="order-2 md:order-1 bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="text-blue-500" /> Secure Checkout
              </h2>
              
              <form onSubmit={handlePayment} className="space-y-5">
                  <div className="space-y-2">
                      <Label className="text-gray-400 text-xs uppercase tracking-wider">Email Address</Label>
                      <div className="relative">
                        <Input value={email} disabled className="bg-emerald-900/10 border-emerald-500/30 text-emerald-400 font-bold pl-3" />
                        <CheckCircle className="absolute right-3 top-3 text-emerald-500" size={16} />
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-5">
                      <div className="space-y-2">
                          <Label className="text-gray-300">Full Name</Label>
                          <Input placeholder="Enter your full name" required 
                              className="bg-gray-900 border-gray-700 text-white h-12 rounded-xl focus:ring-2 focus:ring-blue-500"
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                      </div>
                      <div className="space-y-2">
                          <Label className="text-gray-300 flex items-center gap-2">
                              Phone Number <Globe size={12} className="text-gray-500"/>
                          </Label>
                          <Input type="tel" placeholder="+1 234 567 890" required 
                              className="bg-gray-900 border-gray-700 text-white h-12 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                          <p className="text-[10px] text-gray-500">Enter with country code (e.g. +94 for SL, +1 for USA)</p>
                      </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 rounded-xl mt-6 shadow-lg shadow-blue-900/20 transition-all">
                      {loading ? <Loader2 className="animate-spin" /> : "Pay $20.00 & Get Access"}
                  </Button>
                  
                  <div className="flex flex-col items-center justify-center gap-2 mt-4">
                      <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                          <Lock size={12} /> Encrypted & Secure Payment handled by PayHere
                      </p>
                      {/* Optional: Card Logos could go here if needed */}
                  </div>
              </form>
          </div>

        </div>
      </div>
    </>
  );
}