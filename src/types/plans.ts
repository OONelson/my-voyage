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
  features: string[] | string;
  featured: boolean;
  prices: StripePrice[];
}

export type Plan = {
  id: string;
  name: string;
  prices: string | number | StripePrice[];
  period?: string;
  description: string;
  features: string[] | string;
  featured: boolean;
  priceId?: string;
};
