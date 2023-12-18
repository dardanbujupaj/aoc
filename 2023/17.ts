import { getInput } from "@/lib/aoc";
import { Grid } from "@/lib/grid";
import { isAssertionError, time } from "@/lib/util";
import { add, equals } from "@/lib/vector";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 17;

const SAMPLE_INPUT = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;
const SAMPLE_SOLUTION_PART_1 = 102;
const SAMPLE_SOLUTION_PART_2 = 94;

function parseInput(input: string) {
  return Grid.parseWithMapper(input, Number);
}

const DIRECTIONS = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 },
} as const;

function opposite(direction: string) {
  switch (direction) {
    case "N":
      return "S";
    case "E":
      return "W";
    case "S":
      return "N";
    case "W":
      return "E";
  }
}

function part1(input: string) {
  const grid = parseInput(input);
  return findPath(grid, 1, 3);
}

function part2(input: string) {
  const grid = parseInput(input);

  return findPath(grid, 4, 10);
}

function findPath(
  grid: ReturnType<typeof parseInput>,
  minStraight: number,
  maxStraight: number,
) {
  const visited = new Set<string>();

  const queue = [{ position: { x: 0, y: 0 }, loss: 0, direction: "" }];

  while (queue.length > 0) {
    const { position, loss, direction } = queue.shift()!;

    if (equals(position, { x: grid.width - 1, y: grid.height - 1 })) {
      return loss;
    }

    const key = `${direction}${position.x},${position.y}`;

    if (visited.has(key)) continue;
    visited.add(key);

    for (const key in DIRECTIONS) {
      if (key === direction || key === opposite(direction)) continue;

      const newDirection = DIRECTIONS[key as keyof typeof DIRECTIONS];

      let nextLoss = loss;

      for (let i = 1; i <= maxStraight; i++) {
        const newPosition = add(position, {
          x: newDirection.x * i,
          y: newDirection.y * i,
        });
        if (!grid.contains(newPosition)) break;

        nextLoss += grid.get(newPosition);

        if (i < minStraight) continue;

        queue.splice(
          queue.findIndex((q) => q.loss > nextLoss),
          0,
          { position: newPosition, loss: nextLoss, direction: key },
        );
      }
    }
  }
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
