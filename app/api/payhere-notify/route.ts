import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const merchant_id = formData.get('merchant_id')?.toString();
    const order_id = formData.get('order_id')?.toString();
    const payhere_amount = formData.get('payhere_amount')?.toString();
    const payhere_currency = formData.get('payhere_currency')?.toString();
    const status_code = formData.get('status_code')?.toString();
    const md5sig = formData.get('md5sig')?.toString();

    const secret = process.env.PAYHERE_MERCHANT_SECRET;

    // Verify Hash
    const hashedSecret = crypto.createHash('md5').update(secret!).digest('hex').toUpperCase();
    const amountFormatted = parseFloat(payhere_amount!).toFixed(2);
    
    const generatedHash = crypto
      .createHash('md5')
      .update(`${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`)
      .digest('hex')
      .toUpperCase();

    if (generatedHash !== md5sig) {
      return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });
    }

    // If Payment Success (Status 2)
    if (status_code === '2') {
        // Update Order Status to PAID
        const { error } = await supabase
            .from('orders')
            .update({ status: 'PAID' })
            .eq('order_id', order_id);

        if (error) {
            console.error('DB Update Error:', error);
            return NextResponse.json({ error: "DB Error" }, { status: 500 });
        }
    }

    return NextResponse.json({ message: "Payment Notified" });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}