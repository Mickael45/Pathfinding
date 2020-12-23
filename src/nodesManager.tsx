import { MouseEvent } from "react";
import { getConfig } from "./config";

const {
  NUMBER_OF_COLUMNS,
  NUMBER_OF_ROWS,
  START_NODE_ID,
  END_NODE_ID,
  WALL_COLOR,
  START_NODE_COLOR,
  END_NODE_COLOR,
} = getConfig();

const DOWN_STATE = "down";
const UP_STATE = "up";
let mouseState = UP_STATE;

const setNodeAsEmpty = (node: DataSetElement) => {
  node.id = "";
  node.style.backgroundColor = "";
};

const setNodeAsStart = (node: DataSetElement) => {
  node.id = START_NODE_ID;
  node.style.backgroundColor = START_NODE_COLOR;
};

const setNodeAsEnd = (node: DataSetElement) => {
  node.id = END_NODE_ID;
  node.style.backgroundColor = END_NODE_COLOR;
};

const setNodeAsWall = (node: DataSetElement) => {
  node.id = "";
  node.style.backgroundColor = WALL_COLOR;
};

const doesStartNodeExist = () => document.getElementById(START_NODE_ID);

const doesEndNodeExist = () => document.getElementById(END_NODE_ID);

const isNodeEmpty = (node: DataSetElement) => node.style.backgroundColor === "";

const onClick = (e: MouseEvent) => {
  const node = e.target as DataSetElement;
  if (!doesStartNodeExist()) {
    return setNodeAsStart(node);
  } else if (!doesEndNodeExist()) {
    return setNodeAsEnd(node);
  }
  return isNodeEmpty(node) ? setNodeAsWall(node) : setNodeAsEmpty(node);
};

const isNodeAWall = (node: DataSetElement) => node.style.backgroundColor === WALL_COLOR;

const isMouseDown = () => mouseState === DOWN_STATE;

const onMouseDown = () => (mouseState = DOWN_STATE);

const onMouseUp = () => (mouseState = UP_STATE);

const onMouseOver = (e: MouseEvent) => {
  if (isMouseDown()) {
    setNodeAsWall(e.target as DataSetElement);
  }
};

const createNode = (index: number) => (
  <div
    key={index}
    className="square"
    data-index={index}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseOver={onMouseOver}
    onMouseMove={onMouseOver}
  />
);

const createRandomIndexArray = (arrayLength: number, maxValue: number, toExclude: number[]) => {
  const indexArray = [];

  while (indexArray.length < arrayLength) {
    const r = Math.floor(Math.random() * maxValue);

    if (indexArray.indexOf(r) === -1 && toExclude.indexOf(r) === -1) {
      indexArray.push(r);
    }
  }
  return indexArray;
};

const createLeftBorder = (nodes: NodeListOf<DataSetElement>) => {
  for (let row = 0; row < NUMBER_OF_ROWS; row++) {
    setNodeAsWall(nodes[row * NUMBER_OF_COLUMNS]);
  }
};

const createRightBorder = (nodes: NodeListOf<DataSetElement>) => {
  for (let row = 0; row < NUMBER_OF_ROWS; row++) {
    setNodeAsWall(nodes[row * NUMBER_OF_COLUMNS + NUMBER_OF_COLUMNS - 1]);
  }
};

const createTopBorder = (nodes: NodeListOf<DataSetElement>) => {
  for (let column = 0; column < NUMBER_OF_COLUMNS; column++) {
    setNodeAsWall(nodes[column]);
  }
};

const createBottomBorder = (nodes: NodeListOf<DataSetElement>) => {
  for (let column = 0; column < NUMBER_OF_COLUMNS; column++) {
    setNodeAsWall(nodes[column + (NUMBER_OF_ROWS - 1) * NUMBER_OF_COLUMNS]);
  }
};

const setStartAndEndNodes = (nodes: DataSetElement[]) => {
  const wallNodes = nodes.filter((node) => node.style.backgroundColor === WALL_COLOR);
  const randomIndexArray = createRandomIndexArray(2, wallNodes.length - 1, [
    0,
    NUMBER_OF_COLUMNS - 1,
    NUMBER_OF_COLUMNS * (NUMBER_OF_ROWS - 1),
    NUMBER_OF_COLUMNS * NUMBER_OF_ROWS - 1,
  ]);

  setNodeAsStart(wallNodes[randomIndexArray[0]]);
  setNodeAsEnd(wallNodes[randomIndexArray[1]]);
};

const createMapBorders = (nodes: NodeListOf<DataSetElement>) => {
  createLeftBorder(nodes);
  createTopBorder(nodes);
  createRightBorder(nodes);
  createBottomBorder(nodes);
};

const createNumberWithinRange = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const getRandomVerticalWallNodeIndexWithinRange = (
  nodes: NodeListOf<DataSetElement>,
  minRowIndex: number,
  maxRowIndex: number,
  minColumnIndex: number,
  maxColumnIndex: number
) => {
  let randomRowIndex = 0;
  let retries = 0;
  const maxRetries = maxRowIndex - minRowIndex;

  while (
    (!randomRowIndex ||
      !isNodeAWall(nodes[randomRowIndex * NUMBER_OF_COLUMNS + minColumnIndex]) ||
      !isNodeAWall(nodes[randomRowIndex * NUMBER_OF_COLUMNS + maxColumnIndex])) &&
    retries < maxRetries
  ) {
    randomRowIndex = createNumberWithinRange(minRowIndex, maxRowIndex);
    retries++;
  }

  return retries === maxRetries ? -1 : randomRowIndex;
};

const getRandomHorizontalWallNodeIndexWithinRange = (
  nodes: NodeListOf<DataSetElement>,
  minColumnIndex: number,
  maxColumnIndex: number,
  minRowIndex: number,
  maxRowIndex: number
) => {
  let randomColumnIndex = 0;
  let retries = 0;
  const maxRetries = maxColumnIndex - minColumnIndex;

  while (
    (!randomColumnIndex ||
      !isNodeAWall(nodes[minRowIndex * NUMBER_OF_COLUMNS + randomColumnIndex]) ||
      !isNodeAWall(nodes[maxRowIndex * NUMBER_OF_COLUMNS + randomColumnIndex])) &&
    retries < maxRetries
  ) {
    randomColumnIndex = createNumberWithinRange(minColumnIndex, maxColumnIndex);
    console.log("HORIZONTAL", minRowIndex, minRowIndex * NUMBER_OF_COLUMNS + randomColumnIndex);
    retries++;
  }
  return retries === maxRetries ? -1 : randomColumnIndex;
};

const createRandomlyPlacedVerticalWall = (
  nodes: NodeListOf<DataSetElement>,
  topRowIndex: number,
  bottomRowIndex: number,
  leftColumnIndex: number,
  rightColumnIndex: number
) => {
  const randomColumnIndex = getRandomHorizontalWallNodeIndexWithinRange(
    nodes,
    leftColumnIndex + 2,
    rightColumnIndex - 2,
    topRowIndex,
    bottomRowIndex
  );
  const randomEmptyNodeRowIndex = createNumberWithinRange(topRowIndex + 1, bottomRowIndex - 1);

  if (randomColumnIndex === -1) {
    return -1;
  }

  for (let row = topRowIndex + 1; row < bottomRowIndex; row++) {
    if (row !== randomEmptyNodeRowIndex) {
      setNodeAsWall(nodes[row * NUMBER_OF_COLUMNS + randomColumnIndex]);
    }
  }
  return randomColumnIndex;
};

const createRandomlyPlacedHorizontalWall = (
  nodes: NodeListOf<DataSetElement>,
  topRowIndex: number,
  bottomRowIndex: number,
  leftColumnIndex: number,
  rightColumnIndex: number
) => {
  const randomRowIndex = getRandomVerticalWallNodeIndexWithinRange(
    nodes,
    topRowIndex + 2,
    bottomRowIndex - 2,
    leftColumnIndex,
    rightColumnIndex
  );
  const randomEmptyNodeColumnIndex = createNumberWithinRange(leftColumnIndex + 1, rightColumnIndex - 1);

  if (randomRowIndex === -1) {
    return -1;
  }

  for (let column = leftColumnIndex + 1; column < rightColumnIndex; column++) {
    if (column !== randomEmptyNodeColumnIndex) {
      setNodeAsWall(nodes[column + NUMBER_OF_COLUMNS * randomRowIndex]);
    }
  }
  return randomRowIndex;
};

const getStartNodeIndex = () => {
  const startNode = document.getElementById(START_NODE_ID);

  if (!startNode) {
    return -1;
  }
  return parseInt(startNode.dataset.index || "", 10);
};

const getEndNodeIndex = () => {
  const endNode = document.getElementById(END_NODE_ID);

  if (!endNode) {
    return -1;
  }
  return parseInt(endNode.dataset.index || "", 10);
};

const isNodeInLeftBorder = (nodeIndex: number) => !(nodeIndex % NUMBER_OF_COLUMNS);

const isNodeInRightBorder = (nodeIndex: number) => !((nodeIndex + 1) % NUMBER_OF_COLUMNS);

const isNodeInTopBorder = (nodeIndex: number) => nodeIndex > 0 && nodeIndex < NUMBER_OF_COLUMNS;

const isNodeInBottomBorder = (nodeIndex: number) =>
  nodeIndex > NUMBER_OF_COLUMNS * NUMBER_OF_ROWS - NUMBER_OF_COLUMNS && nodeIndex < NUMBER_OF_COLUMNS * NUMBER_OF_ROWS;

const removeBlockingWalls = (nodes: NodeListOf<DataSetElement>, nodeIndex: number) => {
  if (isNodeInBottomBorder(nodeIndex)) {
    setNodeAsEmpty(nodes[nodeIndex - NUMBER_OF_COLUMNS]);
  } else if (isNodeInTopBorder(nodeIndex)) {
    setNodeAsEmpty(nodes[nodeIndex + NUMBER_OF_COLUMNS]);
  } else if (isNodeInLeftBorder(nodeIndex)) {
    setNodeAsEmpty(nodes[nodeIndex + 1]);
  } else if (isNodeInRightBorder(nodeIndex)) {
    setNodeAsEmpty(nodes[nodeIndex - 1]);
  }
};

const randomlyCreateWallsUntilMapIsFilled = (
  nodes: NodeListOf<DataSetElement>,
  topRowIndex: number,
  bottomRowIndex: number,
  leftColumnIndex: number,
  rightColumnIndex: number,
  index: number
) => {
  let randomColumnIndex: number | null = null;
  let randomRowIndex: number | null = null;

  if (bottomRowIndex - topRowIndex <= 3 || rightColumnIndex - leftColumnIndex <= 3) {
    return;
  }

  if (index % 2) {
    randomRowIndex = createRandomlyPlacedHorizontalWall(
      nodes,
      topRowIndex,
      bottomRowIndex,
      leftColumnIndex,
      rightColumnIndex
    );
  } else {
    randomColumnIndex = createRandomlyPlacedVerticalWall(
      nodes,
      topRowIndex,
      bottomRowIndex,
      leftColumnIndex,
      rightColumnIndex
    );
  }

  if (randomColumnIndex === -1 || randomRowIndex === -1) {
    return;
  }

  setTimeout(() =>
    randomlyCreateWallsUntilMapIsFilled(
      nodes,
      randomRowIndex || topRowIndex,
      bottomRowIndex,
      randomColumnIndex || leftColumnIndex,
      rightColumnIndex,
      index + 1
    )
  );
  setTimeout(() =>
    randomlyCreateWallsUntilMapIsFilled(
      nodes,
      topRowIndex,
      randomRowIndex || bottomRowIndex,
      leftColumnIndex,
      randomColumnIndex || rightColumnIndex,
      index + 1
    )
  );
};

export const createRandomMaze = () => {
  const nodes = document.querySelectorAll<DataSetElement>(".square");

  createMapBorders(nodes);
  setStartAndEndNodes(Array.from(nodes));
  randomlyCreateWallsUntilMapIsFilled(nodes, 0, NUMBER_OF_ROWS - 1, 0, NUMBER_OF_COLUMNS - 1, 0);
  removeBlockingWalls(nodes, getStartNodeIndex());
  removeBlockingWalls(nodes, getEndNodeIndex());
};

const resetNode = (node: DataSetElement) => {
  delete node.dataset.weight;
  delete node.dataset.from;
  delete node.dataset.visited;
  node.classList.remove("visited");
  node.id = "";
  node.innerHTML = "";
  node.style.backgroundColor = "";
};

export const resetNodes = () => {
  const nodes = document.querySelectorAll<DataSetElement>(".square");

  nodes.forEach(resetNode);
};

export const createNodes = () => {
  const nodes = [];
  const nodesAmount = NUMBER_OF_COLUMNS * NUMBER_OF_ROWS;

  for (let i = 0; i < nodesAmount; i++) {
    nodes.push(createNode(i));
  }
  return nodes;
};
