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

export class Grid<T> {
  width: number;
  height: number;
  data: T[];

  constructor(width: number, height: number, data: T[]) {
    this.width = width;
    this.height = height;
    this.data = data;
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
}
