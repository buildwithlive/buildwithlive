import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    // 1. Verify OTP
    const { data: otpData, error: otpError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .single();

    if (otpError || !otpData) {
      return NextResponse.json({ error: "Invalid Code" }, { status: 400 });
    }

    // 2. Check Expiry
    if (new Date(otpData.expires_at) < new Date()) {
        return NextResponse.json({ error: "Code Expired" }, { status: 400 });
    }

    // 3. Verify Payment Status (Double Check)
    const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('email', email)
        .eq('status', 'PAID')
        .single();

    if (!orderData) {
        return NextResponse.json({ error: "No active subscription" }, { status: 403 });
    }

    // 4. Delete OTP & Set Cookie
    await supabase.from('verification_codes').delete().eq('email', email);

    // Set Cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', 'secure-access-granted', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 Days
        path: '/',
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}