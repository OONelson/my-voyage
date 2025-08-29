export type Rating = 1 | 2 | 3 | 4 | 5;

export type VoyageTypeInfo = {
  id: number;
  image_url: string;
  title: string;
  notes: string;
  user_id: number;
  location: string;
  start_date: Date;
  end_date: Date;
  rating: Rating;
  comment?: string;
  created_at: Date;
  updated_at: Date;
};
