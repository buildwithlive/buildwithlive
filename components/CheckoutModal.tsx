'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, CreditCard, Loader2, Mail, ArrowRight, ShieldCheck, User, Phone, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// PayHere Global Object
declare global {
  interface Window {
    payhere: any;
  }
}

const CheckoutModal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  
  // State Management
  const [step, setStep] = useState<'email' | 'otp' | 'details'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpInput, setOtpInput] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: 'Global',
    city: 'Global',
    country: 'Global'
  });

  const amount = "20.00"; // Live Price in USD
  const currency = "USD";

  // --- VALIDATION FUNCTIONS ---
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone: string) => /^\+?[0-9]{9,15}$/.test(phone); // Basic international format

  // 1. Step: Check Email & Status
  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(formData.email)) {
        setError("Please enter a valid email address.");
        return;
    }

    setLoading(true);

    try {
        // A. Check if user already purchased
        const statusRes = await fetch('/api/auth/check-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email })
        });
        const statusData = await statusRes.json();

        if (statusData.hasAccess) {
            alert("You already own this book! Redirecting to login...");
            router.push('/login');
            return;
        }

        // B. Send Real OTP (NEW CODE) -------------------------
        const otpRes = await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email })
        });
        
        if (!otpRes.ok) {
            throw new Error("Failed to send verification code.");
        }
        // -----------------------------------------------------

        setStep('otp');
        setLoading(false);

    } catch (err) {
        console.error(err);
        setError("Connection failed. Please check your internet.");
        setLoading(false);
    }
  };

  // 2. Step: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
          // Verify with Backend API ---------------------------
          const res = await fetch('/api/auth/verify-otp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  email: formData.email, 
                  code: otpInput 
              })
          });
          const data = await res.json();

          if (data.valid) {
              setStep('details'); 
          } else {
              setError(data.message || "Invalid Code! Please try again.");
          }
          // ---------------------------------------------------
          
      } catch (err) {
          setError("Verification failed. Try again.");
      } finally {
          setLoading(false);
      }
  };

  // 3. Step: Process Payment (LIVE MODE)
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !isValidPhone(formData.phone)) {
        setError("Please enter a valid name and phone number.");
        return;
    }

    setLoading(true);

    try {
      const orderId = `ORD-${Date.now()}`;

      // A. Save Order to Database (Status: PENDING)
      const saveRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            order_id: orderId,
            amount: amount
        })
      });

      if (!saveRes.ok) throw new Error("Order initialization failed.");

      // B. Generate Security Hash
      const hashRes = await fetch('/api/payhere-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, amount, currency }),
      });
      const { hash } = await hashRes.json();

      if (!hash) {
        throw new Error("Security hash generation failed.");
      }

      // C. PayHere Payment Object (LIVE)
      const payment = {
        sandbox: false, // Set to FALSE for Live Payments
        merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID,
        return_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/`,
        notify_url: `${window.location.origin}/api/payhere-notify`,
        order_id: orderId,
        items: "Build With Live - Full Access",
        amount: amount,
        currency: currency,
        hash: hash,
        first_name: formData.name,
        last_name: "",
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        custom_1: formData.name, // Pass name for notify handling
        custom_2: formData.email, // Pass email for notify handling
      };

      // D. Trigger PayHere
      if (typeof window !== 'undefined' && window.payhere) {
        window.payhere.startPayment(payment);
        
        window.payhere.onCompleted = function onCompleted(oid: string) {
            console.log("Payment Success. OrderID:" + oid);
            window.location.href = '/payment/success';
        };

        window.payhere.onDismissed = function onDismissed() {
            setLoading(false);
        };

        window.payhere.onError = function onError(error: string) {
            console.error("PayHere Error:", error);
            setError("Payment Failed: " + error);
            setLoading(false);
        };
      } else {
        alert("Payment Gateway loading... please wait a moment and try again.");
        setLoading(false);
      }

    } catch (err: any) {
      console.error("Payment Start Error:", err);
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[95%] bg-[#0a0a0a] border-white/10 text-white shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            {step === 'email' && "Start Your Journey"}
            {step === 'otp' && "Verify Your Email"}
            {step === 'details' && "Final Checkout"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            {step === 'email' && "Enter your email to verify eligibility."}
            {step === 'otp' && `We sent a code to ${formData.email}. (Dev Code: 123456)`}
            {step === 'details' && "Secure your copy now."}
          </DialogDescription>
        </DialogHeader>

        {/* Error Message Display */}
        {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
            </div>
        )}

        {/* STEP 1: Email Entry */}
        {step === 'email' && (
            <form onSubmit={handleEmailCheck} className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                        <Input 
                            id="email" type="email" placeholder="you@example.com" 
                            className="bg-gray-900 border-gray-700 text-white pl-10 h-12 focus:border-blue-500 rounded-xl"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold text-lg rounded-xl transition-all">
                    {loading ? <Loader2 className="animate-spin" /> : <>Next Step <ArrowRight size={18} className="ml-2"/></>}
                </Button>
            </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label className="text-gray-300">Verification Code</Label>
                    <div className="relative">
                        <ShieldCheck className="absolute left-3 top-3 text-emerald-500" size={18} />
                        <Input 
                            type="text" placeholder="123456" maxLength={6}
                            className="bg-gray-900 border-gray-700 text-white pl-10 h-12 text-center text-xl tracking-widest font-mono rounded-xl focus:border-emerald-500"
                            required
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                        />
                    </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 font-bold text-lg rounded-xl transition-all">
                    {loading ? <Loader2 className="animate-spin" /> : "Verify Code"}
                </Button>
                <button type="button" onClick={() => {setStep('email'); setError('');}} className="text-xs text-gray-500 hover:text-white underline text-center mt-2">
                    Change Email Address
                </button>
            </form>
        )}

        {/* STEP 3: Payment Details */}
        {step === 'details' && (
            <form onSubmit={handlePayment} className="grid gap-4 py-2">
                <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-200">Total to Pay:</span>
                    <span className="text-2xl font-black text-blue-400">$20.00</span> 
                </div>

                <div className="grid gap-2">
                    <Label className="text-gray-300">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-500" size={18} />
                        <Input 
                            placeholder="Your Name" 
                            className="bg-gray-900 border-gray-700 text-white pl-10 h-11 rounded-lg"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label className="text-gray-300">Phone Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 text-gray-500" size={18} />
                        <Input 
                            placeholder="+94 77 123 4567" 
                            type="tel"
                            className="bg-gray-900 border-gray-700 text-white pl-10 h-11 rounded-lg"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold h-14 text-lg rounded-xl shadow-lg shadow-blue-900/20">
                    {loading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                    ) : (
                    <><CreditCard className="mr-2 h-5 w-5" /> Pay $20.00 Now</>
                    )}
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider">
                    <Lock size={10} />
                    <span>256-bit Secure SSL Payment by PayHere</span>
                </div>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;