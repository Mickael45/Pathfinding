import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { createNodes, createRandomMaze, resetNodes } from "./nodesManager";
import runDijkstra from "./dijkstra";
import runFlood from "./flood";
import "./App.css";
import TypeSelector from "./TypeSelector";

const DIJKSTRA = "Dijkstra";
const FLOOD = "Flood";

const AUTOMATIC = "Automatic";
const MANUAL = "Manual";

const PathfindingAlgortithmsHash: { [key: string]: () => void } = {
  [DIJKSTRA]: runDijkstra,
  [FLOOD]: runFlood,
};

const MazeGenerationModesHash: { [key: string]: () => void } = {
  [AUTOMATIC]: runDijkstra,
  [MANUAL]: runFlood,
};

const App = () => {
  const [nodes] = useState<JSX.Element[]>(createNodes);
  const [selectedPathfindingAlgorithm, setSelectedPathfindingAlgorithm] = useState(FLOOD);
  const [selectedMazeGenerationMode, setSelectedMazeGenerationMode] = useState(AUTOMATIC);
  const [showGenerateMazeButton, setShowGenerateMazeButton] = useState(selectedMazeGenerationMode === AUTOMATIC);
  const [isRunButtonDisabled, setIsRunButtonDisabled] = useState(true);
  const [isResetButtonDisabled, setIsResetButtonDisabled] = useState(true);

  const runSelectedPathfindingAlgorithm = () => PathfindingAlgortithmsHash[selectedPathfindingAlgorithm]();

  const onCreateMazeButtonClick = () => {
    setIsResetButtonDisabled(false);
    setIsRunButtonDisabled(false);
    createRandomMaze();
  };

  const onRunClick = () => {
    setIsRunButtonDisabled(true);
    runSelectedPathfindingAlgorithm();
  };

  const resetMap = () => {
    setIsResetButtonDisabled(true);
    setIsRunButtonDisabled(false);
    resetNodes();
  };

  const onSelectedPathfindingAlgorithmTypeChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSelectedPathfindingAlgorithm(e.target.value);

  const onSelectedMazeGenerationModeTypeChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSelectedMazeGenerationMode(e.target.value);

  useEffect(() => setShowGenerateMazeButton(selectedMazeGenerationMode === AUTOMATIC), [selectedMazeGenerationMode]);

  const renderCreateMazeButton = () =>
    showGenerateMazeButton ? <button onClick={onCreateMazeButtonClick}>Generate Random Maze</button> : null;

  return (
    <div>
      <div className="App">
        <div>{nodes}</div>
      </div>

      <TypeSelector
        label="Select pathfinding algorithm to run:"
        types={[DIJKSTRA, FLOOD]}
        onChange={onSelectedPathfindingAlgorithmTypeChange}
        selectedType={selectedPathfindingAlgorithm}
      />

      <TypeSelector
        label="Select maze generation mode:"
        types={[AUTOMATIC, MANUAL]}
        onChange={onSelectedMazeGenerationModeTypeChange}
        selectedType={selectedMazeGenerationMode}
      />

      {renderCreateMazeButton()}
      <button disabled={isRunButtonDisabled} onClick={onRunClick}>
        Run
      </button>
      <button disabled={isResetButtonDisabled} onClick={resetMap}>
        Reset Maze
      </button>
    </div>
  );
};

export default App;
