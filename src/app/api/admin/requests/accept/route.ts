import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { cols } from '@/lib/firebase-collections';
import { db } from '@/lib/firebase';

const Schema = z.object({
  requestId: z.string().min(1),
  // Optional overrides
  name: z.string().optional(),
  status: z.string().optional(),
  dueDate: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { requestId, name, status, dueDate } = Schema.parse(body);

    const reqSnap = await getDoc(doc(db, 'requests', requestId));
    if (!reqSnap.exists()) {
      return NextResponse.json({ ok: false, error: 'Request not found' }, { status: 404 });
    }
    const r = reqSnap.data() as any;

    // Create project based on request fields
    const projectRef = await addDoc(cols.projects(), {
      name: name || r.projectType || 'Project',
      status: status || 'in-progress',
      userId: r.userId || undefined,
      clientEmail: r.contact?.email || r.clientEmail || undefined,
      progress: 0,
      dueDate: dueDate || r.timelineTarget || '',
      websiteType: r.projectType || '',
      features: Array.isArray(r.features) ? r.features.join(', ') : '',
      description: r.style || '',
      requirements: Array.isArray(r.pages) ? r.pages.join(', ') : '',
      budget: 0,
    } as any);

    // Link request -> project and mark accepted
    await updateDoc(doc(db, 'requests', requestId), {
      projectId: projectRef.id,
      status: 'accepted',
    } as any);

    return NextResponse.json({ ok: true, projectId: projectRef.id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to accept request' }, { status: 400 });
  }
}


