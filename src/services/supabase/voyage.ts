import { supabase } from "@/config/supabase";
import type { FormDataType } from "@/types/formData";
import type { VoyageTypeInfo, Rating } from "@/types/voyage";

export const fetchVoyages = async (): Promise<VoyageTypeInfo[]> => {
  const { data, error: supabaseError } = await supabase
    .from("voyages")
    .select("*")
    .order("created_at", { ascending: true });

  if (supabaseError) throw supabaseError;

  return data || [];
};

export const fetchVoyageById = async (
  id: string | null
): Promise<VoyageTypeInfo | null> => {
  if (!id) return null;

  try {
    const { data, error: supabaseError } = await supabase
      .from("voyages")
      .select("*")
      .eq("id", id)
      .single();

    if (supabaseError) throw supabaseError;

    return data;
  } catch (err) {
    console.error("Error fetching voyage:", err);
    return null;
  }
};

export const createVoyage = async (
  voyage: FormDataType | null
): Promise<VoyageTypeInfo | null> => {
  if (!voyage) return null;

  try {
    const { data, error: supabaseError } = await supabase
      .from("voyages")
      .insert([voyage])
      .select()
      .single();

    if (supabaseError) throw supabaseError;

    return data;
  } catch (err) {
    console.error("Error creating voyage:", err);
    return null;
  }
};

export const deleteVoyage = async (id: string | null): Promise<void> => {
  if (!id) return;

  const { error: supabaseError } = await supabase
    .from("voyages")
    .delete()
    .eq("id", id);

  if (supabaseError) throw supabaseError;
};

export const searchVoyages = async (
  userId: string,
  query: string
): Promise<VoyageTypeInfo[]> => {
  try {
    const { data, error: supabaseError } = await supabase
      .from("voyages")
      .select("*")
      .eq("user_id", userId)
      .or(`title.ilike.%${query}%,location.ilike.%${query}%`)
      .order("created_at", { ascending: true });

    if (supabaseError) throw supabaseError;

    return data || [];
  } catch (err) {
    console.error("Error searching voyages:", err);
    return [];
  }
};

export const filterByRating = async (
  userId: string,
  rating: Rating
): Promise<VoyageTypeInfo[]> => {
  try {
    const { data, error: supabaseError } = await supabase
      .from("voyages")
      .select("*")
      .eq("user_id", userId)
      .eq("rating", rating)
      .order("created_at", { ascending: false });

    if (supabaseError) throw supabaseError;

    return data || [];
  } catch (err) {
    console.error("Error filtering voyages:", err);
    return [];
  }
};

// Clear the current error
export const clearError = () => {
  // This function is not directly related to the new_code,
  // but it's part of the original file.
  // Keeping it as is, but it might become redundant if error state is removed.
};
