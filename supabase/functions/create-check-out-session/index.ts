import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2023-10-16",
});

// CORS headers configuration
const corsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
});



serve(async (req) => {
  const origin = req.headers.get("Origin");
  
  console.log(`Received ${req.method} request from origin: ${origin}`);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS preflight request");
    return new Response("ok", {
      status: 200,
      headers: corsHeaders(origin),
    });
  }
  // Set common headers for all responses
  const headers = {
    ...corsHeaders(origin),
    "Content-Type": "application/json",
  };

  try {
    // Only allow POST requests for the main functionality
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          headers,
          status: 405,
        }
      );
    }

    const body = await req.json();
    const { priceId, successUrl, cancelUrl } = body;

    console.log("Processing checkout session for priceId:", priceId);

    if (!priceId) {
      throw new Error("Price ID is required");
    }

    // Get the user from the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Use correct environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || Deno.env.get("PROJECT_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("ANON_KEY") || "";

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase configuration missing");
    }

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseKey,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError) {
      console.error("Auth error:", userError);
      throw new Error("Authentication failed");
    }

    if (!user) {
      throw new Error("User not authenticated");
    }

    console.log("User authenticated:", user.id);

    // Get or create Stripe customer
    let customerId: string;

    // Check if user already has a Stripe customer ID
    const { data: existingSubscription, error: subscriptionError } = await supabaseClient
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (subscriptionError) {
      console.log("No existing subscription found, creating new customer");
    }

    if (existingSubscription?.stripe_customer_id) {
      customerId = existingSubscription.stripe_customer_id;
      console.log("Using existing customer:", customerId);
    } else {
      // Create new Stripe customer
      console.log("Creating new Stripe customer for user:", user.email);
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;
      console.log("Created new customer:", customerId);

      // Store customer ID in database
      const { error: insertError } = await supabaseClient.from("subscriptions").insert({
        user_id: user.id,
        stripe_customer_id: customerId,
        status: "incomplete",
      });

      if (insertError) {
        console.error("Error storing customer ID:", insertError);
      }
    }

    // Create checkout session
    console.log("Creating Stripe checkout session");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      {
        headers,
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString() 
      }), 
      {
        headers,
        status: 400,
      }
    );
  }
});