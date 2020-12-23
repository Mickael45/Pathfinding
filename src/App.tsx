import { useState } from "react";
import type { ChangeEvent } from "react";
import { createNodes, createRandomMaze, resetNodes } from "./nodesManager";
import runDijkstra from "./dijkstra";
import runFlood from "./flood";
import "./App.css";
import TypeSelector from "./TypeSelector";

const DIJKSTRA = "Dijkstra";
const FLOOD = "Flood";

const AlgortithmsHash: { [key: string]: () => void } = {
  [DIJKSTRA]: runDijkstra,
  [FLOOD]: runFlood,
};

const App = () => {
  const [nodes] = useState<JSX.Element[]>(createNodes());
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(FLOOD);
  const [isRunButtonDisabled, setIsRunButtonDisabled] = useState(false);

  const onCreateWallsButtonClick = () => {
    resetMap();
    createRandomMaze();
  };

  const runSelectedAlgorithm = () => AlgortithmsHash[selectedAlgorithm]();

  const onRunClick = () => {
    setIsRunButtonDisabled(true);
    runSelectedAlgorithm();
  };

  const resetMap = () => {
    setIsRunButtonDisabled(false);
    resetNodes();
  };

  const onSelectedAlgorithmTypeChange = (e: ChangeEvent<HTMLInputElement>) => setSelectedAlgorithm(e.target.value);

  return (
    <div>
      <div className="App">
        <div>{nodes}</div>
      </div>
      <p>Select algorithm to run:</p>

      <TypeSelector
        types={[DIJKSTRA, FLOOD]}
        onChange={onSelectedAlgorithmTypeChange}
        selectedType={selectedAlgorithm}
      />
      <button disabled={isRunButtonDisabled} onClick={onCreateWallsButtonClick}>
        Add random walls
      </button>
      <button disabled={isRunButtonDisabled} onClick={onRunClick}>
        Run
      </button>
      <button disabled={!isRunButtonDisabled} onClick={resetMap}>
        Reset Map
      </button>
    </div>
  );
};

export default App;
