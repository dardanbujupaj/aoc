import assert from "assert";
import { getInput } from "../lib/aoc";
import { Grid } from "../lib/grid";
import { add, equals } from "../lib/vector";

const input = await getInput(14, 2022);

const ENTRY_POINT = { x: 500, y: 0 };

enum BlockType {
  AIR,
  STONE,
  SAND,
}

const parseInput = (input: string, withFloor = false) => {
  const grid = Grid.withInitialValue(1000, 500, BlockType.AIR);

  let height = 0;

  input
    .trim()
    .split("\n")
    .forEach((wallDefinition) => {
      wallDefinition
        .split(" -> ")
        .map((s) => ({
          x: parseInt(s.split(",").at(0)!),
          y: parseInt(s.split(",").at(1)!),
        }))
        .forEach((point, index, array) => {
          height = Math.max(height, point.y);

          if (index === 0) {
            return;
          }
          const lastPoint = array[index - 1];

          const from = lastPoint;
          const to = point;

          const step = {
            x: Math.sign(to.x - from.x),
            y: Math.sign(to.y - from.y),
          };

          for (let p = from; !equals(p, add(to, step)); p = add(p, step)) {
            grid.set(p, BlockType.STONE);
          }
        });
    });

  if (withFloor) {
    for (let x = 0; x < grid.width; x++) {
      grid.set({ x, y: height + 2 }, BlockType.STONE);
    }
  }

  return grid;
};

const print = (grid: Grid<BlockType>) => {
  let output = "";
  for (let y = 0; y < 200; y++) {
    for (let x = 420; x < 580; x++) {
      switch (grid.get({ x, y })) {
        case BlockType.AIR:
          output += ".";
          break;
        case BlockType.STONE:
          output += "#";
          break;
        case BlockType.SAND:
          output += "o";
          break;
        default:
          output += "?";
      }
    }
    output += "\n";
  }
  console.log(output);
};

const DOWN = { x: 0, y: 1 };
const DOWN_LEFT = { x: -1, y: 1 };
const DOWN_RIGHT = { x: 1, y: 1 };

const simulateBlock = (grid: Grid<BlockType>) => {
  let sandPosition = ENTRY_POINT;

  while (sandPosition.y < grid.height - 1) {
    if (grid.get(add(sandPosition, DOWN)) === BlockType.AIR) {
      sandPosition = add(sandPosition, DOWN);
    } else if (grid.get(add(sandPosition, DOWN_LEFT)) === BlockType.AIR) {
      sandPosition = add(sandPosition, DOWN_LEFT);
    } else if (grid.get(add(sandPosition, DOWN_RIGHT)) === BlockType.AIR) {
      sandPosition = add(sandPosition, DOWN_RIGHT);
    } else {
      grid.set(sandPosition, BlockType.SAND);
      return sandPosition;
    }
  }

  // block out of bounds
  return;
};

const part_1 = (input: string) => {
  const grid = parseInput(input);
  let count = 0;
  while (simulateBlock(grid)) {
    count++;
  }
  return `${count}`;
};

const part_2 = (input: string) => {
  const grid = parseInput(input, true);

  let count = 0;
  do {
    count++;
  } while (!equals(simulateBlock(grid)!, { x: 500, y: 0 }));

  return `${count}`;
};

const TEST_INPUT = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

assert.equal(part_1(TEST_INPUT), "24");
console.log(`Part 1: ${part_1(input)}`);

assert.equal(part_2(TEST_INPUT), "93");
console.log(`Part 2: ${part_2(input)}`);
