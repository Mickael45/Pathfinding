import renderNodes from "./NodeMap";
import run from "./dijkstra";
import "./App.css";

const App = () => (
  <>
    <div className="App">{renderNodes()}</div>
    <button onClick={run}>Run algorithm</button>
  </>
);

export default App;
