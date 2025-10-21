import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    const formattedProducts = products.data.map((product) => {
      const defaultPrice = product.default_price as Stripe.Price;

      return {
        id: product.id,
        name: product.name,
        description: product.description || "",
        featured: product.metadata.featured === "true",
        features: product.metadata.features
          ? product.metadata.features.split(",")
          : [],
        prices: [
          {
            id: defaultPrice.id,
            amount: (defaultPrice.unit_amount || 0) / 100,
            currency: defaultPrice.currency,
            interval: defaultPrice.recurring?.interval,
            intervalCount: defaultPrice.recurring?.interval_count,
          },
        ],
      };
    });

    return new Response(JSON.stringify({ products: formattedProducts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
