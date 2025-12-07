import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    // 1. Database එකෙන් අන්තිමට එවපු Code එක ගන්න
    const { data, error } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .order('created_at', { ascending: false }) // අලුත්ම එක ගන්න
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ valid: false, message: "Invalid Code" });
    }

    // 2. කල් ඉකුත් වෙලාද බලන්න (Check Expiry)
    if (new Date(data.expires_at) < new Date()) {
        return NextResponse.json({ valid: false, message: "Code Expired" });
    }

    // 3. හරිනම්, පරණ කෝඩ්ස් මකලා දාන්න (Optional Cleaning)
    await supabase.from('verification_codes').delete().eq('email', email);

    return NextResponse.json({ valid: true });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}