import { supabase } from "@/config/supabase";

export const setupStorageBucket = async (): Promise<boolean> => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("Error checking buckets:", error);
      return false;
    }

    const voyageBucket = buckets?.find(
      (bucket) => bucket.name === "voyage-images" || "voyages"
    );

    if (!voyageBucket) {
      //   console.log(
      //     'Bucket "voyage-images" not found. Please create it manually in Supabase dashboard.'
      //   );
      //   console.log("Go to: Storage → Create Bucket");
      //   console.log("Name: voyage-images");
      //   console.log("Public: Yes");
      return false;
    }

    // console.log('✅ Storage bucket "voyage-images" is ready');
    return true;
  } catch (error) {
    console.error("Storage setup error:", error);
    return false;
  }
};
