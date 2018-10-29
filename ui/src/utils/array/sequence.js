export default function sequence(length, { increment = 1, start = 0 } = {}) {
  return Array.from({ length }, (_, i) => start + i * increment);
}
