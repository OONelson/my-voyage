import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  getCurrentUser,
  getUserProfile,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut,
} from "@/services/supabase/auth";
import type { UserProfile } from "@/types/user";
import { AuthError } from "@supabase/supabase-js";

export const useAuth = () => {
  const router = useRouter();
  const user = ref<UserProfile | null>(null);
  const loading = ref<boolean>(true);
  const name = ref<string>("");
  const email = ref<string>("");
  const password = ref<string>("");
  const error = ref<AuthError | null>(null);

  const checkAuth = async () => {
    loading.value = true;
    try {
      const authUser = await getCurrentUser();
      if (authUser) {
        user.value = await getUserProfile(authUser.id);
        return true;
      }
      return false;
    } finally {
      loading.value = false;
    }
  };

  const redirectBasedOnAuth = async () => {
    const isAuthenticated = await checkAuth();
    if (isAuthenticated) {
      router.push("/voyages");
    } else {
      router.push("/login");
    }
  };

  onMounted(async () => {
    await checkAuth();
  });

  // signUp
  const handleSignup = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { user, error: authError } = await signUpWithEmail(
        email.value,
        password.value,
        name.value
      );

      if (authError) throw authError;
      if (user) {
        await redirectBasedOnAuth();
      }
    } catch (err) {
      error.value = err as AuthError;
    } finally {
      loading.value = false;
    }
  };

  // Login
  const handleLogin = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { user, error: authError } = await signInWithEmail(
        email.value,
        password.value
      );

      if (authError) throw authError;
      if (user) {
        await redirectBasedOnAuth();
      }
    } catch (err) {
      error.value = err as AuthError;
    } finally {
      loading.value = false;
    }
  };

  // login with google
  const loginWithGoogle = async () => {
    try {
      loading.value = true;
      await signInWithGoogle();
      loading.value = false;
    } catch (err) {
      error.value = err as AuthError;
      throw err;
    }
  };

  //logout
  const handleLogout = async () => {
    try {
      loading.value = true;
      await signOut();

      user.value = null;
      await router.push("/login");
      loading.value = false;
    } catch (err) {
      error.value = err as AuthError;
      throw err;
    }
  };

  return {
    user,
    loading,
    name,
    email,
    password,
    checkAuth,
    handleSignup,
    handleLogin,
    loginWithGoogle,
    handleLogout,
    redirectBasedOnAuth,
  };
};
