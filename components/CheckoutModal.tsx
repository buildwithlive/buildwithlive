'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, CreditCard, Loader2, Mail, ArrowRight, ShieldCheck, User, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

// PayHere Types definition
declare global {
  interface Window {
    payhere: any;
  }
}

const CheckoutModal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  
  // Steps: 'email' -> 'otp' -> 'details' -> 'payment'
  const [step, setStep] = useState<'email' | 'otp' | 'details'>('email');
  const [loading, setLoading] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: 'Global',
    city: 'Global',
    country: 'Global'
  });

  const amount = "20.00"; // USD Price
  const currency = "USD";

  // 1. Email Verification Step
  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        // Check if user already bought the book
        const res = await fetch('/api/auth/check-status', {
            method: 'POST',
            body: JSON.stringify({ email: formData.email })
        });
        const data = await res.json();

        if (data.hasAccess) {
            alert("You have already purchased this book! Redirecting to Login...");
            router.push('/login');
            return;
        }

        // Simulate Sending OTP (Development Mode)
        setTimeout(() => {
            setStep('otp');
            setLoading(false);
            // alert("Your Verification Code is: 123456"); // Testing වලට ලේසි වෙන්න
        }, 1000);

    } catch (error) {
        alert("Something went wrong. Please try again.");
        setLoading(false);
    }
  };

  // 2. OTP Verification Step
  const handleVerifyOtp = (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      // Testing OTP code: 123456
      if (otpInput === "123456") {
          setTimeout(() => {
              setStep('details'); // Go to Payment Details
              setLoading(false);
          }, 1000);
      } else {
          alert("Invalid Code! Try 123456 (Dev Code)");
          setLoading(false);
      }
  };

  // 3. Payment Processing (BYPASSED FOR NOW)
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ============================================================
    // DEVELOPMENT MODE: PAYHERE BYPASS (PayHere Commented Out)
    // PayHere Active වන තුරු කෙලින්ම Success Page එකට යැවීම.
    // ============================================================
    
    console.log("Dev Mode: Skipping PayHere...");

    // මෙතනින් අපි Database එකට Order එක Save කරනවා (Pending විදියට)
    // ඊට පස්සේ කෙලින්ම Success එකට යවනවා
    
    try {
        const orderId = `ORD-${Date.now()}`; 

        // A. Save Pending Order to Database
        await fetch('/api/orders/create', {
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

        // B. Simulate Successful Payment Delay
        setTimeout(() => {
            // ඇත්තටම PayHere එකෙන් එන Notify එක වෙනුවට අපි බොරුවට redirect කරනවා
            window.location.href = '/payment/success'; 
            setLoading(false);
        }, 1500);

    } catch (error) {
        console.error("Error saving order:", error);
        alert("Something went wrong with the database.");
        setLoading(false);
    }

    return; // මෙතනින් පහළට යන එක නවත්වනවා (PayHere කෝඩ් එකට යන්නේ නෑ)

    // ============================================================
    // REAL PAYHERE LOGIC (Commented Out for Future Use)
    // ============================================================
    /*
    try {
      const orderId = `Order_${Date.now()}`;
      const res = await fetch('/api/payhere-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, amount, currency }),
      });
      const { hash } = await res.json();

      if (!hash) {
        alert("Payment Error: Could not generate security hash.");
        setLoading(false);
        return;
      }

      const payment = {
        sandbox: true,
        merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID,
        return_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/`,
        notify_url: `${window.location.origin}/api/payhere-notify`,
        order_id: orderId,
        items: "Build With Live E-Book",
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
        custom_1: formData.name,
        custom_2: formData.email,
      };

      if (typeof window !== 'undefined' && window.payhere) {
        window.payhere.startPayment(payment);
      } else {
        alert("PayHere SDK not loaded. Refresh page.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment Start Error:", error);
      setLoading(false);
    }
    */
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border-white/10 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {step === 'email' && "Get Started"}
            {step === 'otp' && "Verify Email"}
            {step === 'details' && "Secure Checkout"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            {step === 'email' && "Enter your email to verify eligibility."}
            {step === 'otp' && `We sent a code to ${formData.email}. (Use 123456)`}
            {step === 'details' && "Final step to unlock your access."}
          </DialogDescription>
        </DialogHeader>

        {/* STEP 1: Email Entry */}
        {step === 'email' && (
            <form onSubmit={handleEmailCheck} className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="you@example.com" 
                            className="bg-gray-900 border-gray-700 text-white pl-10 h-12 focus:border-blue-500"
                            required
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold text-lg">
                    {loading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={18} className="ml-2"/></>}
                </Button>
            </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label className="text-gray-300">Verification Code</Label>
                    <div className="relative">
                        <ShieldCheck className="absolute left-3 top-3 text-green-500" size={18} />
                        <Input 
                            type="text" 
                            placeholder="Enter 6-digit code" 
                            className="bg-gray-900 border-gray-700 text-white pl-10 h-12 text-center letter-spacing-2 font-mono text-xl"
                            maxLength={6}
                            required
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                        />
                    </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 font-bold text-lg">
                    {loading ? <Loader2 className="animate-spin" /> : "Verify & Continue"}
                </Button>
                <button type="button" onClick={() => setStep('email')} className="text-xs text-gray-500 hover:text-white underline text-center">
                    Change Email
                </button>
            </form>
        )}

        {/* STEP 3: Payment Details */}
        {step === 'details' && (
            <form onSubmit={handlePayment} className="grid gap-4 py-2">
                <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-200">Total to Pay:</span>
                    <span className="text-xl font-bold text-blue-400">$20.00</span> 
                </div>

                <div className="grid gap-2">
                    <Label className="text-gray-300">Full Name</Label>
                    <Input 
                        placeholder="Your Name" 
                        className="bg-gray-900 border-gray-700 text-white h-11"
                        required
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div className="grid gap-2">
                    <Label className="text-gray-300">Phone Number</Label>
                    <Input 
                        placeholder="+94 77 ..." 
                        className="bg-gray-900 border-gray-700 text-white h-11"
                        required
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                </div>

                <Button type="submit" disabled={loading} className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold h-12 text-lg">
                    {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                    ) : (
                    <><CreditCard className="mr-2 h-5 w-5" /> Pay $20.00 Now</>
                    )}
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Lock size={12} />
                    <span>256-bit Secure Payment</span>
                </div>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;