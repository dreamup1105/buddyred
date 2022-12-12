export const getSearchCol = (itemLen: number, expand: boolean) => {
  const l = itemLen;
  if (expand) {
    return (4 - (l % 4)) * 6;
  }
  if (l < 4) {
    // return (4 - l) * 6;
    return 6;
  }
  return 6;
};
