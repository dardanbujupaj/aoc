import assert from "assert";
import { getInput } from "../lib/aoc";

const input = await getInput(13, 2022);

const parseInput = (input: string) =>
  input
    .trim()
    .split("\n\n")
    .map((pair) => pair.split("\n").map((line) => eval(line) as Packet));

type Packet = number[] | Packet[];

const assureArray = (element: Packet | number) =>
  typeof element === "number" ? [element] : element;

const compare = (left: Packet, right: Packet): number => {
  for (let i = 0; i < left.length; i++) {
    const leftElement = left[i];
    const rightElement = right[i];

    if (rightElement === undefined) {
      // right packet ran out of elements
      return 1;
    }

    if (typeof leftElement === "number" && typeof rightElement === "number") {
      if (leftElement !== rightElement) {
        return leftElement - rightElement;
      }
      continue;
    }

    const comparison = compare(
      assureArray(leftElement),
      assureArray(rightElement)
    );
    if (comparison !== 0) {
      return comparison;
    }
  }

  return right.length > left.length ? -1 : 0;
};

const part_1 = (input: string) => {
  const pairs = parseInput(input);

  let counter = 0;

  pairs.forEach((pair, index) => {
    const [left, right] = pair;
    if (compare(left, right) <= 0) {
      console.log(`${index + 1} correctly ordered: ${left} <= ${right}`);
      counter += index + 1;
    }
  });

  return `${counter}`;
};

const part_2 = (input: string) => {
  const sortedPackets = parseInput(input)
    .concat([[[2]], [[6]]])
    .flat()
    .sort(compare);

  const decoderKey =
    (sortedPackets.findIndex((packet) => compare(packet, [[2]]) === 0) + 1) *
    (sortedPackets.findIndex((packet) => compare(packet, [[6]]) === 0) + 1);

  return `${decoderKey}`;
};

const TEST_INPUT = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

assert.equal(part_1(TEST_INPUT), "13");
console.log(`Part 1: ${part_1(input)}`);

assert.equal(part_2(TEST_INPUT), "140");
console.log(`Part 2: ${part_2(input)}`);
