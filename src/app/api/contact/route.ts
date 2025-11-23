import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addDoc } from 'firebase/firestore';
import { cols } from '@/lib/firebase-collections';

const Schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  subject: z.string().optional(),
  message: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const parsed = Schema.parse(data);

    await addDoc(cols.contactSubmissions(), {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      subject: parsed.subject,
      message: parsed.message,
      status: 'new',
      source: 'site-contact',
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const msg = err?.message ?? 'Invalid request';
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}


