import { getInput } from "@/lib/aoc";
import { isAssertionError, time } from "@/lib/util";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 12;

const SAMPLE_INPUT = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;
const SAMPLE_SOLUTION_PART_1 = 21;
const SAMPLE_SOLUTION_PART_2 = 525152;

function parseInput(input: string) {
  return input
    .trim()
    .split("\n")
    .map((line) => {
      const [conditionRecord, groups] = line.split(" ");

      return {
        conditionRecord,
        groups: groups.split(",").map(Number),
      };
    });
}

const INTACT = "[\\?\\.]";
const BROKEN = "[\\?\\#]";

function buildMatcher(groups: number[]) {
  const groupMatcher = groups
    .map((length) => `(${BROKEN}{${length}})`)
    .join(`${INTACT}+?`);
  return new RegExp(`^${groupMatcher}${INTACT}*$`);
}

function countArrangements(conditionRecord: string, groups: number[]) {
  const graph = groups.map((_, index, arr) => buildMatcher(arr.slice(index)));

  const cache = new Map<string, number>();
  function countState(offset: number, state: number) {
    if (state === graph.length) {
      if (conditionRecord.slice(offset).match(onlyIntactMatcher)) {
        return 1;
      }
      return 0;
    }

    const cacheKey = `${offset}-${state}`;

    const cachedResult = cache.get(cacheKey);

    if (cachedResult !== undefined) {
      return cachedResult;
    }

    let result = 0;

    const matcher = graph[state];

    const definitelyIntact = conditionRecord.slice(offset).match(/^\.+/)?.[0];
    if (definitelyIntact) {
      result += countState(offset + definitelyIntact[0].length, state);
    }

    if (conditionRecord.charAt(offset) === "?") {
      result += countState(offset + 1, state);
    }

    const match = conditionRecord.slice(offset).match(matcher)?.[1];

    if (match) {
      const newOffset = offset + match.length + 1;

      result += countState(newOffset, state + 1);
    }

    cache.set(cacheKey, result);

    return result;
  }

  return countState(0, 0);
}

const onlyIntactMatcher = /^[\?\.]*$/;

function part1(input: string) {
  const data = parseInput(input);

  return data
    .map(({ conditionRecord, groups }) =>
      countArrangements(conditionRecord, groups),
    )
    .reduce((a, b) => a + b, 0);
}

function part2(input: string) {
  const data = parseInput(input);

  return data
    .map(({ conditionRecord, groups }, index) => {
      const unfoldedRecord = [
        conditionRecord,
        conditionRecord,
        conditionRecord,
        conditionRecord,
        conditionRecord,
      ].join("?");
      const unfoldedGroups = [groups, groups, groups, groups, groups].flat();

      const count = countArrangements(unfoldedRecord, unfoldedGroups);
      return count;
    })
    .reduce((a, b) => a + b, 0);
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
