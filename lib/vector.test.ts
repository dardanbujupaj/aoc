import { expect, test } from "bun:test";
import { angle, mirror } from "./vector";

test("basic angles", () => {
  expect(angle({ x: 1, y: 0 })).toBe(0);
  expect(angle({ x: 0, y: 1 })).toBe(Math.PI / 2);
  expect(angle({ x: -1, y: 0 })).toBe(Math.PI);
  expect(angle({ x: 0, y: -1 })).toBe((Math.PI / 2) * 3);
  expect(angle({ x: 1, y: -0.0001 })).toBeCloseTo(Math.PI * 2);
});

test("mirroring", () => {
  expect(mirror({ x: 1, y: 1 }, { x: 1, y: 0 })).toEqual({ x: -1, y: 1 });
});
