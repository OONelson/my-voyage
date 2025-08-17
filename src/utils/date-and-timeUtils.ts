import { formatDistanceToNow, formatDistance, isFuture } from "date-fns";
import { useUserProfile } from "@/composables/useUserProfile";

const { userData } = useUserProfile();

export const dateAndTime = () => {
  const relativeTripDate = (dates: [Date | string, Date | string]): string => {
    // Convert string dates to Date objects if needed
    const [startDate, endDate] = dates.map((date) =>
      typeof date === "string" ? new Date(date) : date
    );

    // Calculate the duration between start and end dates
    const tripDuration = formatDistance(startDate, endDate);

    const now = new Date();
    const isFutureTrip = isFuture(startDate);

    if (isFutureTrip) {
      return ` ${tripDuration} trip (starts in ${formatDistance(
        startDate,
        now
      )})`;
    } else if (isFuture(endDate)) {
      return ` ${tripDuration} trip (ends in ${formatDistance(endDate, now)})`;
    } else {
      return ` ${tripDuration} trip (ended ${formatDistanceToNow(
        endDate
      )} ago)`;
    }
  };

  const relativeCreatedAt = (date: Date) => {
    return `${formatDistanceToNow(date)} ago`;
  };

  const createdAt = userData.value?.created_at;
  const joinedAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "Unknown";
  return {
    joinedAgo,
    relativeTripDate,
    relativeCreatedAt,
  };
};
