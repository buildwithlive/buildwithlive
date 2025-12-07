import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Check if user has a PAID order
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('email', email)
      .eq('status', 'PAID')
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'No active subscription found.' }, { status: 401 });
    }

    // Success: Create Cookie
    const response = NextResponse.json({ success: true });
    
    // Set Secure Cookie (30 Days)
    response.cookies.set('auth_token', 'secure-access-granted', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 Days
      path: '/',
    });

    return response;

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}