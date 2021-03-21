import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Draggable } from 'src/app/models/draggable';
import { Node } from 'src/app/models/node';
import { WallDraggingService } from 'src/app/services/wall-dragging.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeComponent implements OnInit, Draggable {

  @Input('node') node!: Node;
  @Output('dropped') dropped: EventEmitter<{ previousNodeData: any, newNodeData: Node }> = new EventEmitter<{ previousNodeData: any, newNodeData: Node }>();
  @ViewChild('nodeElement', { static: true }) nodeElement!: ElementRef;
  isTerminalNode!: boolean;

  constructor(private wallDraggingService: WallDraggingService, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.setTerminalState();
  }

  cancelDrag(event: Event): void {
    this.runChangeDetection();
    event.preventDefault();
  }

  startDragging(event: any): void {
    event.dataTransfer.setData('text', JSON.stringify(this.node));
    event.data = this.node;
  }
  
  mouseDown(event: Event): void {
    this.wallDraggingService.holdMouseButton();
    if (this.isTerminalNode) {
      this.wallDraggingService.releaseMouseButton();
      event.stopPropagation();
      return;
    }
    this.toggleWallState();
  }

  dragWall(): void {
    if (this.wallDraggingService.mouseButtonIsHeld && !this.isTerminalNode) {
      this.toggleWallState();
    }
  }
  
  mouseUp(event: any): void {
    try {
      this.wallDraggingService.releaseMouseButton();
      const data = event.dataTransfer.getData('text');
      this.dropped.emit({
        previousNodeData: JSON.parse(data),
        newNodeData: this.node,
      });
    } catch(e) {
      return;
    }
  }

  private toggleWallState(): void {
    if (!this.isTerminalNode) {
      this.node.isWall = !this.node.isWall;
    }
  }

  setTerminalState(): void {
    this.isTerminalNode = this.node.isStartNode || this.node.isEndNode;
  }

  runChangeDetection(): void {
    this.changeDetectorRef.markForCheck();
  }

}
