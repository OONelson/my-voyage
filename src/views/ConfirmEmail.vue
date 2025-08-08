<!-- src/views/ConfirmEmail.vue -->
<template>
  <div>
    <h1>Confirm Your Email</h1>
    <p>Please check your email for a confirmation link</p>
    <button @click="resendConfirmation">Resend Email</button>
  </div>
</template>

<script setup lang="ts">
import { supabase } from "../config/supabase.ts";

const resendConfirmation = async () => {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: "user@example.com", // Get from route query or store
  });

  if (error) {
    console.error("Error resending email:", error);
  }
};
</script>
