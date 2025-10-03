import { NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';

const Schema = z.object({
  projectId: z.string().min(1),
  invoiceId: z.string().min(1),
  amount: z.number().int().positive(), // amount in minor units (pence)
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, invoiceId, amount } = Schema.parse(body);

    const pi = await stripe.paymentIntents.create({
      amount,
      currency: 'gbp',
      metadata: { projectId, invoiceId, type: 'deposit' },
      transfer_group: projectId,
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: pi.client_secret, paymentIntentId: pi.id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to create PaymentIntent' }, { status: 400 });
  }
}


