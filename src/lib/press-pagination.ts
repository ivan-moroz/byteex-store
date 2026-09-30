export function pressPageSize(available: number, itemWidth: number, gap: number, total: number) {
  if (available <= 0 || itemWidth <= 0 || total <= 0) return 0;
  return Math.min(total, Math.max(0, Math.floor((available + gap) / (itemWidth + gap))));
}
