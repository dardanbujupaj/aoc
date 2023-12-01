import { AssertionError } from "assert";
import { isNativeError } from "util/types";

export function gcd(a: number, b: number): number {
  return !b ? a : gcd(b, a % b);
};

export function lcm(a: number, b: number) {
  return (a * b) / gcd(a, b);
};

export function gauss(n: number) {
  (n * (n + 1)) / 2;
};

export function range(from: number, to: number) {
  const difference = to - from;
  const sign = Math.sign(difference);

  return Array.from(
    { length: Math.abs(difference) + 1 },
    (_, index) => from + index * sign,
  );
}

export function time<TReturn>(fn: () => TReturn, label = "time") {
  const start = Bun.nanoseconds();
  const result = fn();
  const end = Bun.nanoseconds();

  const ms = (end - start) / 1_000_000;

  console.log(`${label}: ${ms}ms`);

  return result;
}

export function isAssertionError(error: unknown): error is AssertionError {
  return (
    isNativeError(error) && "code" in error && error.code === "ERR_ASSERTION"
  );
}
