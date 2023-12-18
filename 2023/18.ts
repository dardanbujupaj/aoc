import { getInput } from "@/lib/aoc";
import { isAssertionError, time } from "@/lib/util";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 18;

const SAMPLE_INPUT = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`;
const SAMPLE_SOLUTION_PART_1 = 62;
const SAMPLE_SOLUTION_PART_2 = 952408144115;

const DIRECTIONS = ["R", "D", "L", "U"] as const;
type Direction = (typeof DIRECTIONS)[number];

const LINE_MATCHER = /([RLDU])\s+(\d+)\s+\((.*)\)/;

function parseInput(input: string) {
  return input
    .trim()
    .split("\n")
    .map((line) => {
      const [direction, distance, color] = line.match(LINE_MATCHER)!.slice(1);
      return {
        direction,
        distance: Number(distance),
        color,
      } as {
        direction: Direction;
        distance: number;
        color: `#${string}`;
      };
    });
}

function part1(input: string) {
  const data = parseInput(input);

  return calculateArea(data);
}

function part2(input: string) {
  const data = parseInput(input).map(({ color }) => {
    const distance = parseInt(color.slice(1, 6), 16);
    const direction = DIRECTIONS[Number(color.slice(6, 7))];
    return { direction, distance };
  });

  return calculateArea(data);
}

function calculateArea(data: { direction: Direction; distance: number }[]) {
  let area = 0;
  let position = { x: 0, y: 0 };

  for (const step of data) {
    const newPosition = { ...position };

    switch (step.direction) {
      case "R":
        newPosition.x += step.distance;
        break;
      case "L":
        newPosition.x -= step.distance;
        break;
      case "U":
        newPosition.y += step.distance;
        break;
      case "D":
        newPosition.y -= step.distance;
        break;
    }

    area +=
      ((newPosition.x - position.x) * (newPosition.y + position.y)) / 2 +
      step.distance / 2;
    position = newPosition;
  }

  return Math.abs(area) + 1;
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
