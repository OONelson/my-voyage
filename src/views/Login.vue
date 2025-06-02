<template>
  <form
    @submit.prevent="handleLogin"
    className="h-screen flex flex-col justify-center items-start px-2"
  >
    <h3>{{ isLogin ? "Login" : "Sign Up" }}</h3>
    <input v-if="!isLogin" v-model="name" type="text" placeholder="Name" />
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />

    <ReusableButton
      :label="isLogin ? 'Login' : 'Sign Up'"
      class="flex justify-between items-center bg-accent"
    >
      <template #icon>
        <ArrowForward class="w-5 h-5" />
      </template>
    </ReusableButton>

    <button @click.prevent="loginWithGoogle">Login with Google</button>
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
import ArrowForward from "../assets/icons/ArrowForward.vue";

const name = ref<string>("");
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
