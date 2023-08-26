import { Vector } from "./vector";

export type Point = Vector;

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

  get(point: Point) {
    return this.data[point.y * this.width + point.x];
  }

  set(point: Point, value: T) {
    this.data[point.y * this.width + point.x] = value;
  }

  contains(point: Point) {
    return (
      point.x >= 0 &&
      point.x < this.width &&
      point.y >= 0 &&
      point.y < this.height
    );
  }
}
