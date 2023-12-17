export type Vector = {
  x: number;
  y: number;
};

export const add = (a: Vector, b: Vector) => ({
  x: a.x + b.x,
  y: a.y + b.y,
});

export const subtract = (a: Vector, b: Vector) => ({
  x: a.x - b.x,
  y: a.y - b.y,
});

export function dot(a: Vector, b: Vector) {
  return a.x * b.x + a.y * b.y;
}

export function multiply(a: Vector, b: number) {
  return { x: a.x * b, y: a.y * b };
}

export function mirror(a: Vector, b: Vector) {
  return subtract(a, multiply(b, 2 * dot(a, b) / dot(b, b)));
}

export const equals = (a: Vector, b: Vector) => a.x === b.x && a.y === b.y;

export const angle = (v: Vector) => {
  let angle = Math.atan2(v.y, v.x);

  if (angle < 0) return 2 * Math.PI + angle;
  return angle;
};

export const manhatten = (a: Vector, b: Vector) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
