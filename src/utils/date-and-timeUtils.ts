import { formatDistanceToNow, formatDistance, isFuture } from "date-fns";
import { useUserProfile } from "@/composables/useUserProfile";

const { userData } = useUserProfile();

export const dateAndTime = () => {
  const relativeTripDate = (dates: [Date | string, Date | string]): string => {
    const [startDate, endDate] = dates.map((date) =>
      typeof date === "string" ? new Date(date) : date
    );

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

  const getJoinedAgo = (
    createdAt: string | null | undefined
  ): string | null => {
    if (!createdAt) return null;

    try {
      const date = new Date(createdAt);
      if (isNaN(date.getTime())) return null; // Invalid date

      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.warn("Error parsing date:", error);
      return null;
    }
  };

  const joinedAgo = getJoinedAgo(userData.value?.created_at);

  return {
    joinedAgo,
    relativeTripDate,
    relativeCreatedAt,
  };
};
