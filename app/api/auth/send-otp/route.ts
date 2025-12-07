import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // 1. Random 6-digit Code එකක් හදමු
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. විනාඩි 5කින් කල් ඉකුත් වෙන (Expire) වෙලාවක් හදමු
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // 3. පරණ Codes මකලා අලුත් එක Save කරමු (Upsert or Insert)
    const { error: dbError } = await supabase
      .from('verification_codes')
      .insert([{ email, code, expires_at: expiresAt }]);

    if (dbError) {
        console.error(dbError);
        return NextResponse.json({ error: "Database Error" }, { status: 500 });
    }

    // 4. Email එක යවමු (Resend)
    const { error: emailError } = await resend.emails.send({
      from: 'Build With Live <auth@buildwithvideos.com>',
      to: email,
      subject: 'Your Verification Code - Build With Live',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
            <h2>Verify Your Email</h2>
            <p>Use the following code to complete your purchase:</p>
            <h1 style="color: #2563EB; letter-spacing: 5px;">${code}</h1>
            <p>This code will expire in 5 minutes.</p>
        </div>
      `
    });

    if (emailError) {
        return NextResponse.json({ error: "Email sending failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}