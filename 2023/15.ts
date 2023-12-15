import { getInput } from "@/lib/aoc";
import { isAssertionError, time } from "@/lib/util";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 15;

const SAMPLE_INPUT = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;
const SAMPLE_SOLUTION_PART_1 = 1320;
const SAMPLE_SOLUTION_PART_2 = 145;

function parseInput(input: string) {
  return input.trim().split(",");
}

function part1(input: string) {
  const data = parseInput(input);

  return data.map(hash).reduce((a, b) => a + b, 0);
}

const instructionMatcher = /([a-z]+)([=-])(\d)?/;
function part2(input: string) {
  const data = parseInput(input);

  const boxes: { label: string; focalLength: number }[][] = Array.from(
    { length: 256 },
    () => [],
  );

  data
    .map((instruction) => instruction.match(instructionMatcher)!.slice(1))
    .forEach(([label, operation, focalLength]) => {
      const box = boxes[hash(label)];
      const existingIndex = box.findIndex((box) => box.label === label);
      if (operation === "=") {
        if (existingIndex !== -1) {
          box.splice(existingIndex, 1, {
            label,
            focalLength: Number(focalLength),
          });
        } else {
          box.push({ label, focalLength: Number(focalLength) });
        }
      } else {
        if (existingIndex !== -1) {
          box.splice(existingIndex, 1);
        }
      }
    });

  return boxes
    .map((box, boxNumber) => {
      return box.reduce((accumulator, lens, index) => {
        const lensValue = (boxNumber + 1) * (index + 1) * lens.focalLength;
        return accumulator + lensValue;
      }, 0);
    })
    .reduce((a, b) => a + b, 0);
}

function hash(input: string) {
  let currentValue = 0;
  for (const char of input) {
    currentValue += char.charCodeAt(0);
    currentValue *= 17;
    currentValue %= 256;
  }
  return currentValue;
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
