'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        if (step === 'email') {
            // 1. Check if user is PAID member
            const statusRes = await fetch('/api/auth/check-status', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
            const { hasAccess } = await statusRes.json();

            if (!hasAccess) {
                throw new Error("No active subscription found. Please buy the book first.");
            }

            // 2. Send OTP
            const otpRes = await fetch('/api/auth/send-otp', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
            if (!otpRes.ok) throw new Error("Failed to send OTP.");

            setStep('otp');
        } else {
            // 3. Verify OTP & Set Session Cookie
            const verifyRes = await fetch('/api/auth/verify-login', {
                method: 'POST',
                body: JSON.stringify({ email, code: otp })
            });
            const data = await verifyRes.json();

            if (!verifyRes.ok) throw new Error(data.error || "Invalid Code");

            // Success!
            router.push('/reader');
        }
    } catch (err: any) {
        setError(err.message || "Something went wrong.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl shadow-2xl">
        <Link href="/" className="text-gray-500 hover:text-white flex items-center gap-2 mb-6 text-sm">
            <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 className="text-2xl font-bold text-white mb-2">Member Login</h1>
        <p className="text-gray-400 mb-6 text-sm">Access your purchased content securely.</p>

        {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm mb-4 border border-red-500/20">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
                {step === 'email' ? (
                    <>
                        <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                        <Input 
                            placeholder="Enter your email" type="email" required
                            className="pl-10 bg-gray-900 border-gray-700 text-white h-12"
                            value={email} onChange={e => setEmail(e.target.value)}
                        />
                    </>
                ) : (
                    <>
                        <ShieldCheck className="absolute left-3 top-3 text-emerald-500" size={18} />
                        <Input 
                            placeholder="Enter 6-digit code" type="text" maxLength={6} required
                            className="pl-10 bg-gray-900 border-gray-700 text-white h-12 text-center text-xl tracking-widest"
                            value={otp} onChange={e => setOtp(e.target.value)}
                        />
                    </>
                )}
            </div>

            <Button disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold text-lg">
                {loading ? <Loader2 className="animate-spin" /> : (step === 'email' ? "Continue" : "Verify & Login")}
            </Button>
        </form>
      </div>
    </div>
  );
}