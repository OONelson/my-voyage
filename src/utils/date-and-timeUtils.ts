import { formatDistanceToNow, formatDistance, isFuture } from "date-fns";

export const dateAndTime = () => {
  const relativeTripDate = (dates: [Date | string, Date | string]) => {
    const [startDate, endDate] = dates.map((date) =>
      typeof date === "string" ? new Date(date) : date
    );

    const now = new Date();
    const isFutureTrip = isFuture(startDate);

    if (isFutureTrip) {
      return `in ${formatDistance(startDate, now)}`;
    } else {
      return `${formatDistanceToNow(endDate)} ago`;
    }
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
