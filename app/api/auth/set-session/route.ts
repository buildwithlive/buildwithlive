import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { order_id } = await req.json();

  // 1. Check if Order is PAID
  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', order_id)
    .eq('status', 'PAID')
    .single();

  if (!data) {
    return NextResponse.json({ error: "Order not paid yet" }, { status: 400 });
  }

  // 2. Set Cookie
  const cookieStore = await cookies();
  cookieStore.set('auth_token', 'secure-access-granted', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 Days
    path: '/',
  });

  return NextResponse.json({ success: true });
}