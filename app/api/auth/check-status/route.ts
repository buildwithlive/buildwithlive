import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // මේ ඊමේල් එකෙන් PAID order එකක් තියෙනවද බලනවා
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('email', email)
      .eq('status', 'PAID')
      .single();

    if (data) {
      return NextResponse.json({ hasAccess: true });
    } else {
      return NextResponse.json({ hasAccess: false });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Error checking status' }, { status: 500 });
  }
}