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

const setNodeAsEmpty = (node: MouseEvent) => {
  (node.target as DataSetElement).id = "";
  (node.target as DataSetElement).style.backgroundColor = "";
};

const setNodeAsStart = (node: MouseEvent) => {
  (node.target as DataSetElement).id = START_NODE_ID;
  (node.target as DataSetElement).style.backgroundColor = START_NODE_COLOR;
};

const setNodeAsEnd = (node: MouseEvent) => {
  (node.target as DataSetElement).id = END_NODE_ID;
  (node.target as DataSetElement).style.backgroundColor = END_NODE_COLOR;
};

const setNodeAsWall = (node: MouseEvent | MouseEvent) => {
  (node.target as DataSetElement).id = "";
  (node.target as DataSetElement).style.backgroundColor = WALL_COLOR;
};

const doesStartNodeExist = () => document.getElementById(START_NODE_ID);

const doesEndNodeExist = () => document.getElementById(END_NODE_ID);

const isNodeEmpty = (node: MouseEvent) => (node.target as DataSetElement).style.backgroundColor === "";

const onClick = (e: MouseEvent) => {
  if (!doesStartNodeExist()) {
    return setNodeAsStart(e);
  } else if (!doesEndNodeExist()) {
    return setNodeAsEnd(e);
  }
  return isNodeEmpty(e) ? setNodeAsWall(e) : setNodeAsEmpty(e);
};

const isMouseDown = () => mouseState === DOWN_STATE;

const onMouseDown = () => (mouseState = DOWN_STATE);

const onMouseUp = () => (mouseState = UP_STATE);

const onMouseOver = (e: MouseEvent) => {
  if (isMouseDown()) {
    setNodeAsWall(e);
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

const createRandomIndexArray = (arrayLength: number, maxValue: number) => {
  const indexArray = [];

  while (indexArray.length < arrayLength) {
    const r = Math.floor(Math.random() * maxValue);

    if (indexArray.indexOf(r) === -1) {
      indexArray.push(r);
    }
  }
  return indexArray;
};

const createLeftBorder = (nodes: NodeListOf<DataSetElement>, createNodeOfType: string) => {
  let emptyNodeRowIndex = -1;

  if (createNodeOfType !== "") {
    emptyNodeRowIndex = 1 + Math.floor(Math.random() * (NUMBER_OF_ROWS - 2));
  }

  for (let row = 0; row < NUMBER_OF_ROWS; row++) {
    if (emptyNodeRowIndex !== row) {
      (nodes[row * NUMBER_OF_COLUMNS] as HTMLElement).style.backgroundColor = WALL_COLOR;
    }
  }
};

const createRightBorder = (nodes: NodeListOf<DataSetElement>, createNodeOfType: string) => {
  let emptyNodeRowIndex = -1;

  if (createNodeOfType !== "") {
    emptyNodeRowIndex = 1 + Math.floor(Math.random() * (NUMBER_OF_ROWS - 2));
  }
  for (let row = 0; row < NUMBER_OF_ROWS; row++) {
    if (emptyNodeRowIndex !== row) {
      (nodes[row * NUMBER_OF_COLUMNS + NUMBER_OF_COLUMNS - 1] as HTMLElement).style.backgroundColor = WALL_COLOR;
    }
  }
};

const createTopBorder = (nodes: NodeListOf<DataSetElement>, createNodeOfType: string) => {
  let emptyNodeRowIndex = -1;

  if (createNodeOfType !== "") {
    emptyNodeRowIndex = 1 + Math.floor(Math.random() * (NUMBER_OF_COLUMNS - 2));
  }
  for (let column = 0; column < NUMBER_OF_COLUMNS; column++) {
    if (emptyNodeRowIndex !== column) {
      (nodes[column] as HTMLElement).style.backgroundColor = WALL_COLOR;
    }
  }
};

const createBottomBorder = (nodes: NodeListOf<DataSetElement>, createNodeOfType: string) => {
  let emptyNodeRowIndex = -1;

  if (createNodeOfType !== "") {
    emptyNodeRowIndex = 1 + Math.floor(Math.random() * (NUMBER_OF_COLUMNS - 2));
  }
  for (let column = 0; column < NUMBER_OF_COLUMNS; column++) {
    if (emptyNodeRowIndex !== column) {
      (nodes[column + (NUMBER_OF_ROWS - 1) * NUMBER_OF_COLUMNS] as HTMLElement).style.backgroundColor = WALL_COLOR;
    }
  }
};

const createMapBorders = () => {
  const nodes = document.querySelectorAll<DataSetElement>(".square");
  const randomIndexArray = createRandomIndexArray(2, 4).sort((a, b) => a - b);
  const borderCreationFunctions = [createLeftBorder, createTopBorder, createRightBorder, createBottomBorder];

  borderCreationFunctions.forEach((borderCreationFunction, index: number) => {
    const shouldCreateEmptyNode = index === randomIndexArray[0];
    let shouldCreateNodeOfType = "";

    if (shouldCreateEmptyNode) {
      shouldCreateNodeOfType = randomIndexArray.length === 2 ? "start" : "end";
      randomIndexArray.shift();
    }

    borderCreationFunction(nodes, shouldCreateNodeOfType);
  });
};

export const createRandomWalls = () => {
  createMapBorders();
  // const nodes = document.querySelectorAll(".square");
  // const numberOfWalls = 900;
  // randomIndexArray.forEach((index) => ((nodes[index] as HTMLElement).style.backgroundColor = WALL_COLOR));
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
