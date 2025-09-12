import { supabase } from "@/config/supabase";
import { useVoyageManager } from "@/composables/useVoyageManager";
import type { FormDataType } from "@/types/formData";

const { voyages, error, isLoading } = useVoyageManager();

export const fetchVoyages = async () => {
  const { data, error: supabaseError } = await supabase
    .from("voyages")
    .select("*")
    .order("created_at", { ascending: true });

  if (supabaseError) throw supabaseError;

  return data;
};

export const fetchVoyageById = async (id: string | null) => {
  try {
    isLoading.value = false;
    error.value = null;

    const { data, error: supabaseError } = await supabase
      .from("voyages")
      .select("*")
      .eq("id", id)
      .single();

    if (supabaseError) throw supabaseError;

    return data;
  } catch (err) {}
};
export const createVoyage = async (voyage: FormDataType | null) => {
  try {
    const { data, error: supabaseError } = await supabase
      .from("voyages")
      .insert([voyage])
      .select();

    if (supabaseError) throw supabaseError;
    return data;
  } catch (err: any) {
    error.value = err.message;
  }
};

// export const updateVoyage= async(id: string | number)

export const deleteVoyage = async (id: string | null) => {
  const { error: supabaseError } = await supabase
    .from("voyages")
    .delete()
    .eq("id", id);

  if (supabaseError) throw supabaseError;
};

// export const toggleFavourite = async (id: string, isFavourite: boolean) => {
//   return await updateVoyage(id, { isFavourite });
// };

export const searchVoyages = async (userId: string, query: string) => {
  try {
    isLoading.value = true;
    error.value = null;

    const { data, error: supabaseError } = await supabase
      .from("voyages")
      .select("*")
      .eq("user_id", userId)
      .or(`title.ilike.%${query}%,location.ilike.%${query}%`)
      .order("created_at", { ascending: true });

    if (supabaseError) throw supabaseError;

    voyages.value = data || [];
    return data;
  } catch (err) {
    error.value = err.message;
    console.error("Error searching voyages:", err);
    return null;
  } finally {
    isLoading.value = false;
  }
};

export const filterByRating = async (userId: string, rating: Rating) => {
  try {
    loading.value = true;
    error.value = null;

    const { data, error: supabaseError } = await supabase
      .from("voyages")
      .select("*")
      .eq("user_id", userId)
      .eq("rating", rating)
      .order("created_at", { ascending: false });

    if (supabaseError) throw supabaseError;

    voyages.value = data || [];
    return data;
  } catch (err) {
    error.value = err.message;
    console.error("Error filtering voyages:", err);
    return null;
  } finally {
    isLoading.value = false;
  }
};

// Clear the current error
export const clearError = () => {
  error.value = null;
};
