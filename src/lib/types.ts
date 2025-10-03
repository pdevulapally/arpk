export type ContactSubmission = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  status?: 'new' | 'read' | 'converted';
  createdAt?: unknown;
  leadId?: string;
  source?: string;
};

export type RequestDoc = {
  projectType?: string;
  goals?: string[];
  pages?: string[];
  features?: string[];
  style?: string;
  contentStatus?: string;
  budgetRange?: string;
  timelineTarget?: string;
  uploads?: string[];
  contact: { name: string; email: string; phone?: string };
  createdAt?: unknown;
  status?: 'new' | 'qualified' | 'quoted' | 'won' | 'lost';
  quoteId?: string;
  clientId?: string;
};

export type Project = {
  title: string;
  clientId: string;
  status:
    | 'brief'
    | 'design'
    | 'build'
    | 'qa'
    | 'review'
    | 'handover'
    | 'paused'
    | 'complete';
  milestones?: Array<{ id: string; title: string; done?: boolean; dueAt?: unknown }>;
  quoteId?: string;
  transferGroup?: string;
  createdAt?: unknown;
};

export type Invoice = {
  projectId: string;
  type: 'deposit' | 'final' | 'addon';
  amount: number;
  currency: 'gbp';
  stripePaymentIntentId?: string;
  paid?: boolean;
  paidAt?: unknown;
  createdAt?: unknown;
};

export type UserDoc = {
  role: 'client' | 'admin';
  name: string;
  email: string;
  stripeCustomerId?: string;
  stripeConnectId?: string;
  createdAt?: unknown;
};


