'use client';

import React, { useEffect, useState, Suspense } from 'react'; // Suspense Import කළා
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, BookOpen } from 'lucide-react';
import Link from 'next/link';

// 1. Logic එක වෙනම Component එකකට ගත්තා
function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [status, setStatus] = useState('verifying'); // verifying | success | error

  useEffect(() => {
    if (!orderId) return;

    // Verify Payment & Set Cookie
    const verifySession = async () => {
        try {
            const res = await fetch('/api/auth/set-session', {
                method: 'POST',
                body: JSON.stringify({ order_id: orderId })
            });
            
            if (res.ok) {
                setStatus('success');
                // Auto redirect after 3 seconds
                setTimeout(() => router.push('/reader'), 3000);
            } else {
                setStatus('error');
            }
        } catch (e) {
            setStatus('error');
        }
    };

    verifySession();
  }, [orderId, router]);

  return (
    <>
      {status === 'verifying' && (
        <>
            <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
            <h1 className="text-2xl font-bold">Verifying Payment...</h1>
        </>
      )}

      {status === 'success' && (
        <>
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-emerald-500" size={40} />
            </div>
            <h1 className="text-4xl font-bold mb-2">You're In!</h1>
            <p className="text-gray-400 mb-8">Payment successful. Redirecting to the book...</p>
            <Link href="/reader" className="px-8 py-3 bg-blue-600 rounded-full font-bold hover:bg-blue-700 transition flex items-center gap-2">
                <BookOpen size={20} /> Open Book Now
            </Link>
        </>
      )}

      {status === 'error' && (
        <>
             <h1 className="text-2xl font-bold text-red-500">Verification Pending</h1>
             <p className="text-gray-400 mt-2">We received your payment but are finalizing the setup.</p>
             <Link href="/login" className="mt-4 underline text-blue-400">Go to Login</Link>
        </>
      )}
    </>
  );
}

// 2. Main Page එකේ Suspense එක ඇතුලේ අර Component එක දැම්මා
export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white text-center p-4">
      <Suspense fallback={<Loader2 className="animate-spin text-blue-500" size={48} />}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}