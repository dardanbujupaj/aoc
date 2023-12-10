import { getInput } from "@/lib/aoc";
import { isAssertionError, time } from "@/lib/util";
import { equal } from "assert";
import { argv0 } from "process";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 9;

const SAMPLE_INPUT = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;
const SAMPLE_SOLUTION_PART_1 = 114;
const SAMPLE_SOLUTION_PART_2 = 2;

function parseInput(input: string) {
  return input
    .trim()
    .split("\n")
    .map((line) => line.split(" ").map(Number));
}

function extrapolate(data: number[]): number {
  if (data.every((value) => value === 0)) {
    return 0;
  }

  const derivate = data
    .map((value, index) => {
      if (index === 0) return 0;
      return value - data[index - 1];
    })
    .slice(1);

  return data[data.length - 1] + extrapolate(derivate);
}

function extrapolateBack(data: number[]): number {
  if (data.every((value) => value === 0)) {
    return 0;
  }

  const derivate = data
    .map((value, index) => {
      if (index === 0) return 0;
      return value - data[index - 1];
    })
    .slice(1);

  return data[0] - extrapolateBack(derivate);
}

function part1(input: string) {
  const data = parseInput(input);
  return data.map((d) => extrapolate(d)).reduce((acc, curr) => acc + curr, 0);
}

function part2(input: string) {
  const data = parseInput(input);

  return data
    .map((d) => extrapolateBack(d))
    .map((d) => {
      return d;
    })
    .reduce((acc, curr) => acc + curr, 0);
}

console.log(`AOC ${DAY} - ${YEAR}\n`);

try {
  const input = await getInput(DAY, YEAR);

  equal(part1(SAMPLE_INPUT), SAMPLE_SOLUTION_PART_1, "Part 1 sample wrong");
  console.log(`${time(() => part1(input), "Part 1")}`);

  equal(part2(SAMPLE_INPUT), SAMPLE_SOLUTION_PART_2, "Part 2 sample wrong");
  console.log(`${time(() => part2(input), "Part 2")}`);
} catch (error: unknown) {
  if (isAssertionError(error)) {
    console.error(
      `${error.message} (expected ${error.expected}, got ${error.actual})`,
    );
  } else if (isNativeError(error)) {
    console.error(error.message);
  } else {
    console.log(error);
  }
}
