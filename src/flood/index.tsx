import { getConfig } from "../config";

const { START_NODE_ID, END_NODE_ID, NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, WALL_COLOR, PATH_COLOR } = getConfig();

interface NodeIndexValidator {
  [key: string]: (nodeIndex: number, visitedNodeIndex?: number) => boolean;
}

interface NodeIndexCalculator {
  [key: string]: (visitedNodeIndex: number, distanceFromVisitedNode?: number) => number;
}

const giveWeightToNode = (weight: number, from: number, node: DataSetElement) => {
  node.innerHTML = weight.toString();
  node.dataset.weight = weight.toString();
  node.dataset.from = from.toString();
  node.dataset.visited = "false";
};

const setNodeAsVisited = (node: DataSetElement) => {
  if (node.id !== START_NODE_ID) {
    node.classList.add("visited");
  }
  node.dataset.visited = "true";
};

const wasNodeVisited = (node: DataSetElement) => node && node.dataset.visited === "true";

const isWallNode = (node: DataSetElement) => node.style.backgroundColor === WALL_COLOR;

const getNodeByIndex = (index: number) => document.querySelector<DataSetElement>(`div.square[data-index='${index}']`);

const nodeIndexValidator: NodeIndexValidator = {
  Top: (topNodeIndex: number) => topNodeIndex < 0,
  Right: (rightNodeIndex: number, visitedNodeIndex: number = 0) =>
    rightNodeIndex > NUMBER_OF_COLUMNS * NUMBER_OF_ROWS ||
    rightNodeIndex % NUMBER_OF_COLUMNS < visitedNodeIndex % NUMBER_OF_COLUMNS,
  Bottom: (bottomNodeIndex: number) => bottomNodeIndex > NUMBER_OF_COLUMNS * NUMBER_OF_ROWS,
  Left: (leftNodeIndex: number, visitedNodeIndex: number = 0) =>
    leftNodeIndex < 0 || leftNodeIndex % NUMBER_OF_COLUMNS > visitedNodeIndex % NUMBER_OF_COLUMNS,
};

const nodeIndexCalculator: NodeIndexCalculator = {
  Top: (visitedNodeIndex: number) => visitedNodeIndex - NUMBER_OF_COLUMNS,
  Right: (visitedNodeIndex: number, distanceFromVisitedNode: number = 0) => visitedNodeIndex + distanceFromVisitedNode,
  Bottom: (visitedNodeIndex: number) => visitedNodeIndex + NUMBER_OF_COLUMNS,
  Left: (visitedNodeIndex: number, distanceFromVisitedNode: number = 0) => visitedNodeIndex - distanceFromVisitedNode,
};

const isNewWeightHigherThanCurrent = (nodeNewWeight: number, nodeCurrentWeight: number) =>
  nodeCurrentWeight !== -1 && nodeNewWeight > nodeCurrentWeight;

const setNodeWeight = (
  visitedNodeIndex: number,
  visitedNodeWeight: number,
  distanceFromVisitedNode: number,
  position: string
) => {
  const nodeIndex = nodeIndexCalculator[position](visitedNodeIndex, distanceFromVisitedNode);
  const node = getNodeByIndex(nodeIndex);

  if (!node) {
    return;
  }

  const nodeNewWeight = distanceFromVisitedNode + visitedNodeWeight;
  const nodeCurrentWeight = parseInt(node.dataset.weight || "-1", 10);

  if (
    wasNodeVisited(node) ||
    nodeIndexValidator[position](nodeIndex, visitedNodeIndex) ||
    isNewWeightHigherThanCurrent(nodeNewWeight, nodeCurrentWeight) ||
    isWallNode(node)
  ) {
    return;
  }
  giveWeightToNode(nodeNewWeight, visitedNodeIndex, node);
};

const getAllNonVisitedNodes = () => document.querySelectorAll<DataSetElement>("div.square[data-visited='false']");

const setWeightToDirectNeighbors = (
  visitedNodeIndex: number,
  visitedNodeWeight: number,
  distanceFromVisitedNode: number
) => {
  const positions = ["Top", "Right", "Bottom", "Left"];

  positions.forEach((position) =>
    setNodeWeight(visitedNodeIndex, visitedNodeWeight, distanceFromVisitedNode, position)
  );
};

const wasEndNodeReached = () => {
  const endNode = document.getElementById(END_NODE_ID);

  return endNode && endNode.dataset.weight !== "-1";
};

const isFromIndexValid = (node: DataSetElement | null) =>
  node && node.dataset && node.dataset.from && parseInt(node.dataset.from, 10) >= 0;

const getEndNodeFromIndex = () => {
  const endNode = document.getElementById(END_NODE_ID) as DataSetElement;

  if (!isFromIndexValid(endNode)) {
    return -1;
  }

  return parseInt(endNode.dataset.from || "-1", 10);
};

const colorFromNodeIndexRecursively = (nodeIndex: number) => {
  const node = getNodeByIndex(nodeIndex);

  if (!node || !isFromIndexValid(node)) {
    return;
  }
  node.style.backgroundColor = PATH_COLOR;
  colorFromNodeIndexRecursively(parseInt(node.dataset.from || "-1", 10));
};

const setUpStartNode = () => {
  const startNode = document.getElementById(START_NODE_ID);

  if (startNode) {
    startNode.dataset.visited = "false";
    startNode.dataset.weight = "0";
  }
};

const setUpEndNode = () => {
  const endNode = document.getElementById(END_NODE_ID);

  if (endNode) {
    endNode.dataset.weight = "-1";
  }
};

const weighNeighborsRecursively = (nodes: NodeListOf<DataSetElement> = getAllNonVisitedNodes()) => {
  if (!nodes || !nodes.length) {
    return;
  }

  nodes.forEach((node) => {
    const distanceFromVisitedNode = 1;
    const {
      dataset: { weight = "-1", index },
    } = node;

    setWeightToDirectNeighbors(parseInt(index, 10), parseInt(weight, 10), distanceFromVisitedNode);
    setNodeAsVisited(node);
  });
  if (!wasEndNodeReached()) {
    setTimeout(() => {
      weighNeighborsRecursively();
    }, 0);
  } else {
    colorFromNodeIndexRecursively(getEndNodeFromIndex());
  }
};

const run = () => {
  setUpStartNode();
  setUpEndNode();
  weighNeighborsRecursively();
};

export default run;
