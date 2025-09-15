<template>
  <form
    @submit.prevent="handleLogin"
    className="flex flex-col justify-center items-start px-2 h-full w-full bg-background100 dark:bg-dark-background100 min-h-screen transition-colors"
  >
    <div class="py-3 cursor-pointer">
      <ArrowBack fillColor="textblack300" />
    </div>
    <section class="sm:flex justify-center items-center h-full sm:w-full">
      <div
        class="sm:bg-white dark:sm:bg-dark-background100 sm:p-4 sm:shadow-md dark:sm:shadow-lg sm:rounded-lg sm:border dark:sm:border-dark-border100"
      >
        <div class="flex flex-col justify-start items-start mb-10">
          <Logo />
          <h3
            class="text-textblack300 dark:text-dark-textblack200 font-semibold"
          >
            Welcome back
          </h3>
          <span class="text-md text-gray-600 dark:text-dark-text">
            Sign into your Account
          </span>
        </div>

        <div class="space-y-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-dark-textblack100 mb-1"
              >Email</label
            >
            <ReusableInput
              v-model="email"
              type="email"
              placeholder="Enter Email"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-dark-textblack100 mb-1"
              >Password</label
            >
            <ReusableInput
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Enter Password"
            />
          </div>
        </div>

        <div class="flex justify-center items-center mt-6">
          <ReusableButton
            type="submit"
            :disabled="loading"
            :label="loading ? 'Logging in...' : 'Login'"
            variant="primary"
            class="w-full sm:max-w-[150px]"
            :loading="loading"
          />
        </div>

        <div class="flex justify-center items-center my-4">
          <div
            class="flex-grow w-[130px] xs:w-[150px] sm:w-[100px] border-t border-border200 dark:border-dark-border100"
          ></div>
          <span class="mx-3 text-gray-500 dark:text-dark-textblack50 text-sm"
            >OR</span
          >
          <div
            class="flex-grow w-[130px] xs:w-[150px] sm:w-[100px] border-t border-border200 dark:border-dark-border100"
          ></div>
        </div>

        <div class="flex justify-center items-center">
          <ReusableButton
            @click="handleGoogleSignIn"
            :disabled="loading"
            variant="outline"
            class="flex justify-center items-center gap-2 w-full sm:max-w-[200px]"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </ReusableButton>
        </div>

        <div class="flex justify-center items-center my-5">
          <span class="text-gray-600 dark:text-dark-text text-sm">
            Don't have an account?
            <router-link
              to="/signup"
              class="text-accent100 dark:text-dark-accent100 hover:text-accent200 dark:hover:text-dark-accent200 font-medium underline transition-colors"
            >
              Sign up
            </router-link>
          </span>
        </div>

        <div
          v-if="error"
          class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-md"
        >
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>
      </div>
    </section>
  </form>
</template>

<script setup lang="ts">
import ArrowBack from "@/assets/icons/ArrowBack.vue";
import Logo from "@/assets/icons/Logo.vue";
import GoogleIcon from "@/assets/icons/GoogleIcon.vue";
import ReusableButton from "@/components/ui/ReusableButton.vue";
import ReusableInput from "@/components/ui/ReusableInput.vue";
import { useAuth } from "@/composables/useAuth";
import { ref } from "vue";

const { email, password, loading, error, handleLogin, handleGoogleSignIn } =
  useAuth();

const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>
