import { getInput } from "@/lib/aoc";
import { isAssertionError, time } from "@/lib/util";
import { equal } from "assert";
import { expect, it } from "bun:test";
import { reverse } from "dns";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 7;

const SAMPLE_INPUT = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;
const SAMPLE_SOLUTION_PART_1 = 6440;
const SAMPLE_SOLUTION_PART_2 = 5905;

const CARDS =
  [
    'A', 'K', 'Q', 'J',
    'T', '9', '8', '7',
    '6', '5', '4', '3',
    '2'
  ] as const

const CARDS_WITH_JOKER =
  [
    'A', 'K', 'Q',    'T', '9', '8', '7',
    '6', '5', '4', '3',
    '2', 'J'
  ] as const

function parseInput(input: string) {
  return input.trim().split("\n")
    .map((line) => {
      const [hand, bid] = line.split(" ")
      return {
        hand,
        bid: Number(bid)
      };
    });
}

function compareHand(a: string, b: string, withJoker = false) {
  const typeA = handType(a, withJoker)
  const typeB = handType(b, withJoker)
  if (typeA === typeB) {
    let cards = withJoker ? CARDS_WITH_JOKER : CARDS
    return a.split("").map(c => cards.indexOf(c as any).toString(16)).join("").localeCompare(b.split("").map(c => cards.indexOf(c as any).toString(16)).join(""))
  }
  return typeB - typeA
}

function handType(hand: string, withJoker: boolean) {
  if (withJoker) {
    hand = hand.replaceAll("J", "")
    if (hand.length === 0) return 50
  }

  const sortedByType = hand.split("")
    .sort()
    .join("")

  const sets = Array.from(sortedByType.matchAll(/(.)\1*/g))
    .map(([set]) => set.length)
    .sort()
    .reverse()

  return Number(`${sets[0] + (5 - hand.length)}${sets[1] ?? 0}`)
}



function part1(input: string) {
  const sortedHands = parseInput(input)
    .sort((a, b) => compareHand(a.hand, b.hand))

  return sortedHands
    .map(({ bid }, index, array) => bid * (array.length - index))
    .reduce((a, b) => a + b, 0)
}

function part2(input: string) {
  const sortedHands = parseInput(input)
    .sort((a, b) => compareHand(a.hand, b.hand, true))
  console.log("Sorted hands:")
  sortedHands.forEach(a => console.log(`${a.hand} ${handType(a.hand, true)}`))

  return sortedHands
    .map(({ bid }, index, array) => bid * (array.length - index))
    .reduce((a, b) => a + b, 0)

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
