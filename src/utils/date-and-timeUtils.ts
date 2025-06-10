import { formatDistanceToNow, formatDistance, isFuture } from "date-fns";

export const dateAndTime = () => {
  const relativeTripDate = (date: Date) => {
    const now = new Date();
    return isFuture(date)
      ? `in ${formatDistance(date, now)}` // "in 2 months"
      : `${formatDistanceToNow(date)} ago`; // "2 months ago"
  };

  // For creation date (always in past)
  const relativeCreatedAt = (date: Date) => {
    return `${formatDistanceToNow(date)} ago`;
  };

  return {
    relativeTripDate,
    relativeCreatedAt,
  };
};
