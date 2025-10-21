export type Plan = {
  id: string;
  name: string;
  prices: string | number;
  period: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: string;
};

export interface StripePrice {
  id: string;
  amount: number;
  currency: string;
  interval?: string;
  intervalCount?: number;
}

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  features: string[];
  featured: boolean;
  prices: StripePrice[];
}
