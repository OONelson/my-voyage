<template>
  <form
    @submit.prevent="handleLogin"
    className="flex flex-col justify-center items-start  px-2 h-full w-full"
  >
    <div class="py-3 cursor-pointer">
      <ArrowBack fillColor="textblack300" />
    </div>
    <section class="sm:flex justify-center items-center h-full sm:w-full">
      <div class="sm:bg-white sm:p-4 sm:shadow-md">
        <div class="flex flex-col justify-start items-start mb-10">
          <Logo />
          <h3 class="text-textblack300 font-semibold">Welcome back</h3>
          <span class="text-md"> Sign into your Account </span>
        </div>

        <ReusableInput
          v-model="email"
          type="email"
          label="Email"
          placeholder="Enter Email"
        />
        <div class="relative">
          <ReusableInput
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            label="Password"
            showPasswordToggle
            placeholder="Enter Password"
          />
          <ReusableButton
            type="button"
            id="togglePassword"
            @click="togglePasswordVisibility"
            class="absolute inset-y-0 right-10 flex items-center px-3 text-gray-700 hover:text-gray-700"
          />
        </div>

        <div class="flex justify-center items-center">
          <ReusableButton
            type="submit"
            :disabled="loading"
            :label="loading ? 'Logging in' : 'Login'"
            class="flex justify-center items-center gap-1 bg-accent100 hover:bg-accent200 w-full sm:max-w-[150px] py-2 my-2"
          />
        </div>

        <div class="flex justify-center items-center my-4">
          <div
            class="flex-grow w-[130px] xs:w-[150px] sm:w-[100px] border-t border-border200"
          />
          <span class="mx-4 text-sm text-gray-500 uppercase">or</span>
          <div
            class="flex-grow w-[120px] xs:w-[150px] sm:w-[100px] border-t border-border200"
          />
        </div>

        <div class="flex justify-center items-center">
          <button
            @click.prevent="loginWithGoogle"
            class="flex justify-center items-center w-full bg-white py-2 border border-border100 rounded-lg mt-2 px-3 sm:max-w-[200px] gap-2"
          >
            <GoogleIcon />
            <span class="text-textblack100 sm:text-accent100 font-medium">
              Login with Google
            </span>
          </button>
        </div>

        <span
          class="flex justify-center items-center gap-1 mt-4 text-center text-sm"
        >
          Don't have an account?
          <router-link
            to="/signup"
            class="text-accent100 font-medium underline"
          >
            Sign Up
          </router-link>
        </span>
      </div>
    </section>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ArrowBack from "@/assets/icons/ArrowBack.vue";
import GoogleIcon from "@/assets/icons/GoogleIcon.vue";
import Logo from "@/assets/icons/Logo.vue";
import ReusableButton from "@/components/ui/ReusableButton.vue";
import ReusableInput from "@/components/ui/ReusableInput.vue";
import { useAuth } from "@/composables/useAuth";

const showPassword = ref(false);

const { loading, email, password, handleLogin, loginWithGoogle } = useAuth();

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>
