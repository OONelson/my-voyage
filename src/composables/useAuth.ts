import { supabase } from "../config/supabase";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import type {
  User,
  AuthError,
  AuthResponse,
  OAuthResponse,
} from "@supabase/supabase-js";

interface AuthCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials extends AuthCredentials {
  username: string;
}

export const useAuth = () => {
  const router = useRouter();
  const user = ref<User | null>(null);
  const isLogin = ref<boolean>(true);
  const isLoading = ref<boolean>(false);
  const error = ref<AuthError | null>(null);

  const toggleAuth = (): void => {
    isLogin.value = !isLogin.value;
    error.value = null;
  };

  const isAuthenticated = computed(() => !!user.value);

  const setUser = (u: User | null): void => {
    user.value = u;
  };

  const handleAuthResponse = (response: AuthResponse | OAuthResponse): void => {
    if ("user" in response.data) {
      user.value = response.data.user;
      router.push("/");
    }
  };

  const signUp = async ({
    username,
    email,
    password,
  }: SignUpCredentials): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });
      handleAuthResponse(response);
    } catch (err) {
      error.value = err as AuthError;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const login = async ({ email, password }: AuthCredentials): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      handleAuthResponse(response);
    } catch (err) {
      error.value = err as AuthError;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (response.error) throw response.error;
    } catch (err) {
      error.value = err as AuthError;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;
      await supabase.auth.signOut();
      user.value = null;
      router.push("/login");
    } catch (err) {
      error.value = err as AuthError;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchUser = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (authUser) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();
      user.value = data;
    }
  };

  const upgradeToPremium = async () => {
    await supabase
      .from("profiles")
      .update({ is_premium: true })
      .eq("id", user.value?.id);
    await fetchUser();
  };

  return {
    user,
    error,
    isLoading,
    isLogin,
    isAuthenticated,
    setUser,
    signUp,
    login,
    loginWithGoogle,
    logout,
    fetchUser,
    upgradeToPremium,
    toggleAuth,
  };
};
