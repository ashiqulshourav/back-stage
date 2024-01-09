export const disableDate = (date: Date) => {
  return new Date(date).getTime() + 1 * 24 * 3600 * 1000 < Date.now();
};
