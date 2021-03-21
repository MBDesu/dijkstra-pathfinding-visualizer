import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WallDraggingService {

  mouseButtonIsHeld: boolean;

  constructor() {
    this.mouseButtonIsHeld = false;
  }

  holdMouseButton(): void {
    this.mouseButtonIsHeld = true;
  }

  releaseMouseButton(): void {
    this.mouseButtonIsHeld = false;
  }

}
