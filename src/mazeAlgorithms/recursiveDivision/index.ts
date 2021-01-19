import { getConfig } from "../../config";

const {
  NUMBER_OF_COLUMNS,
  NUMBER_OF_ROWS,
  START_NODE_ID,
  END_NODE_ID,
  WALL_COLOR,
  START_NODE_COLOR,
  END_NODE_COLOR,
} = getConfig();

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

const isNodeAWall = (node: DataSetElement) => node.style.backgroundColor === WALL_COLOR;

const getNodes = () => document.querySelectorAll<DataSetElement>(".square");

const createRandomIndexArray = (arrayLength: number, min: number, max: number, toExclude: number[]) => {
  const indexArray = [];

  while (indexArray.length < arrayLength) {
    const randomIndex = createNumberWithinRange(min, max, true);

    if (indexArray.indexOf(randomIndex) === -1 && toExclude.indexOf(randomIndex) === -1) {
      indexArray.push(randomIndex);
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
  const fourCornersIndex = [
    0,
    NUMBER_OF_COLUMNS - 1,
    NUMBER_OF_ROWS * 2 + NUMBER_OF_COLUMNS - 4,
    NUMBER_OF_ROWS * 2 + NUMBER_OF_COLUMNS * 2 - 5,
  ];
  const randomIndexArray = createRandomIndexArray(2, 0, wallNodes.length - 1, fourCornersIndex);

  setNodeAsStart(wallNodes[randomIndexArray[0]]);
  setNodeAsEnd(wallNodes[randomIndexArray[1]]);
};

const createMapBorders = (nodes: NodeListOf<DataSetElement>) => {
  createLeftBorder(nodes);
  createTopBorder(nodes);
  createRightBorder(nodes);
  createBottomBorder(nodes);
};

const createNumberWithinRange = (min: number, max: number, isMaxIncluded: boolean = false) =>
  Math.floor(Math.random() * ((isMaxIncluded ? max + 1 : max) - min)) + min;

const createLeftWall = (nodes: NodeListOf<DataSetElement>, wallIndex: number, x: number, y: number, height: number) => {
  const nextRoomWidth = wallIndex - x;
  const isNextWallHorizontal = nextRoomWidth <= height;

  createRandomWall(nodes, x, y, nextRoomWidth, height, isNextWallHorizontal);
};

const areBothExtremitiesEmptyNodes = (startIndex: number, endIndex: number) => {
  const nodes = getNodes();

  return !isNodeAWall(nodes[startIndex]) && !isNodeAWall(nodes[endIndex]);
};

const generateVerticalWallIndex = (min: number, max: number, y: number, height: number) => {
  const wallIndex = createNumberWithinRange(min, max);
  const startNodeIndex = (y - 1) * NUMBER_OF_COLUMNS + wallIndex;
  const endNodeIndex = (y + height) * NUMBER_OF_COLUMNS + wallIndex;

  const generateAnotherWallIndex = () => (max - min > 0 ? createRandomIndexArray(1, min, max, [wallIndex])[0] : -1);

  return areBothExtremitiesEmptyNodes(startNodeIndex, endNodeIndex) ? generateAnotherWallIndex() : wallIndex;
};

const createRightWall = (
  nodes: NodeListOf<DataSetElement>,
  wallIndex: number,
  x: number,
  y: number,
  height: number,
  width: number
) => {
  const nextRoomWidth = x + width - (wallIndex + 1);
  const isNextWallHorizontal = nextRoomWidth <= height;

  createRandomWall(nodes, wallIndex + 1, y, nextRoomWidth, height, isNextWallHorizontal);
};

const createRandomlyPlacedVerticalWall = (
  nodes: NodeListOf<DataSetElement>,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const min = x + 1;
  const max = x + width - 2;

  if (min > max) {
    return -1;
  }

  const wallIndex = generateVerticalWallIndex(min, max, y, height);
  let pathIndex = createNumberWithinRange(y, y + height);

  if (wallIndex === -1) {
    return wallIndex;
  }

  if (!isNodeAWall(nodes[(y + height) * NUMBER_OF_COLUMNS + wallIndex])) {
    pathIndex = y + height - 1;
  } else if (!isNodeAWall(nodes[(y - 1) * NUMBER_OF_COLUMNS + wallIndex])) {
    pathIndex = y;
  }

  for (let row = y; row < y + height; row++) {
    if (row !== pathIndex) {
      setNodeAsWall(nodes[row * NUMBER_OF_COLUMNS + wallIndex]);
    }
  }
  return wallIndex;
};

const createTopWall = (nodes: NodeListOf<DataSetElement>, wallIndex: number, x: number, y: number, width: number) => {
  const nextRoomHeight = wallIndex - y;
  const isNextWallHorizontal = width <= nextRoomHeight;

  createRandomWall(nodes, x, y, width, nextRoomHeight, isNextWallHorizontal);
};

const createBottomWall = (
  nodes: NodeListOf<DataSetElement>,
  wallIndex: number,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const nextRoomHeight = y + height - (wallIndex + 1);
  const isNextWallHorizontal = width <= nextRoomHeight;

  createRandomWall(nodes, x, wallIndex + 1, width, nextRoomHeight, isNextWallHorizontal);
};

const generateHorizontalWallIndex = (min: number, max: number, x: number, width: number) => {
  const wallIndex = createNumberWithinRange(min, max);
  const startNodeIndex = x - 1 + NUMBER_OF_COLUMNS * wallIndex;
  const endNodeIndex = x + width + NUMBER_OF_COLUMNS * wallIndex;

  const generateAnotherWallIndex = () => (max - min > 0 ? createRandomIndexArray(1, min, max, [wallIndex])[0] : -1);

  return areBothExtremitiesEmptyNodes(startNodeIndex, endNodeIndex) ? generateAnotherWallIndex() : wallIndex;
};

const createRandomlyPlacedHorizontalWall = (
  nodes: NodeListOf<DataSetElement>,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const min = y + 1;
  const max = y + height - 2;

  if (min > max) {
    return -1;
  }

  const wallIndex = generateHorizontalWallIndex(min, max, x, width);
  let pathIndex = createNumberWithinRange(x, x + width);

  if (wallIndex === -1) {
    return wallIndex;
  }

  if (!isNodeAWall(nodes[x + width + NUMBER_OF_COLUMNS * wallIndex])) {
    pathIndex = x + width - 1;
  } else if (!isNodeAWall(nodes[x - 1 + NUMBER_OF_COLUMNS * wallIndex])) {
    pathIndex = x;
  }

  for (let column = x; column < x + width; column++) {
    if (column !== pathIndex) {
      setNodeAsWall(nodes[column + NUMBER_OF_COLUMNS * wallIndex]);
    }
  }
  return wallIndex;
};

const createRandomWall = (
  nodes: NodeListOf<DataSetElement>,
  x: number,
  y: number,
  width: number,
  height: number,
  isHorizontal: boolean
) => {
  if (width < 2 || height < 2) {
    return;
  }

  if (isHorizontal) {
    const wallIndex = createRandomlyPlacedHorizontalWall(nodes, x, y, width, height);

    if (wallIndex === -1) {
      return;
    }
    createTopWall(nodes, wallIndex, x, y, width);
    createBottomWall(nodes, wallIndex, x, y, width, height);
  } else {
    const wallIndex = createRandomlyPlacedVerticalWall(nodes, x, y, width, height);

    if (wallIndex === -1) {
      return;
    }

    createLeftWall(nodes, wallIndex, x, y, height);
    createRightWall(nodes, wallIndex, x, y, height, width);
  }
};

const run = (nodes: NodeListOf<DataSetElement>) =>
  createRandomWall(nodes, 1, 1, NUMBER_OF_COLUMNS - 2, NUMBER_OF_ROWS - 2, NUMBER_OF_COLUMNS <= NUMBER_OF_ROWS);

export default run;
