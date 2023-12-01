import assert from "assert";
import { getInput } from "../lib/aoc";
import { Grid } from "../lib/grid";

const input = await getInput(8, 2022);

const parseInput = (input: string) => {
  const lines = input.split("\n");
  return new Grid(
    lines[0].length,
    lines.length,
    lines.flatMap((l) => l.split("").map((n) => parseInt(n))),
  );
};

const part_1 = (input: string) => {
  const grid = parseInput(input);

  const visible = new Set<string>();

  for (let x = 0; x < grid.width; x++) {
    let currentHeight = -1;
    for (let y = 0; y < grid.height; y++) {
      const height = grid.get({ x, y });
      if (height > currentHeight) {
        visible.add(`${x}/${y}`);
        currentHeight = height;
      }
    }
    currentHeight = -1;
    for (let y = grid.height - 1; y >= 0; y--) {
      const height = grid.get({ x, y });
      if (height > currentHeight) {
        visible.add(`${x}/${y}`);
        currentHeight = height;
      }
    }
  }
  for (let y = 0; y < grid.height; y++) {
    let currentHeight = -1;
    for (let x = 0; x < grid.width; x++) {
      const height = grid.get({ x, y });
      if (height > currentHeight) {
        visible.add(`${x}/${y}`);
        currentHeight = height;
      }
    }
    currentHeight = -1;
    for (let x = grid.width - 1; x >= 0; x--) {
      const height = grid.get({ x, y });
      if (height > currentHeight) {
        visible.add(`${x}/${y}`);
        currentHeight = height;
      }
    }
  }
  const visibleGrid = Grid.withInitialValue(grid.width, grid.height, false);
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (visible.has(`${x}/${y}`)) {
        visibleGrid.set({ x, y }, true);
      }
    }
  }

  return `${visible.size}`;
};

const part_2 = (input: string) => {
  const grid = parseInput(input);

  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  let bestScore = 0;

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const height = grid.get({ x, y });
      let score = 1;
      for (const direction of directions) {
        const point = { x: x + direction.x, y: y + direction.y };
        let visibleTrees = 0;
        while (grid.contains(point)) {
          visibleTrees++;

          if (grid.get(point) >= height) {
            break;
          }

          point.x += direction.x;
          point.y += direction.y;
        }

        score *= visibleTrees;
      }

      bestScore = Math.max(bestScore, score);
    }
  }

  return `${bestScore}`;
};

const TEST_INPUT = `30373
25512
65332
33549
35390`;

assert.equal(part_1(TEST_INPUT), "21");
console.log(`Part 1: ${part_1(input)}`);

assert.equal(part_2(TEST_INPUT), "8");
console.log(`Part 2: ${part_2(input)}`);
