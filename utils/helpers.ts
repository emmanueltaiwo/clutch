export const formatDate = (date: number): string => {
  const now = new Date();
  const msDiff = now.getTime() - date;
  const postDate = new Date(date);

  const secondsDiff = Math.floor(msDiff / 1000);
  const minutesDiff = Math.floor(secondsDiff / 60);
  const hoursDiff = Math.floor(minutesDiff / 60);

  if (minutesDiff < 1) {
    return "less than a minute ago";
  } else if (minutesDiff < 60) {
    return `${minutesDiff} ${minutesDiff === 1 ? "minute" : "minutes"} ago`;
  } else if (hoursDiff < 24) {
    return `${hoursDiff} ${hoursDiff === 1 ? "hour" : "hours"} ago`;
  } else {
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    return postDate.toLocaleDateString(undefined, options);
  }
};
