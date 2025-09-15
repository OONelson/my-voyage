export type FormDataType = {
  title: string;
  image_urls: string[];
  notes: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  start_date: Date | string;
  end_date: Date | string;
  rating: number;
  pins?: { display_name: string; lat: number; lon: number }[];
};
