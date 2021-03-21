import { Node } from "./node";
import { Point } from "./point";

export class Djikstra {

  start(nodes: Array<Array<Node>>, startNode: Node, endNode: Node): Array<Node> {
    startNode.distance = 0;
    const unvisitedNodes: Array<Node> = [];
    const visitedNodes: Array<Node> = [];
    for (const node of nodes) {
      unvisitedNodes.push(...node);
    }

    while (unvisitedNodes.length > 0) {
      this.sortNodes(unvisitedNodes);
      const currentNode = unvisitedNodes.shift();
      if (currentNode) {
        currentNode.visit();
        visitedNodes.push(currentNode);
        if (currentNode.equals(endNode)) {
          return visitedNodes;
        }
        this.updateNeighbors(currentNode, nodes);
      }
    }

    return visitedNodes;
  }

  private updateNeighbors(currentNode: Node, nodes: Array<Array<Node>>): void {
    let neighbors = this.getNeighbors(currentNode, nodes);
    for (let neighbor of neighbors) {
      neighbor.distance = currentNode.distance + 1;
      neighbor.previousNode = currentNode;
    }
  }

  private getNeighbors(currentNode: Node, nodes: Array<Array<Node>>): Array<Node> {
    let neighbors: Array<Node> = [];
    if (currentNode.row > 0) {
      neighbors.push(nodes[currentNode.row - 1][currentNode.col]);
    }
    if (currentNode.col > 0) {
      neighbors.push(nodes[currentNode.row][currentNode.col - 1]);
    }
    if (currentNode.row < nodes.length - 1) {
      neighbors.push(nodes[currentNode.row + 1][currentNode.col]);
    }
    if (currentNode.col < nodes[0].length - 1) {
      neighbors.push(nodes[currentNode.row][currentNode.col + 1]);
    }
    neighbors = neighbors.filter(neighbor => !(neighbor.hasBeenVisited || neighbor.isWall));
    return neighbors;
  }

  private sortNodes(nodes: Array<Node>): void {
    nodes.sort((a, b) => a.distance - b.distance);
  }

}