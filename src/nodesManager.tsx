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

export const createRandomWalls = () => {
  const nodes = document.querySelectorAll<DataSetElement>(".square");

  createMapBorders(nodes);
  setStartAndEndNodes(Array.from(nodes));

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
