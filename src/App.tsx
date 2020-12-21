import { useEffect, useState } from "react";
import { createNodes, createRandomWalls, resetNodes } from "./NodeMap";
import createEventListenerManager from "./EventListenersManager";
import runDijkstra from "./dijkstra";
import runFlood from "./flood";
import "./App.css";

const { addEventListeners, removeEventListeners } = createEventListenerManager();

const onFloodClick = () => {
  removeEventListeners();
  runFlood();
};

const onDijkstraClick = () => {
  removeEventListeners();
  runDijkstra();
};

const App = () => {
  const [nodes] = useState<JSX.Element[]>(createNodes());

  useEffect(() => {
    if (nodes) {
      addEventListeners();
      // putRandomWalls();
    }
  }, []);

  const resetMap = () => {
    resetNodes();
    addEventListeners();
  };

  return (
    <>
      <div className="App">
        <div>{nodes}</div>
      </div>
      <button onClick={onFloodClick}>Run flood algorithm</button>
      <button onClick={onDijkstraClick}>Run dijkstra algorithm</button>
      <button onClick={resetMap}>Reset Map</button>
    </>
  );
};

export default App;
