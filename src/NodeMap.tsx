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

const setNodeAsEmpty = (node: React.MouseEvent) => {
  (node.target as DataSetElement).id = "";
  (node.target as DataSetElement).style.backgroundColor = "";
};

const setNodeAsStart = (node: React.MouseEvent) => {
  (node.target as DataSetElement).id = START_NODE_ID;
  (node.target as DataSetElement).style.backgroundColor = START_NODE_COLOR;
};

const setNodeAsEnd = (node: React.MouseEvent) => {
  (node.target as DataSetElement).id = END_NODE_ID;
  (node.target as DataSetElement).style.backgroundColor = END_NODE_COLOR;
};

const setNodeAsWall = (node: MouseEvent | React.MouseEvent) => {
  (node.target as DataSetElement).style.backgroundColor = WALL_COLOR;
};

const doesStartNodeExist = () => document.getElementById(START_NODE_ID);

const doesEndNodeExist = () => document.getElementById(END_NODE_ID);

const isNodeEmpty = (node: React.MouseEvent) => (node.target as DataSetElement).style.backgroundColor === "";

const setEventListeners = () => {
  const DOWN_STATE = "down";
  const UP_STATE = "up";
  let mouseState = UP_STATE;

  const isMouseDown = () => mouseState === DOWN_STATE;

  const onMouseDown = () => (mouseState = DOWN_STATE);
  const onMouseUp = () => (mouseState = UP_STATE);

  const onMouseOver = (e: MouseEvent) => {
    if (isMouseDown() && (e.target as DataSetElement).dataset.index) {
      setNodeAsWall(e);
    }
  };

  const addEventListeners = () => {
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", onMouseOver);
  };

  addEventListeners();

  return {
    removeEventListeners: () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    },
  };
};

const handleNodeClick = (e: React.MouseEvent) => {
  if (!doesStartNodeExist()) {
    return setNodeAsStart(e);
  } else if (!doesEndNodeExist()) {
    return setNodeAsEnd(e);
  }
  return isNodeEmpty(e) ? setNodeAsWall(e) : setNodeAsEmpty(e);
};

const createNode = (index: number) => <div className="square" onClick={handleNodeClick} data-index={index} />;

const renderNodes = () => {
  const nodeMap = [];
  const nodesAmount = NUMBER_OF_COLUMNS * NUMBER_OF_ROWS;
  setEventListeners();

  for (let i = 0; i < nodesAmount; i++) {
    nodeMap.push(createNode(i));
  }
  return nodeMap;
};

export default renderNodes;
