import { getInput } from "@/lib/aoc";
import { isAssertionError, time } from "@/lib/util";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 1;

const SAMPLE_INPUT = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;
const SAMPLE_INPUT_2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;
const SAMPLE_SOLUTION_PART_1 = 142;
const SAMPLE_SOLUTION_PART_2 = 281;

const STRING_MATCHERS = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

function parseInput(input: string, matchStrings = false) {
  return input
    .trim()
    .split("\n")
    .map((line) => {
      const numbers = [];

      for (let i = 0; i < line.length; i++) {
        const digit = parseInt(line.at(i)!);
        if (!isNaN(digit)) {
          numbers.push(digit);
        } else if (matchStrings) {
          const slice = line.slice(i);

          const match = STRING_MATCHERS.findIndex((matcher) =>
            slice.startsWith(matcher),
          );
          if (match !== -1) {
            numbers.push(match + 1);
          }
        }
      }
      return numbers;
    });
}

function part1(input: string) {
  const data = parseInput(input);

  return data.reduce((acc, numbers) => {
    return acc + (numbers[0] * 10 + numbers[numbers.length - 1]);
  }, 0);
}

function part2(input: string) {
  const data = parseInput(input, true);

  return data.reduce((acc, numbers) => {
    return acc + (numbers[0] * 10 + numbers[numbers.length - 1]);
  }, 0);
}

console.log(`AOC ${DAY} - ${YEAR}\n`);

try {
  const input = await getInput(DAY, YEAR);

  equal(part1(SAMPLE_INPUT), SAMPLE_SOLUTION_PART_1, "Part 1 sample wrong");
  console.log(`${time(() => part1(input), "Part 1")}`);

  equal(part2(SAMPLE_INPUT_2), SAMPLE_SOLUTION_PART_2, "Part 2 sample wrong");
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
