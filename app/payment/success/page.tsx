'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  
  useEffect(() => {
    // Set cookie on success (In a real scenario, the login API sets this securely, but for immediate access after redirect:)
    document.cookie = "auth_token=secure-access-granted; path=/; max-age=2592000"; // 30 Days
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
      <div className="bg-gray-900 border border-green-500/30 p-8 rounded-3xl text-center max-w-md shadow-2xl shadow-green-900/20">
        <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-400 mb-8">
          Thank you for joining. Your account has been created and your access is unlocked for 30 days.
        </p>
        
        <Link 
          href="/reader" 
          className="block w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all"
        >
          Start Reading Now
        </Link>
      </div>
    </div>
  );
}