export type Rating = 1 | 2 | 3 | 4 | 5;

export type VoyageTypeInfo = {
  id: number;
  imageUrl: string;
  title: string;
  notes: string;
  user_id: number;
  location: string;
  date: Date;
  rating: Rating;
  comment?: string;
  createdAt: Date;
};
