import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_id, amount, currency } = body;

    const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchantId || !merchantSecret) {
      return NextResponse.json({ error: 'Merchant credentials missing' }, { status: 500 });
    }

    // 1. Format amount to 2 decimal places (Ex: 20.00)
    const formattedAmount = parseFloat(amount).toFixed(2);

    // 2. Hash the secret first (MD5 and Uppercase)
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    // 3. Create the final Hash string
    // Format: merchant_id + order_id + amount + currency + hashed_secret
    const hashString = `${merchantId}${order_id}${formattedAmount}${currency}${hashedSecret}`;

    // 4. Hash the final string
    const hash = crypto
      .createHash('md5')
      .update(hashString)
      .digest('hex')
      .toUpperCase();

    return NextResponse.json({ hash });
    
  } catch (error) {
    console.error('Hash generation error:', error);
    return NextResponse.json({ error: 'Failed to generate hash' }, { status: 500 });
  }
}