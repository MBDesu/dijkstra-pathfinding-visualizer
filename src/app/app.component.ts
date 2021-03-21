import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NodeComponent } from './components/node/node.component';
import { Djikstra } from './models/djikstra';
import { Node } from './models/node';
import { Point } from './models/point';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  numRows = 25;
  numCols = 50;
  startNode: Point = { row: 10, col: 14 };
  endNode: Point = { row: 8, col: 44 };

  nodes: Array<Array<Node>> = [];

  @ViewChildren('nodeComponents') nodeComponents!: QueryList<NodeComponent>;

  ngOnInit(): void {
    this.initializeNodes();
  }

  start(): void {
    const djikstra = new Djikstra();
    const visitedNodes = djikstra.start(this.nodes, (this.startNode as Node), (this.endNode as Node));

    for (let i = 0; i < visitedNodes.length; i++) {
      this.nodeComponents.forEach((component: NodeComponent) => {
        if (component.node.equals(visitedNodes[i])) {
          setTimeout(() => {
            component.runChangeDetection();
          }, 5 * i);
        }
      });
    }

    let lastNode: Node | null = visitedNodes[visitedNodes.length - 1];
    while (lastNode) {
      lastNode.inPath = true;
      lastNode = lastNode.previousNode;
    }

    const totalTime = 5 * (visitedNodes.length - 1);

    setTimeout(() => {
      let i = 0;
      this.nodeComponents.forEach((nodeComponent: NodeComponent) => {
        setTimeout(() => {
          nodeComponent.runChangeDetection();
        }, i * 2);
        i++;
      });
    }, totalTime);

  }

  reset(): void {
    this.nodes = [];
    this.initializeNodes();
  }

  private initializeNodes(): void {
    for (let row = 0; row < this.numRows; row++) {
      const cols: Array<Node> = [];
      for (let col = 0; col < this.numCols; col++) {
        const isStartNode = this.startNode.row === row && this.startNode.col === col;
        const isEndNode = this.endNode.row === row && this.endNode.col === col;
        const newNode = new Node(row, col, isStartNode, isEndNode);
        if (isStartNode) {
          this.startNode = newNode;
        } else if (isEndNode) {
          this.endNode = newNode;
        }
        cols.push(newNode);
      }
      this.nodes.push(cols);
    }
  }

  mouseEvent(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  drop(event: { previousNodeData: any, newNodeData: Node }): void {
    const previousNode = event.previousNodeData;
    const newNode = event.newNodeData;
    const isMovingStartNode = previousNode.isStartNode && !newNode.isEndNode;
    const isMovingEndNode = previousNode.isEndNode && !newNode.isStartNode;
    if (isMovingStartNode) {
      this.moveStartNode(previousNode, newNode);
    } else if (isMovingEndNode) {
      this.moveEndNode(previousNode, newNode);  
    }
    this.updateTerminalNodeComponents(previousNode, newNode);
  }

  private moveStartNode(previousNode: Node, newNode: Node): void {
    const { row, col } = previousNode;
    this.nodes[row][col].isStartNode = false;
    previousNode.isStartNode = false;
    const newStartNode = this.nodes[newNode.row][newNode.col];
    newStartNode.isStartNode = true;
    this.startNode = newStartNode;
  }

  private moveEndNode(previousNode: Node, newNode: Node): void {
    const { row, col } = previousNode;
    this.nodes[row][col].isEndNode = false;
    previousNode.isEndNode = false;
    const newEndNode = this.nodes[newNode.row][newNode.col];
    newEndNode.isEndNode = true;
    this.endNode = newEndNode;
  }

  private updateTerminalNodeComponents(previousNode: Node, newNode: Node): void {
    this.nodeComponents.forEach((nodeComponent: NodeComponent) => {
      if (nodeComponent.node.equals(previousNode) || nodeComponent.node.equals(newNode)) {
        nodeComponent.setTerminalState();
        nodeComponent.runChangeDetection();
      }
    });
  }

}
