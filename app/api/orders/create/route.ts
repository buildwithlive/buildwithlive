import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, order_id, amount } = body;

    // Insert pending order
    const { data, error } = await supabase
      .from('orders')
      .insert([
        { 
          order_id, 
          name, 
          email, 
          phone, 
          amount, 
          status: 'PENDING' 
        }
      ])
      .select();

    if (error) {
      console.error('DB Insert Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}