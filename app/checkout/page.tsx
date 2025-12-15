'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script'; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; 
import { 
  Loader2, 
  Lock, 
  Shield, 
  CheckCircle, 
  Youtube, 
  HardDrive, 
  Globe 
} from 'lucide-react';

declare global {
  interface Window { payhere: any; }
}

// Full Country List with Dial Codes
const COUNTRIES = [
  { name: "Sri Lanka", code: "LK", dial: "+94" },
  { name: "United States", code: "US", dial: "+1" },
  { name: "United Kingdom", code: "UK", dial: "+44" },
  { name: "Australia", code: "AU", dial: "+61" },
  { name: "India", code: "IN", dial: "+91" },
  { name: "Canada", code: "CA", dial: "+1" },
  { name: "United Arab Emirates", code: "AE", dial: "+971" },
  { name: "Qatar", code: "QA", dial: "+974" },
  { name: "Saudi Arabia", code: "SA", dial: "+966" },
  { name: "Kuwait", code: "KW", dial: "+965" },
  { name: "Singapore", code: "SG", dial: "+65" },
  { name: "Japan", code: "JP", dial: "+81" },
  { name: "South Korea", code: "KR", dial: "+82" },
  { name: "Germany", code: "DE", dial: "+49" },
  { name: "France", code: "FR", dial: "+33" },
  { name: "Italy", code: "IT", dial: "+39" },
  { name: "New Zealand", code: "NZ", dial: "+64" },
  { name: "Maldives", code: "MV", dial: "+960" },
  { name: "Malaysia", code: "MY", dial: "+60" },
  { name: "China", code: "CN", dial: "+86" },
  { name: "Russia", code: "RU", dial: "+7" },
  { name: "South Africa", code: "ZA", dial: "+27" },
  { name: "Other", code: "GL", dial: "+" }
];

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    country: 'Sri Lanka', 
    dialCode: '+94',     
    phoneBody: '',        
    youtube: '',
    isDriveActive: false
  });

  // Load Email
  useEffect(() => {
    const savedEmail = localStorage.getItem('checkout_email');
    if (!savedEmail) {
        router.push('/'); 
    } else {
        setEmail(savedEmail);
    }
  }, [router]);

  // Handle Country Change
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = COUNTRIES.find(c => c.name === e.target.value);
    setFormData({
      ...formData, 
      country: e.target.value,
      dialCode: selected ? selected.dial : '+'
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name) {
        alert("Please enter your Full Name.");
        setLoading(false);
        return;
    }

    // Combine Code + Phone
    const fullPhone = formData.phoneBody ? `${formData.dialCode}${formData.phoneBody}` : '';
    const payherePhone = fullPhone || '0000000000'; 

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
            phone: fullPhone,
            country: formData.country,
            youtube_channel: formData.youtube,
            is_google_drive_active: formData.isDriveActive,
            order_id: orderId,
            amount: amount
        })
      });
      
      if (!saveRes.ok) throw new Error("Order save failed");

      // 2. Get Hash
      const hashRes = await fetch('/api/payhere-hash', {
        method: 'POST',
        body: JSON.stringify({ order_id: orderId, amount, currency: "USD" }),
      });
      const { hash } = await hashRes.json();

      // 3. Start PayHere
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
        phone: payherePhone,
        address: "Digital Access",
        city: "Online",
        country: formData.country,
        custom_1: formData.youtube, 
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
      console.error(err);
      alert("Something went wrong. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://www.payhere.lk/lib/payhere.js" strategy="lazyOnload" />

      {/* Main Container: Adjusted padding for better mobile view */}
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans">
        
        {/* Grid Layout: Adjusted gaps and max-width */}
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start">
          
          {/* --- RIGHT COLUMN (SUMMARY) --- */}
          {/* Sticky functionality preserved, better mobile padding */}
          <div className="order-1 md:order-2 md:sticky md:top-8 h-fit bg-gradient-to-br from-blue-900/20 to-emerald-900/20 border border-white/10 p-6 sm:p-8 rounded-2xl flex flex-col justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none"></div>
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">
                  Summary <span className="text-[10px] sm:text-xs bg-white/10 px-2 py-0.5 rounded text-gray-400">Step 1 of 2</span>
              </h3>
              
              <div className="flex items-start gap-4 mb-6 sm:mb-8">
                  <div className="w-20 sm:w-24 h-28 sm:h-32 bg-gray-800 rounded-lg shadow-lg bg-[url('/sample.jpg')] bg-cover bg-center border border-white/10 flex-shrink-0"></div>
                  <div>
                      <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">BUILD WITH LIVE</h1>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">Digital Interactive Book</p>
                      <div className="flex items-center gap-2 mt-3 sm:mt-4 text-emerald-400 text-xs sm:text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                          <CheckCircle size={14} /> Lifetime Access
                      </div>
                  </div>
              </div>

              <div className="border-t border-white/10 pt-5 sm:pt-6 space-y-3">
                  <div className="flex justify-between text-sm sm:text-base text-gray-400">
                      <span>Subtotal</span>
                      <span>$20.00</span>
                  </div>
                  <div className="flex justify-between text-xl sm:text-2xl font-bold text-white pt-2 border-t border-white/5 mt-2">
                      <span>Total</span>
                      <span className="text-blue-400">$20.00</span>
                  </div>
              </div>

              <div className="mt-6 bg-black/40 p-3 rounded-lg border border-white/5">
                <p className="text-[10px] sm:text-xs text-gray-400 italic text-center">
                  "No monthly fees. Pay once, own it forever."
                </p>
              </div>
          </div>

          {/* --- LEFT COLUMN (FORM) --- */}
          <div className="order-2 md:order-1 bg-[#0a0a0a] border border-white/10 p-5 sm:p-8 rounded-2xl shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="text-blue-500 w-6 h-6" /> Secure Checkout
              </h2>
              
              <form onSubmit={handlePayment} className="space-y-5 sm:space-y-6">
                  {/* Email (Read Only) */}
                  <div className="space-y-2">
                      <Label className="text-gray-400 text-xs uppercase tracking-wider">Email Address</Label>
                      <div className="relative">
                        <Input value={email} disabled className="bg-emerald-900/10 border-emerald-500/30 text-emerald-400 font-bold pl-3 text-base" />
                        <CheckCircle className="absolute right-3 top-3.5 text-emerald-500" size={16} />
                      </div>
                  </div>
                  
                  {/* Full Name */}
                  <div className="space-y-2">
                      <Label className="text-gray-300">Full Name</Label>
                      <Input 
                          placeholder="Enter your full name" 
                          required 
                          className="bg-gray-900 border-gray-700 text-white h-12 rounded-xl focus:ring-2 focus:ring-blue-500 text-base" // text-base avoids iOS zoom
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                  </div>

                  {/* Country & Phone (Auto Code) */}
                  <div className="space-y-2">
                      <Label className="text-gray-300 flex items-center gap-2">
                          Which country are you from? <Globe size={14} className="text-gray-500"/>
                      </Label>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                          {/* Country Select */}
                          <div className="w-full sm:w-1/3 relative">
                            <select 
                                className="w-full appearance-none bg-gray-900 border border-gray-700 text-white h-12 rounded-xl px-3 focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                                value={formData.country}
                                onChange={handleCountryChange}
                            >
                                {COUNTRIES.map(c => (
                                    <option key={c.code} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                            {/* Custom Arrow for select */}
                            <div className="absolute right-3 top-4 pointer-events-none text-gray-500">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                          </div>

                          {/* Phone Input with Prefix */}
                          <div className="w-full sm:w-2/3 relative">
                            <span className="absolute left-3 top-3.5 text-gray-400 text-sm font-mono pointer-events-none select-none">
                                {formData.dialCode}
                            </span>
                            <Input 
                                type="tel" 
                                placeholder="Phone (Optional)" 
                                className="bg-gray-900 border-gray-700 text-white h-12 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono pl-14 text-base"
                                value={formData.phoneBody}
                                onChange={(e) => setFormData({...formData, phoneBody: e.target.value})}
                            />
                          </div>
                      </div>
                  </div>

                  {/* YouTube Channel */}
                  <div className="space-y-2">
                      <Label className="text-gray-300 flex items-center gap-2">
                          <Youtube size={16} className="text-red-500"/>
                          If you discovered us via YouTube (Channel Name)
                      </Label>
                      <Input 
                          placeholder="Channel Name (Optional)" 
                          className="bg-gray-900 border-gray-700 text-white h-12 rounded-xl focus:ring-2 focus:ring-blue-500 text-base"
                          value={formData.youtube}
                          onChange={(e) => setFormData({...formData, youtube: e.target.value})}
                      />
                  </div>

                  {/* Google Drive Checkbox */}
                  <div className="bg-gray-900/50 p-4 rounded-xl border border-white/5 flex items-start gap-3 hover:border-white/10 transition-colors cursor-pointer" onClick={() => setFormData({...formData, isDriveActive: !formData.isDriveActive})}>
                      <Checkbox 
                        id="gdrive" 
                        className="mt-1 border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        checked={formData.isDriveActive}
                        onCheckedChange={(checked) => setFormData({...formData, isDriveActive: checked as boolean})}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="gdrive"
                          className="text-sm font-medium text-gray-300 cursor-pointer flex items-center gap-2 select-none"
                          onClick={(e) => e.stopPropagation()} // Prevent double trigger
                        >
                          <HardDrive size={14} className="text-blue-400" />
                          Are you active on Google Drive with this email?
                        </label>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Tick this if your email is connected to Google Drive. We use it to share bonus resources and updates instantly.
                        </p>
                      </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 rounded-xl mt-4 shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]">
                      {loading ? <Loader2 className="animate-spin" /> : "Pay $20.00 & Get Access"}
                  </Button>
                  
                  <div className="flex flex-col items-center justify-center gap-2 mt-4">
                      <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                          <Lock size={12} /> Encrypted & Secure Payment handled by PayHere
                      </p>
                  </div>
              </form>
          </div>

        </div>
      </div>
    </>
  );
}