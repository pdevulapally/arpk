import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addDoc, doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { cols } from '@/lib/firebase-collections';
import { db } from '@/lib/firebase';

const Schema = z.object({
  requestId: z.string().min(1).optional(),
  userId: z.string().min(1).optional(),
  clientEmail: z.string().email().optional(),
  name: z.string().min(1),
  websiteType: z.string().optional(),
  features: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  budget: z.number().optional(),
  status: z.string().default('in-progress'),
  dueDate: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { requestId, userId: bodyUserId, clientEmail, name, websiteType, features, description, requirements, budget, status, dueDate } = Schema.parse(body);

    // Resolve userId by email if not provided
    let userId = bodyUserId;
    if (!userId && clientEmail) {
      const u = query(collection(db, 'users'), where('email', '==', clientEmail));
      const uSnap = await getDocs(u);
      if (!uSnap.empty) {
        userId = uSnap.docs[0].id;
      }
    }

    // Create project assigned to the user
    const projectRef = await addDoc(cols.projects(), {
      name,
      status: status || 'in-progress',
      userId: userId || undefined,
      clientEmail: clientEmail || undefined,
      progress: 0,
      dueDate: dueDate || '',
      websiteType: websiteType || '',
      features: features || '',
      description: description || '',
      requirements: requirements || '',
      budget: budget || 0,
    } as any);

    // Link back on the request (optional)
    if (requestId) {
      const reqSnap = await getDoc(doc(db, 'requests', requestId));
      if (!reqSnap.exists()) {
        return NextResponse.json({ ok: false, error: 'Request not found' }, { status: 404 });
      }
      await updateDoc(doc(db, 'requests', requestId), {
        projectId: projectRef.id,
        status: 'accepted',
      } as any);
    }

    return NextResponse.json({ ok: true, projectId: projectRef.id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to create project' }, { status: 400 });
  }
}


