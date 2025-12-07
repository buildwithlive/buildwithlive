'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const CheckoutModal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  
  // State Management
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isError, setIsError] = useState(false); // For validation styling

  // Email Validation Helper
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // 1. Email Check & Send OTP
  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);

    // Validate Email Format
    if (!email || !isValidEmail(email)) {
        setIsError(true);
        toast.error("Invalid Email", { description: "Please enter a valid email address." });
        return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Checking eligibility...");

    try {
        // A. Check if user already purchased (API Call)
        const statusRes = await fetch('/api/auth/check-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const statusData = await statusRes.json();

        // If user already owns the book
        if (statusData.hasAccess) {
            toast.dismiss(loadingToast);
            toast.info("Welcome Back!", { 
                description: "You already own this book. Redirecting to login...",
                duration: 4000,
            });
            router.push('/login');
            return;
        }

        // B. Send OTP (API Call)
        const otpRes = await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        if (!otpRes.ok) throw new Error("Failed to send code.");

        // Success - Move to OTP Step
        toast.dismiss(loadingToast);
        toast.success("Code Sent!", { description: `We sent a code to ${email}` });
        setStep('otp');

    } catch (err: any) {
        toast.dismiss(loadingToast);
        console.error(err);
        toast.error("Connection Failed", { description: "Please check your internet connection." });
    } finally {
        setLoading(false);
    }
  };

  // 2. Verify OTP & Redirect to Checkout Page
  const handleVerifyOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if(otpInput.length < 6) {
          toast.error("Incomplete Code", { description: "Please enter the 6-digit code." });
          return;
      }

      setLoading(true);
      const verifyToast = toast.loading("Verifying code...");

      try {
          const res = await fetch('/api/auth/verify-otp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, code: otpInput })
          });
          const data = await res.json();

          if (data.valid) {
              // Success
              toast.dismiss(verifyToast);
              toast.success("Email Verified!");
              
              // Save email for the next page
              if (typeof window !== 'undefined') {
                  localStorage.setItem('checkout_email', email);
              }
              
              // Redirect to Checkout Page
              router.push('/checkout');
          } else {
              // Invalid Code
              toast.dismiss(verifyToast);
              toast.error("Invalid Code", { description: "Please check the code and try again." });
              setOtpInput(''); // Clear input
          }
          
      } catch (err) {
          toast.dismiss(verifyToast);
          toast.error("Verification Error", { description: "Something went wrong. Please try again." });
      } finally {
          setLoading(false);
      }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px] w-[95%] bg-[#0a0a0a] border-white/10 text-white rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {step === 'email' ? "Get Started" : "Verify Email"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            {step === 'email' ? "Enter your email to verify eligibility." : `Enter the code sent to ${email}`}
          </DialogDescription>
        </DialogHeader>

        {step === 'email' ? (
            <form onSubmit={handleEmailCheck} className="space-y-4 py-2">
                <div className="relative">
                    <Mail className={`absolute left-3 top-3 transition-colors ${isError ? 'text-red-500' : 'text-gray-500'}`} size={18} />
                    <Input 
                        type="email" 
                        placeholder="you@example.com" 
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setIsError(false);
                        }}
                        className={`bg-gray-900 pl-10 h-11 rounded-xl text-white transition-all border ${
                            isError 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-gray-700 focus:border-blue-500'
                        }`}
                    />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 h-11 rounded-xl font-bold transition-all">
                    {loading ? <Loader2 className="animate-spin" /> : <>Next Step <ArrowRight size={16} className="ml-2"/></>}
                </Button>
            </form>
        ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 py-2">
                <div className="relative">
                    <ShieldCheck className="absolute left-3 top-3 text-emerald-500" size={18} />
                    <Input 
                        type="text" 
                        placeholder="000000" 
                        maxLength={6} 
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="bg-gray-900 border-gray-700 pl-10 h-11 text-center text-xl tracking-[0.5em] font-mono rounded-xl focus:border-emerald-500 transition-all text-white"
                    />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 rounded-xl font-bold transition-all">
                    {loading ? <Loader2 className="animate-spin" /> : "Verify & Proceed"}
                </Button>
                <button 
                    type="button" 
                    onClick={() => { setStep('email'); setOtpInput(''); setIsError(false); }}
                    className="w-full text-xs text-gray-500 hover:text-white underline mt-2 transition-colors"
                >
                    Change Email Address
                </button>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;