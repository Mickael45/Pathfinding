import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { createNodes, createRandomWalls, resetNodes } from "./nodesManager";
import runDijkstra from "./dijkstra";
import runFlood from "./flood";
import "./App.css";
import TypeSelector from "./TypeSelector";

const DIJKSTRA = "Dijkstra";
const FLOOD = "Flood";

const AlgortithmsHash: { [key: string]: () => boolean } = {
  [DIJKSTRA]: runDijkstra,
  [FLOOD]: runFlood,
};

const App = () => {
  const [nodes] = useState<JSX.Element[]>(createNodes());
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(FLOOD);
  const [isRunButtonDisabled, setIsRunButtonDisabled] = useState(false);
  const [isResetButtonDisabled, setIsResetButtonDisabled] = useState(true);

  useEffect(createRandomWalls, []);

  const runSelectedAlgorithm = () => AlgortithmsHash[selectedAlgorithm]();

  const onRunClick = () => {
    setIsRunButtonDisabled(true);
    const result = runSelectedAlgorithm();
    if (result) {
      setIsResetButtonDisabled(false);
    }
  };

  const resetMap = () => {
    setIsResetButtonDisabled(true);
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
      <button disabled={isRunButtonDisabled} onClick={onRunClick}>
        Run
      </button>
      <button disabled={isResetButtonDisabled} onClick={resetMap}>
        Reset Map
      </button>
    </div>
  );
};

export default App;
