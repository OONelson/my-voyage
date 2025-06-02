import { supabase } from "../config/supabase";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import type { User } from "@supabase/supabase-js";

export const useAuth = () => {
  const user = ref<User | null>(null);
  const isLogin = ref<boolean>(true);
  const router = useRouter();

  const toggleAuth = (): void => {
    isLogin.value = !isLogin.value;
  };

  const isAuthenticated = computed(() => !!user.value);

  const setUser = (u: any) => {
    user.value = u;
  };

  const signUp = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    if (error) throw error;
    user.value = data.user;
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    user.value = data.user;
    router.push("/");
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    user.value = null;
    router.push("/login");
  };

  return {
    user,
    setUser,
    signUp,
    login,
    loginWithGoogle,
    logout,
    isLogin,
    isAuthenticated,
    toggleAuth,
  };
};
