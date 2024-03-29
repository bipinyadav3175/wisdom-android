const numberFormatter = (num: number): string => {
  // @ts-ignore
  if (typeof num !== 'number') {
    return '0';
  }

  if (num > 1000000000) {
    return Math.abs(num / 1000000000).toFixed(2) + 'B';
  }
  if (num > 1000000) {
    return Math.abs(num / 1000000).toFixed(2) + 'M';
  }
  if (num > 1000) {
    return Math.abs(num / 1000).toFixed(1) + 'K';
  }

  return num.toString();
};

export default numberFormatter;
