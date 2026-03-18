export const calcPercentage = (part, total) => {
  const safeTotal = Number(total || 0);
  if (!safeTotal) return 0;
  return Number(((Number(part || 0) / safeTotal) * 100).toFixed(1));
};
