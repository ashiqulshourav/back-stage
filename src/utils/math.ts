
export const truncateDecimals = (number: number, decimalPlaces: number) => {
  const numberString = number.toString();
  const [integerPart, decimalPart] = numberString.split('.');
  const truncatedDecimalPart = decimalPart ? decimalPart.slice(0, decimalPlaces) : '';

  return `${integerPart}.${truncatedDecimalPart.padEnd(decimalPlaces, '0')}`;
};

export const addDecimals = (a: number, b: number) => {
  const precision = 10 ** 10;
  return (a * precision + b * precision) / precision;
};
