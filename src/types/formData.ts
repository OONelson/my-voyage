export type FormDataType = {
  title: string;
  imageUrl: string;
  notes: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  startDate: Date | string;
  endDate: Date | string;
  rating: number;
};
