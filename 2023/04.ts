import { getInput } from "@/lib/aoc";
import { isAssertionError, time } from "@/lib/util";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 4;

const SAMPLE_INPUT = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;
const SAMPLE_SOLUTION_PART_1 = 13;
const SAMPLE_SOLUTION_PART_2 = 30;

function parseInput(input: string) {
  return input
    .trim()
    .split("\n")
    .map((line) => {
      return line
        .split(/[\:\|]/g)
        .slice(1)
        .map((numbers) =>
          numbers
            .trim()
            .split(/\s+/)
            .map((n) => parseInt(n)),
        );
    });
}

function part1(input: string) {
  const data = parseInput(input);

  const values = data.map(([winning, actual]) => {
    const matching = winning.filter((n) => actual.includes(n));
    if (matching.length > 0) {
      return Math.pow(2, matching.length - 1);
    } else {
      return 0;
    }
  });

  return values.reduce((a, b) => a + b, 0);
}

function part2(input: string) {
  const data = parseInput(input);

  const maxMatches = data[0][0].length;

  const copies = data
    .map(([winning, actual]) => ({
      matches: winning.filter((n) => actual.includes(n)).length,
      copies: 1,
    }))
    .map((_, index, array) => {
      for (let i = Math.max(index - maxMatches, 0); i < index; i++) {
        if (i + array[i].matches >= index) {
          array[index].copies += array[i].copies;
        }
      }
      return array[index].copies;
    });

  return copies.reduce((a, b) => a + b, 0);
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
