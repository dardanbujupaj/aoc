import { getInput } from "../lib/aoc";

const input = await getInput(19, 2022);

const SAMPLE_INPUT = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`;

const RESOURCES = ["ore", "clay", "obsidian", "geode"].reverse();
type Resource = (typeof RESOURCES)[number];

type FactoryState = {
  minutes: number;
  resources: Record<Resource, number>;
  robots: Record<Resource, number>;
};

type Blueprint = Record<Resource, Record<Resource, number>>;

const numberRegex = /\d+/g;

function parseInput(input: string) {
  const blueprintDescriptions = input
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s !== "");

  const blueprints = blueprintDescriptions.map((description) => {
    const matches = Array.from(description.matchAll(numberRegex))
      .flat()
      .map((d) => parseInt(d));

    return {
      ore: {
        ore: matches[1],
        clay: 0,
        obsidian: 0,
        geode: 0,
      },
      clay: {
        ore: matches[2],
        clay: 0,
        obsidian: 0,
        geode: 0,
      },
      obsidian: {
        ore: matches[3],
        clay: matches[4],
        obsidian: 0,
        geode: 0,
      },
      geode: {
        ore: matches[5],
        clay: 0,
        obsidian: matches[6],
        geode: 0,
      },
    } satisfies Blueprint;
  });

  return blueprints;
}

function getPossibleStates(oldState: FactoryState, blueprint: Blueprint) {
  const baseState = structuredClone(oldState);
  baseState.minutes += 1;

  // update resources
  for (const resource of RESOURCES) {
    baseState.resources[resource] += oldState.robots[resource];
    // console.log(`${oldState.robots[resource]} ${resource}-collecting robot collects ${oldState.robots[resource]} ${resource}; you now have ${baseState.resources[resource]} ${resource}.`)
  }

  // one state is no robot built
  const states = [baseState];

  for (const resource of RESOURCES) {
    const cost = blueprint[resource];
    if (
      RESOURCES.every(
        (neededResource) =>
          oldState.resources[neededResource] >= cost[neededResource],
      )
    ) {
      // console.log(`Start building a ${resource}-collecting robot.`)
      // can build robot, so this is a possible state
      const state = structuredClone(baseState);

      state.robots[resource] += 1;
      for (const usedResource of RESOURCES) {
        state.resources[usedResource] -= cost[usedResource];
      }

      states.push(state);
    }
  }

  return states;
}

function hasExcessRobots(state: FactoryState, blueprint: Blueprint) {
  if (
    state.robots.ore >
    Math.max(
      blueprint.ore.ore,
      blueprint.clay.ore,
      blueprint.obsidian.ore,
      blueprint.geode.ore,
    )
  )
    return true;
  if (state.robots.clay > blueprint.obsidian.clay) return true;
  if (state.robots.obsidian > blueprint.geode.obsidian) return true;

  return false;
}

function estimateGeodes(state: FactoryState, untilMinute: number) {
  const remainingMinutes = untilMinute - state.minutes;

  return (
    state.resources.geode +
    (state.robots.geode + Math.floor(remainingMinutes / 2)) * remainingMinutes
  );
}

const INITIAL_STATE: FactoryState = {
  minutes: 0,
  resources: {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0,
  },
  robots: {
    ore: 1,
    clay: 0,
    obsidian: 0,
    geode: 0,
  },
};

function part1(input: string) {
  const blueprints = parseInput(input);

  const max = blueprints
    .map((b) => calculateMaxGeodes(b, 24))
    .map((v, i) => v * (i + 1))
    .reduce((a, b) => a + b, 0);

  return max;
}

function part2(input: string) {
  const blueprints = parseInput(input);

  const max = blueprints
    .slice(0, 3)
    .map((b) => calculateMaxGeodes(b, 32))
    .reduce((a, b) => a * b, 1);

  return max;
}

function calculateMaxGeodes(blueprint: Blueprint, time: number) {
  let visited = new Set<string>();

  let maxGeodes = 0;

  let stack = [INITIAL_STATE];

  while (stack.length > 0) {
    let state = stack.pop()!;

    const stateString = JSON.stringify(state);
    if (visited.has(stateString)) {
      continue;
    }

    visited.add(stateString);

    if (state.resources.geode > maxGeodes) {
      maxGeodes = state.resources.geode;
    }

    if (
      state.minutes < time &&
      estimateGeodes(state, time) > maxGeodes &&
      !hasExcessRobots(state, blueprint)
    ) {
      const nextStates = getPossibleStates(state, blueprint);

      stack.push(...nextStates);
    }
  }

  console.log(
    `Finished with ${maxGeodes} geodes (${visited.size} states checked)`,
  );
  return maxGeodes;
}

console.time("Part 1");
console.log(part1(input));
console.timeEnd("Part 1");

console.time("Part 2");
console.log(part2(input));
console.timeEnd("Part 2");
