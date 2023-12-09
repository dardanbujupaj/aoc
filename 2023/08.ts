import { getInput } from "@/lib/aoc";
import { isAssertionError, time } from "@/lib/util";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 8;

const SAMPLE_INPUT = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;
const SAMPLE_SOLUTION_PART_1 = 6;
const SAMPLE_SOLUTION_PART_2 = 6;


type Node = {
  id: string
  left: Node
  right: Node
  from: Node[]
}

function parseInput(input: string) {
  const [instructions, rawNodes] = input.trim().split("\n\n");

  const map = new Map<string, [string, string]>();
  const reverseMap = new Map<string, string[]>();

  for (const rawNode of rawNodes.split("\n")) {
    const [[id], [left], [right]] = rawNode.matchAll(/[12A-Z]{3}/g)
    map.set(id, [left, right])
    reverseMap.set(left, reverseMap.get(left)?.concat(id) ?? [id])
    reverseMap.set(right, reverseMap.get(right)?.concat(id) ?? [id])
  }

  return {
    instructions,
    map,
    reverseMap
  }
}


function part1(input: string) {
  const { instructions, map } = parseInput(input);

  let current = "AAA"

  let steps = 0

  while (current !== "ZZZ") {
    const [left, right] = map.get(current)!

    if (instructions[steps % instructions.length] === "L") {
      current = left
    } else {
      current = right
    }
    steps++
  }

  return steps;
}


function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  }

  return gcd(b, a % b);
}

function lcm(...numbers: number[]) {
  return numbers.reduce((a, b) => a * b / gcd(a, b));
}

function part2(input: string) {
  const { instructions, map } = parseInput(input);

  let current = Array.from(map.keys()).filter(key => key.endsWith("A"))

  const steps = current.map(key => {
    let k = key
    let i = 0

    do {
      const [left, right] = map.get(k)!

      if (instructions[i % instructions.length] === "L") {
        k = left
      } else {
        k = right
      }

      i++
    } while (!k.endsWith("Z"))

    return i
  })

  return lcm(...steps);
}

console.log(`AOC ${DAY} - ${YEAR}\n`);

try {
  const input = await getInput(DAY, YEAR);

  equal(part1(SAMPLE_INPUT), SAMPLE_SOLUTION_PART_1, "Part 1 sample wrong");
  console.log(`${time(() => part1(input), "Part 1")}`);

//   equal(part2(`LR
// 
// 11A = (11B, XXX)
// 11B = (XXX, 11Z)
// 11Z = (11B, XXX)
// 22A = (22B, XXX)
// 22B = (22C, 22C)
// 22C = (22Z, 22Z)
// 22Z = (22B, 22B)
// XXX = (XXX, XXX)`), SAMPLE_SOLUTION_PART_2, "Part 2 sample wrong");
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
