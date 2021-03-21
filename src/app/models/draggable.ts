export interface Draggable {
  cancelDrag(event: any): void;
  startDragging(event: any): void;
  mouseDown(event: any): void;
  mouseUp(event: any): void;
}