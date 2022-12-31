export const gcd = (a: number, b: number): number => {
  return !b ? a : gcd(b, a % b);
};

export const lcm = (a: number, b: number) => {
  return (a * b) / gcd(a, b);
};

export const gauss = (n: number) => {
  (n * (n + 1)) / 2;
};
