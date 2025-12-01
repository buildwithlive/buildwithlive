'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, ShieldCheck, Mail } from 'lucide-react';

export default function LoginPage() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/check-status', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.hasAccess) {
        setStep('otp');
      } else {
        setError('No active purchase found. Please buy the book first.');
      }
    } catch (err) {
      setError('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (otp === "123456") {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });

        if (res.ok) {
            router.push('/reader');
        } else {
            setError('Login failed. Try again.');
        }
    } else {
        setError('Invalid Verification Code.');
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
            <Lock className="text-blue-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Member Login</h1>
          <p className="text-gray-400 text-sm mt-2">
            {step === 'email' ? "Access your purchased content." : "Enter the verification code."}
          </p>
        </div>

        {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                <input type="email" required placeholder="your@email.com" className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 pl-10 text-white focus:border-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : "Send Login Code"}
            </button>
            </form>
        ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 text-green-500" size={20} />
                <input type="text" required placeholder="123456" className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 pl-10 text-white focus:border-green-500 text-center text-xl tracking-widest" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : "Access Book"}
            </button>
            </form>
        )}
        
        <div className="mt-6 text-center">
            <a href="/" className="text-gray-500 text-xs hover:text-white transition-colors">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}