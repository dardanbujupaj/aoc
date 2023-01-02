export type Vector = {
  x: number
  y: number
}

export const add = (a: Vector, b: Vector) => (
  {
    x: a.x + b.x, 
    y: a.y + b.y
  }
);

export const equals = (a: Vector, b: Vector) => (
  a.x === b.x && a.y === b.y
);
