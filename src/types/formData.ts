export type FormDataType = {
  title: string;
  imageUrls: string[];
  notes: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  startDate: Date | string;
  endDate: Date | string;
  rating: number;
  pins?: { display_name: string; lat: number; lon: number }[];
};
