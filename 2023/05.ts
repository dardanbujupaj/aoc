import { getInput } from "@/lib/aoc";
import { isAssertionError, time } from "@/lib/util";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 5;

const SAMPLE_INPUT = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;
const SAMPLE_SOLUTION_PART_1 = 35;
const SAMPLE_SOLUTION_PART_2 = 46;

function parseInput(input: string) {
  const [[seeds], ...maps] = input
    .split(/\s*[a-z- ]+:\s*/)
    .filter((s) => s.length > 0)
    .map((s) => s.split("\n").map((s) => s.split(/\s+/).map(Number)));

  return {
    seeds,
    maps,
  };
}

function convertSeed(seed: number, maps: number[][][]) {
  let result = seed;
  for (const map of maps) {
    for (const [destination, source, range] of map) {
      if (result >= source && result < source + range) {
        result += destination - source;
        break;
      }
    }
  }

  return result;
}

function part1(input: string) {
  const { seeds, maps } = parseInput(input);

  const locations = seeds.map((s) => convertSeed(s, maps));

  return Math.min(...locations);
}

function part2(input: string) {
  const { seeds, maps } = parseInput(input);

  let minSeed = Number.MAX_SAFE_INTEGER;

  /**
   * this should be forbidden, but i don't have time to implement a solution using the ranges
   * and it only took 15 minutes to run...
   */
  for (let i = 0; i < seeds.length; i += 2) {
    console.log(`range ${i}`);
    for (let s = seeds[i]; s < seeds[i] + seeds[i + 1]; s++) {
      minSeed = Math.min(minSeed, convertSeed(s, maps));
    }
  }

  return minSeed;
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
