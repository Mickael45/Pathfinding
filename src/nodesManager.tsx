import { MouseEvent } from "react";
import { getConfig } from "./config";

interface Corners {
  topRowIndex: number;
  bottomRowIndex: number;
  leftColumnIndex: number;
  rightColumnIndex: number;
}

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

const getNodes = () => document.querySelectorAll<DataSetElement>(".square");

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

const colorNodeInPink = (node: DataSetElement) => (node.style.backgroundColor = "pink");

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
      !isNodeAWall(nodes[randomRowIndex * NUMBER_OF_COLUMNS + maxColumnIndex]) ||
      isNodeAWall(nodes[randomRowIndex * (NUMBER_OF_COLUMNS - 1) + maxColumnIndex]) ||
      isNodeAWall(nodes[randomRowIndex * (NUMBER_OF_COLUMNS + 1) + maxColumnIndex])) &&
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
      !isNodeAWall(nodes[maxRowIndex * NUMBER_OF_COLUMNS + randomColumnIndex]) ||
      isNodeAWall(nodes[minRowIndex * NUMBER_OF_COLUMNS + randomColumnIndex + 1]) ||
      isNodeAWall(nodes[minRowIndex * NUMBER_OF_COLUMNS + randomColumnIndex - 1])) &&
    retries < maxRetries
  ) {
    randomColumnIndex = createNumberWithinRange(minColumnIndex, maxColumnIndex);
    retries++;
  }
  return retries === maxRetries ? -1 : randomColumnIndex;
};

const createRandomlyPlacedVerticalWall = (nodes: NodeListOf<DataSetElement>, corners: Corners) => {
  const { topRowIndex, bottomRowIndex, leftColumnIndex, rightColumnIndex } = corners;

  const randomColumnIndex = getRandomHorizontalWallNodeIndexWithinRange(
    nodes,
    leftColumnIndex + 1,
    rightColumnIndex - 1,
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

const createRandomlyPlacedHorizontalWall = (nodes: NodeListOf<DataSetElement>, corners: Corners) => {
  const { topRowIndex, bottomRowIndex, leftColumnIndex, rightColumnIndex } = corners;

  const randomRowIndex = getRandomVerticalWallNodeIndexWithinRange(
    nodes,
    topRowIndex + 1,
    bottomRowIndex - 1,
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

const isRandomIndexValid = (randomIndex: number | null) => randomIndex && randomIndex >= 0;

const randomlyCreateWalls = (nodes: NodeListOf<DataSetElement>, corners: Corners, index: number = 0) => {
  const { topRowIndex, leftColumnIndex } = corners;
  let randomColumnIndex: number | null = null;
  let randomRowIndex: number | null = null;

  if (index % 2) {
    randomRowIndex = createRandomlyPlacedHorizontalWall(nodes, corners);
  } else {
    randomColumnIndex = createRandomlyPlacedVerticalWall(nodes, corners);
  }

  if (!isRandomIndexValid(randomColumnIndex) && !isRandomIndexValid(randomRowIndex)) {
    return;
  }

  setTimeout(
    () =>
      randomlyCreateWalls(
        nodes,
        {
          ...corners,
          topRowIndex: randomRowIndex || topRowIndex,
          leftColumnIndex: randomColumnIndex || leftColumnIndex,
        },
        index + 1
      ),
    index * 100
  );
  // setTimeout(
  //   () =>
  //     randomlyCreateWalls(
  //       nodes,
  //       {
  //         ...corners,
  //         bottomRowIndex: randomRowIndex || bottomRowIndex,
  //         rightColumnIndex: randomColumnIndex || rightColumnIndex,
  //       },
  //       index + 1
  //     ),
  //   index * 100
  // );
};

export const createRandomMaze = () => {
  const nodes = getNodes();
  const corners = {
    topRowIndex: 0,
    bottomRowIndex: NUMBER_OF_ROWS - 1,
    leftColumnIndex: 0,
    rightColumnIndex: NUMBER_OF_COLUMNS - 1,
  };

  createMapBorders(nodes);
  setStartAndEndNodes(Array.from(nodes));
  randomlyCreateWalls(nodes, corners);
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

export const resetNodes = () => getNodes().forEach(resetNode);

export const createNodes = () => {
  const nodes = [];
  const nodesAmount = NUMBER_OF_COLUMNS * NUMBER_OF_ROWS;

  for (let i = 0; i < nodesAmount; i++) {
    nodes.push(createNode(i));
  }
  return nodes;
};
