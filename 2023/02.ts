import { getInput } from "@/lib/aoc";
import { isAssertionError, time } from "@/lib/util";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 2;

const SAMPLE_INPUT = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;
const SAMPLE_SOLUTION_PART_1 = 8;
const SAMPLE_SOLUTION_PART_2 = 2286;

function parseInput(input: string) {
  return input.trim().split("\n")
    .map((line) => {
      const [id, description] = line.replace("Game ", "")
        .split(": ");

      const hands = description.split("; ").map((cubes) => {
        const hand: { red?: number, green?: number, blue?: number } = { red: undefined, green: undefined, blue: undefined }
        for (const cube of cubes.split(", ")) {
          const [count, color] = cube.split(" ") as [string, keyof typeof hand];

          hand[color] = parseInt(count)
        }
        return hand
      })
      return { id: parseInt(id), hands }
    })
}

function part1(input: string) {
  const redPool = 12
  const greenPool = 13
  const bluePool = 14

  const data = parseInput(input);


  return data.filter(({ id, hands }) => {
    for (const hand of hands) {
      if ((hand.red ?? 0) > redPool || (hand.green ?? 0) > greenPool || (hand.blue ?? 0) > bluePool) {
        return false
      }
    }

    return true
  })
    .reduce((acc, { id }) => acc + id, 0)
}

function part2(input: string) {
  const data = parseInput(input);

  return data.map(({ hands }) => {
    let pool = {
      red: 0,
      green: 0,
      blue: 0
    }

    for (const hand of hands) {
      if (hand.red && hand.red > pool.red) {
        pool.red = hand.red
      }
      if (hand.green && hand.green > pool.green) {
        pool.green = hand.green
      }
      if (hand.blue && hand.blue > pool.blue) {
        pool.blue = hand.blue
      }

    }

    return pool.red * pool.green * pool.blue
  })
    .reduce((acc, sum) => acc + sum, 0)

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
