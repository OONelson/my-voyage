<template>
  <form @submit.prevent="handleLogin">
    <card card-border>
      <h3>{{ isLogin ? "Login" : "Sign Up" }}</h3>
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {{ isLogin ? "Login" : "Sign Up" }}
      </button>

      <button @click.prevent="loginWithGoogle">Login with Google</button>
    </card>
    <p class="mt-4 text-center text-sm">
      {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
      <button @click="toggleAuth" class="text-blue-500 underline">
        {{ isLogin ? "Sign up" : "Login" }}
      </button>
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";

const email = ref<string>("");
const password = ref<string>("");

const { login, loginWithGoogle, isLogin, toggleAuth } = useAuth();

const handleLogin = async (): Promise<void> => {
  try {
    await login(email.value, password.value);
  } catch (e: unknown) {
    if (e instanceof Error) {
      alert(e.message);
    } else {
      alert("An unknown error occurred.");
    }
  }
};
</script>
