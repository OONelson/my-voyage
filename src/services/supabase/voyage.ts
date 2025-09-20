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
  voyage: FormDataType
): Promise<VoyageTypeInfo | null> => {
  if (!voyage) return null;

  try {
    const requiredFields = ["title", "location", "start_date", "end_date"];
    for (const field of requiredFields) {
      if (!voyage[field as keyof FormDataType]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User must be authenticated to create a voyage");
    }

    // Prepare data with user ID
    const voyageData = {
      ...voyage,
      user_id: user.id,
      created_at: new Date().toISOString(),
    };

    const { data, error: supabaseError } = await supabase
      .from("voyages")
      .insert([voyageData])
      .select()
      .single();

    if (supabaseError) throw supabaseError;

    return data;
  } catch (err) {
    console.error("Error creating voyage:", err);
    return null;
  }
};

export const updateVoyage = async (id: string, data: FormDataType) => {
  try {
    const { error: supabaseError } = await supabase
      .from("voyages")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (supabaseError) throw supabaseError;

    return true;
  } catch (err) {
    console.error("Error updating voyage:", err);
    return null;
  }
};

export const deleteVoyage = async (id: string): Promise<void> => {
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
