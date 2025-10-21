import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { supabase } from "@/config/supabase";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export interface Price {
  id: string;
  product_id: string;
  unit_amount: number;
  currency: string;
  recurring?: {
    interval: "month" | "year";
  };
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  features: string[];
  prices: Price[];
}

export interface SubscriptionStatus {
  status: "active" | "canceled" | "past_due" | "trialing" | "inactive";
  current_period_end?: string;
  price_id?: string;
  isLegacy?: boolean;
}

export class StripeService {
  private static instance: StripeService;
  private stripe: Stripe | null = null;

  private constructor() {}

  static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  async initialize(): Promise<Stripe | null> {
    if (!this.stripe) {
      this.stripe = await stripePromise;
    }
    return this.stripe;
  }

  async createCheckoutSession(
    priceId: string
  ): Promise<{ sessionId: string; url?: string }> {
    const { data, error } = await supabase.functions.invoke(
      "create-check-out-session",
      {
        body: {
          priceId,
          successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/pricing`,
        },
      }
    );

    console.log(priceId);

    if (error) {
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }

    return data;
  }

  async createCustomerPortalSession(): Promise<string> {
    const { data, error } = await supabase.functions.invoke(
      "create-customer-portal",
      {
        body: {
          returnUrl: `${window.location.origin}/account`,
        },
      }
    );

    if (error) {
      throw new Error(`Failed to create portal session: ${error.message}`);
    }

    return data.url;
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    const stripe = await this.initialize();
    if (!stripe) {
      throw new Error("Stripe failed to initialize");
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      throw new Error(`Checkout redirect failed: ${error.message}`);
    }
  }

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    const { data, error } = await supabase.functions.invoke(
      "get-subscription-status"
    );

    if (error) {
      console.warn("Failed to get subscription status:", error);
      return { status: "inactive" };
    }

    return data;
  }
}

export const stripeService = StripeService.getInstance();
