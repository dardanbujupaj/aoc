import { expect, test } from "bun:test";
import { angle } from "./vector";

test("basic angles", () => {
  expect(angle({ x: 1, y: 0 })).toBe(0);
  expect(angle({ x: 0, y: 1 })).toBe(Math.PI / 2);
  expect(angle({ x: -1, y: 0 })).toBe(Math.PI);
  expect(angle({ x: 0, y: -1 })).toBe((Math.PI / 2) * 3);
  expect(angle({ x: 1, y: -0.0001 })).toBeCloseTo(Math.PI * 2);
});
