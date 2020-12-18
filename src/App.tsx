import { useEffect, useState } from "react";
import { createNodes, putRandomWalls } from "./NodeMap";
import createEventListenerManager from "./EventListenersManager";
import run from "./dijkstra";
import "./App.css";

const { addEventListeners, removeEventListeners } = createEventListenerManager();

const onClick = () => {
  removeEventListeners();
  run();
};

const App = () => {
  const [nodes] = useState<JSX.Element[]>(createNodes());

  useEffect(() => {
    if (nodes && nodes.length > 0) {
      addEventListeners();
      putRandomWalls();
    }
  }, []);

  return (
    <>
      <div className="App">{nodes}</div>
      <button onClick={onClick}>Run algorithm</button>
    </>
  );
};

export default App;
