export const disableDate = (date: Date) => {
  return new Date(date).getTime() + 1 * 24 * 3600 * 1000 < Date.now();
};

export const dateGetSecond = (timestamp: Date) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds;
};

const padZero = (n) => {
  return n < 10 ? '0' + n : n;
}

export const dateSetSecond = (secondNumber: number) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const seconds = secondNumber % 60;
  const minutes = Math.floor((secondNumber / 60) % 60);
  const hours = Math.floor(secondNumber / 3600);
  return `${year}-${padZero(month)}-${padZero(day)} ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
};
