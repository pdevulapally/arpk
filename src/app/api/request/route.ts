import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addDoc } from 'firebase/firestore';
import { cols } from '@/lib/firebase-collections';

const ContactSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

const Schema = z.object({
  projectType: z.string().optional(),
  goals: z.array(z.string()).optional(),
  pages: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  style: z.string().optional(),
  contentStatus: z.string().optional(),
  budgetRange: z.string().optional(),
  timelineTarget: z.string().optional(),
  uploads: z.array(z.string()).optional(),
  contact: ContactSchema,
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const result = Schema.safeParse(data);
    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: 'Validation failed', issues: result.error.flatten() },
        { status: 400 }
      );
    }

    const contact = {
      name: result.data.contact?.name ?? '',
      email: result.data.contact?.email ?? '',
      phone: result.data.contact?.phone ?? '',
    };

    await addDoc(cols.requests(), {
      ...result.data,
      contact,
      status: 'new',
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const code = err?.code || 'unknown';
    const msg = err?.message ?? 'Invalid request';
    // Return 200 with ok:false so the client can display a friendly message without throwing
    return NextResponse.json({ ok: false, error: msg, code });
  }
}


