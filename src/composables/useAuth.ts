import { ref } from "vue";
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

export const useAuth = () => {
  const router = useRouter();
  const user = ref<UserProfile | null>(null);
  const loading = ref<boolean>(false);
  const name = ref<string>("");
  const email = ref<string>("");
  const password = ref<string>("");
  const error = ref<string | null>(null);

  const checkAuth = async () => {
    loading.value = true;
    error.value = null;
    try {
      const authUser = await getCurrentUser();
      if (authUser) {
        const profile = await getUserProfile(authUser.id);
        user.value = profile;
        return true;
      }
      return false;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Authentication failed";
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

  // signUp
  const handleSignup = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { user: authUser, error: authError } = await signUpWithEmail(
        email.value,
        password.value,
        name.value
      );

      console.log("4", user);
      if (authError) {
        if (authError.message?.toLowerCase().includes("already registered")) {
          error.value = "Email already registered";
        } else {
          error.value = authError.message || "Signup failed";
        }
        return;
      }

      if (!authUser || !authUser.id) {
        error.value = "Signup failed: No user returned";
        return;
      }

      const profile = await getUserProfile(authUser.id);
      user.value = profile;

      router.push({
        path: "/auth/confirm",
        query: {
          email: email.value,
        },
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Signup failed";
    } finally {
      loading.value = false;
    }
  };

  // Login
  const handleLogin = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { user: authUser, error: authError } = await signInWithEmail(
        email.value,
        password.value
      );

      if (authError) throw authError;
      if (authUser) {
        const profile = await getUserProfile(authUser.id);
        user.value = profile;
        await redirectBasedOnAuth();
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Login failed";
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
      error.value =
        err instanceof Error ? err.message : "Signing in with Google failed";
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
      error.value = err instanceof Error ? err.message : "Logout failed";
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
