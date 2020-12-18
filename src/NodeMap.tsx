import type { MouseEvent } from "react";
import "./NodeMap.css";
import { getConfig } from "./config";

const {
  START_NODE_ID,
  END_NODE_ID,
  WALL_COLOR,
  START_NODE_COLOR,
  END_NODE_COLOR,
  NUMBER_OF_COLUMNS,
  NUMBER_OF_ROWS,
} = getConfig();

const setNodeAsStart = (node: MouseEvent<DataSetElement>) => {
  (node.target as DataSetElement).id = START_NODE_ID;
  (node.target as DataSetElement).style.backgroundColor = START_NODE_COLOR;
};

const setNodeAsEnd = (node: MouseEvent<DataSetElement>) => {
  (node.target as DataSetElement).id = END_NODE_ID;
  (node.target as DataSetElement).style.backgroundColor = END_NODE_COLOR;
};

const setNodeAsWall = (node: MouseEvent<DataSetElement>) => {
  (node.target as DataSetElement).style.backgroundColor = WALL_COLOR;
};

const doesStartNodeExist = () => document.getElementById(START_NODE_ID);

const doesEndNodeExist = () => document.getElementById(END_NODE_ID);

const isNodeEmpty = (node: DataSetElement) => (node.style.backgroundColor = "white");

const handleNodeClick = (e: MouseEvent<DataSetElement>) => {
  if (!isNodeEmpty(e.target as DataSetElement)) {
    return;
  }
  if (!doesStartNodeExist()) {
    return setNodeAsStart(e);
  } else if (!doesEndNodeExist()) {
    return setNodeAsEnd(e);
  }
  return setNodeAsWall(e);
};

const createNode = (index: number) => <div className="square" onClick={handleNodeClick} data-index={index} />;

const renderNodes = () => {
  const nodeMap = [];
  const nodesAmount = NUMBER_OF_COLUMNS * NUMBER_OF_ROWS;

  for (let i = 0; i < nodesAmount; i++) {
    nodeMap.push(createNode(i));
  }
  return nodeMap;
};

export default renderNodes;
