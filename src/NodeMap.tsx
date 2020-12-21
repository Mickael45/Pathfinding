import "./NodeMap.css";
import { getConfig } from "./config";

const { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, WALL_COLOR } = getConfig();

const createNode = (index: number) => <div key={index} className="square" data-index={index} />;

const createRandomIndexArray = (arrayLength: number) => {
  const indexArray = [];

  while (indexArray.length < arrayLength) {
    const r = Math.floor(Math.random() * NUMBER_OF_COLUMNS * NUMBER_OF_ROWS);

    if (indexArray.indexOf(r) === -1) {
      indexArray.push(r);
    }
  }
  return indexArray;
};

export const createRandomWalls = () => {
  const nodes = document.querySelectorAll(".square");
  const numberOfWalls = 900;
  const randomIndexArray = createRandomIndexArray(numberOfWalls);

  randomIndexArray.forEach((index) => ((nodes[index] as HTMLElement).style.backgroundColor = WALL_COLOR));
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
