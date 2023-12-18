import { Vector } from "./vector";

type GridType = Uint8Array | Uint16Array | Uint32Array;

export class TypedGrid<T extends GridType> {
  width: number;
  height: number;
  data: T;

  constructor(width: number, height: number, data: T) {
    this.width = width;
    this.height = height;
    this.data = data;
  }

  get(point: Vector) {
    return this.data[point.y * this.width + point.x];
  }

  set(point: Vector, value: number) {
    this.data[point.y * this.width + point.x] = value;
  }

  contains(point: Vector) {
    return (
      point.x >= 0 &&
      point.x < this.width &&
      point.y >= 0 &&
      point.y < this.height
    );
  }
}

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
    ? []
    : S extends `${infer T}${D}${infer U}`
      ? [T, ...Split<U, D>]
      : [S];

export class Grid<T> {
  width: number;
  height: number;
  data: T[];

  constructor(width: number, height: number, data: T[]) {
    this.width = width;
    this.height = height;
    this.data = data;
  }

  static parse<TInput extends string, T>(input: TInput) {
    const lines = input.trim().split("\n");

    const width = lines[0].length;
    const height = lines.length;

    const data = lines.flatMap(
      (line) =>
        line.split("") as Split<Split<TInput, "\n">[number], "">[number][],
    );

    return new Grid(width, height, data);
  }

  static parseWithMapper<T>(input: string, mapper: (cell: string) => T) {
    const lines = input.trim().split("\n");

    const width = lines[0].length;
    const height = lines.length;

    const data = lines.flatMap((line) => line.split("").map((c) => mapper(c)));

    return new Grid(width, height, data);
  }

  static withInitialValue<T>(width: number, height: number, initialValue: T) {
    const data = Array.from(Array(width * height)).map((_) => initialValue);
    return new Grid(width, height, data);
  }

  get(point: Vector) {
    return this.data[point.y * this.width + point.x];
  }

  set(point: Vector, value: T) {
    this.data[point.y * this.width + point.x] = value;
  }

  contains(point: Vector) {
    return (
      point.x >= 0 &&
      point.x < this.width &&
      point.y >= 0 &&
      point.y < this.height
    );
  }

  toString(cellMapper?: (cell: T) => string) {
    let result = "";
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const value = this.get({ x, y });

        result += cellMapper?.(value) ?? value;
      }
      result += "\n";
    }

    return result;
  }
}

export function get8Neighbours(point: Vector) {
  return [
    { x: point.x - 1, y: point.y - 1 },
    { x: point.x, y: point.y - 1 },
    { x: point.x + 1, y: point.y - 1 },
    { x: point.x - 1, y: point.y },
    { x: point.x + 1, y: point.y },
    { x: point.x - 1, y: point.y + 1 },
    { x: point.x, y: point.y + 1 },
    { x: point.x + 1, y: point.y + 1 },
  ];
}

export function get4Neighbours(point: Vector) {
  return [
    { x: point.x, y: point.y - 1 },
    { x: point.x - 1, y: point.y },
    { x: point.x + 1, y: point.y },
    { x: point.x, y: point.y + 1 },
  ];
}
