import { Point } from "./point";

export class Node {

  hasBeenVisited = false;
  isWall = false;
  isStartNode = false;
  isEndNode = false;
  inPath = false;
  row: number;
  col: number;
  distance = 9999999;
  previousNode!: Node | null;

  constructor(row: number, col: number, isStartNode = false, isEndNode = false) {
    this.row = row;
    this.col = col;
    this.isStartNode = isStartNode;
    this.isEndNode = isEndNode;
  }

  equals(point: Point): boolean {
    if (!point) return false;
    return this.row === point.row && this.col === point.col;
  }

  visit(): void {
    this.hasBeenVisited = true;
  }

  toggleWallState(): void {
    this.isWall = !this.isWall;
  }

  setPreviousNode(node: Node): void {
    this.previousNode = node;
  }

  resetState(): void {
    this.hasBeenVisited = false;
    this.previousNode = null;
    this.isWall = false;
    this.inPath = false;
    this.isStartNode = false;
    this.isEndNode = false;
    this.distance = 9999999;
  }

}