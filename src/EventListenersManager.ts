import { getConfig } from "./config";

const { START_NODE_ID, END_NODE_ID, WALL_COLOR, START_NODE_COLOR, END_NODE_COLOR } = getConfig();

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
  (node.target as DataSetElement).style.backgroundColor = WALL_COLOR;
};

const doesStartNodeExist = () => document.getElementById(START_NODE_ID);

const doesEndNodeExist = () => document.getElementById(END_NODE_ID);

const isNodeEmpty = (node: MouseEvent) => (node.target as DataSetElement).style.backgroundColor === "";

const onMouseClick = (e: MouseEvent) => {
  if (!doesStartNodeExist()) {
    return setNodeAsStart(e);
  } else if (!doesEndNodeExist()) {
    return setNodeAsEnd(e);
  }
  return isNodeEmpty(e) ? setNodeAsWall(e) : setNodeAsEmpty(e);
};

const getAllNodes = () => document.querySelectorAll<HTMLDivElement>(".square");

const createEventListenerManager = () => {
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

    const nodes = getAllNodes();

    nodes.forEach((node) => {
      node.addEventListener("click", onMouseClick);
    });
  };

  const removeEventListeners = () => {
    window.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", onMouseOver);

    const nodes = getAllNodes();

    nodes.forEach((node) => {
      node.removeEventListener("click", onMouseClick);
    });
  };

  return {
    addEventListeners,
    removeEventListeners,
  };
};

export default createEventListenerManager;
