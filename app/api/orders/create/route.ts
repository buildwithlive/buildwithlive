import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, 
      email, 
      phone, 
      country,           // Aluth
      youtube_channel,   // Aluth
      is_google_drive_active, // Aluth
      order_id, 
      amount 
    } = body;

    // Insert pending order with new fields
    const { data, error } = await supabase
      .from('orders')
      .insert([
        { 
          order_id, 
          name, 
          email, 
          phone, 
          country,
          youtube_channel,
          is_google_drive_active,
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