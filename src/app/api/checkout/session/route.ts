import { NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';

const Schema = z.object({
  projectId: z.string().min(1),
  invoiceId: z.string().optional(),
  amount: z.number().int().positive(), // pence
  label: z.string().optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, invoiceId, amount, label, successUrl, cancelUrl } = Schema.parse(body);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_intent_data: {
        metadata: { projectId, invoiceId: invoiceId || '' },
        transfer_group: projectId,
      },
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: amount,
            product_data: {
              name: label || 'Project Payment',
              description: `Invoice ${invoiceId || ''}`.trim(),
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/projects/${projectId}?paid=1`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/projects/${projectId}?canceled=1`,
      metadata: { projectId, invoiceId: invoiceId || '' },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to create checkout session' }, { status: 400 });
  }
}


