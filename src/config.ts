interface Config {
  NUMBER_OF_COLUMNS: number;
  NUMBER_OF_ROWS: number;
  START_NODE_ID: string;
  END_NODE_ID: string;
  START_NODE_COLOR: string;
  END_NODE_COLOR: string;
  WALL_COLOR: string;
  PATH_COLOR: string;
}

const defaultConfig = {
  NUMBER_OF_COLUMNS: 90,
  NUMBER_OF_ROWS: 50,
  START_NODE_ID: "startNode",
  END_NODE_ID: "endNode",
  START_NODE_COLOR: "yellow",
  END_NODE_COLOR: "red",
  WALL_COLOR: "grey",
  PATH_COLOR: "blue",
};

let config = { ...defaultConfig };

export const getConfig = () => config;

export const setConfig = (newConfig: Config) => (config = newConfig);
