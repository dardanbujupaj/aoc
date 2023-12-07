import { getInput } from "@/lib/aoc";
import { isAssertionError, time } from "@/lib/util";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 6;

const SAMPLE_INPUT = `Time:      7  15   30
Distance:  9  40  200`;
const SAMPLE_SOLUTION_PART_1 = 288;
const SAMPLE_SOLUTION_PART_2 = 71503;

function parseInput(input: string) {
  const [times, distances] = input
    .trim()
    .split("\n")
    .map((line) => {
      return line.split(/\s+/).slice(1).map(Number);
    });

  return Array.from({ length: times.length }, (_, i) => ({
    time: times[i],
    distance: distances[i],
  }));
}

function calculateRange(time: number, distance: number) {
  const min = (time - Math.sqrt(time ** 2 - 4 * distance)) / 2;
  const max = (time + Math.sqrt(time ** 2 - 4 * distance)) / 2;

  const min_ceil = Number.isSafeInteger(min) ? min + 1 : Math.ceil(min);
  const max_floor = Number.isSafeInteger(max) ? max - 1 : Math.floor(max);

  return max_floor - min_ceil + 1;
}

function part1(input: string) {
  const data = parseInput(input);
  return data
    .map(({ time, distance }) => calculateRange(time, distance))
    .reduce((a, b) => a * b);
}

function part2(input: string) {
  const data = parseInput(input);

  const { time, distance } = data.reduce((a, b) => ({
    time: parseInt(a.time.toString() + b.time.toString()),
    distance: parseInt(a.distance.toString() + b.distance.toString()),
  }));

  return calculateRange(time, distance);
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
