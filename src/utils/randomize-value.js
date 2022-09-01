export const randomizeValue = (value, delta =100) => {
  const multiplier = Math.random();
  const direction = Math.random() > 0.5;
  return value + delta * multiplier * (direction ? 1 : -1);
}
