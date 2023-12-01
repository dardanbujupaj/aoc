import { getInput } from "@/lib/aoc";
import { isAssertionError, time } from "@/lib/util";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 0;
const DAY = 0;

const SAMPLE_INPUT = ``;
const SAMPLE_SOLUTION_PART_1 = -1;
const SAMPLE_SOLUTION_PART_2 = -1;

function parseInput(input: string) {
  // TODO implement
  return input.trim().split("\n");
}

function part1(input: string) {
  const data = parseInput(input);

  // TODO implement
  return 0;
}

function part2(input: string) {
  const data = parseInput(input);

  // TODO implement
  return 0;
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
