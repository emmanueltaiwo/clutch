import {
  differenceInMinutes,
  differenceInSeconds,
  formatDistanceToNow,
} from "date-fns";

export const formatDate = (date: Date): string => {
  const now = new Date();

  const minutesDiff = differenceInMinutes(now, date);
  const secondsDiff = differenceInSeconds(now, date);

  if (minutesDiff < 1) {
    return "less than a minute ago";
  } else if (minutesDiff < 60) {
    return `${minutesDiff} ${minutesDiff === 1 ? "minute" : "minutes"} ago`;
  } else if (secondsDiff < 3600) {
    return `${Math.floor(minutesDiff / 60)} ${
      Math.floor(minutesDiff / 60) === 1 ? "hour" : "hours"
    } ago`;
  } else {
    return formatDistanceToNow(date, { addSuffix: true });
  }
};
