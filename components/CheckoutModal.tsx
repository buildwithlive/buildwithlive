'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CheckoutModal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');

  // 1. Email Check & Send OTP
  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        // A. Check Status
        const statusRes = await fetch('/api/auth/check-status', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
        const statusData = await statusRes.json();

        if (statusData.hasAccess) {
            alert("You already own this book! Redirecting to login...");
            router.push('/login');
            return;
        }

        // B. Send OTP
        const otpRes = await fetch('/api/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
        
        if (!otpRes.ok) throw new Error("Failed to send code.");

        setStep('otp');

    } catch (err: any) {
        setError("Connection failed. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  // 2. Verify OTP & Redirect to Checkout Page
  const handleVerifyOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
          const res = await fetch('/api/auth/verify-otp', {
              method: 'POST',
              body: JSON.stringify({ email, code: otpInput })
          });
          const data = await res.json();

          if (data.valid) {
              // Save email temporarily for the checkout page
              if (typeof window !== 'undefined') {
                  localStorage.setItem('checkout_email', email);
              }
              // Redirect to the new separate Payment Page
              router.push('/checkout');
          } else {
              setError("Invalid Code! Please try again.");
          }
          
      } catch (err) {
          setError("Verification failed.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-[#0a0a0a] border-white/10 text-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {step === 'email' ? "Get Started" : "Verify Email"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            {step === 'email' ? "Enter your email to verify eligibility." : `Code sent to ${email}`}
          </DialogDescription>
        </DialogHeader>

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={16} /> <span>{error}</span>
            </div>
        )}

        {step === 'email' ? (
            <form onSubmit={handleEmailCheck} className="space-y-4 py-2">
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                    <Input 
                        type="email" placeholder="you@example.com" required value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-900 border-gray-700 pl-10 h-11 rounded-xl text-white"
                    />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 h-11 rounded-xl">
                    {loading ? <Loader2 className="animate-spin" /> : <>Next <ArrowRight size={16} className="ml-2"/></>}
                </Button>
            </form>
        ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 py-2">
                <div className="relative">
                    <ShieldCheck className="absolute left-3 top-3 text-emerald-500" size={18} />
                    <Input 
                        type="text" placeholder="------" maxLength={6} required value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="bg-gray-900 border-gray-700 pl-10 h-11 text-center text-xl tracking-widest font-mono rounded-xl"
                    />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 rounded-xl">
                    {loading ? <Loader2 className="animate-spin" /> : "Verify & Proceed"}
                </Button>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;