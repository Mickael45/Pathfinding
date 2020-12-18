import "./NodeMap.css";
import { getConfig } from "./config";

const { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, WALL_COLOR } = getConfig();

const createNode = (index: number) => <div className="square" data-index={index} />;

export const putRandomWalls = () => {
  const nodes = document.querySelectorAll(".square");
  const numberOfWalls = 900;
  const randomIndexes = [];
  while (randomIndexes.length < numberOfWalls) {
    var r = Math.floor(Math.random() * NUMBER_OF_COLUMNS * NUMBER_OF_ROWS) + 1;
    if (randomIndexes.indexOf(r) === -1) {
      randomIndexes.push(r);
    }
  }

  randomIndexes.forEach((index) => ((nodes[index] as HTMLElement).style.backgroundColor = WALL_COLOR));
};

export const createNodes = () => {
  const nodes = [];
  const nodesAmount = NUMBER_OF_COLUMNS * NUMBER_OF_ROWS;

  for (let i = 0; i < nodesAmount; i++) {
    nodes.push(createNode(i));
  }
  return nodes;
};
