import Stripe from 'stripe';
import { env } from '@/lib/env';

export const stripe = new Stripe(env.server.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

export const connectedAccountId = env.server.STRIPE_CONNECTED_ACCOUNT_ID;


