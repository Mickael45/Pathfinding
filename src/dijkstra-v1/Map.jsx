import React, {
  Component,
  useState,
  useEffect,
  memo,
  useCallback
} from "react";
import logo from "../logo.svg";
import "./Map.css"
import { SSL_OP_EPHEMERAL_RSA } from "constants";

const NUMBER_OF_COLUMNS = 74;
const MAP_SIZE = 2516;

const Square = memo(
  ({ isTarget, isStart, onClick, position, weight, isPath }) => {
    function getProperStyle() {
      if (isTarget) {
        return "target";
      } else if (isStart) {
        return "start";
      } else if (isPath) {
        return "path";
      } else if (weight >= 0) {
        return "adjascent";
      }
      return "";
    }

    function handleClick() {
      if (onClick) {
        onClick(position);
      }
    }

    return (
      <div
        className={["square", getProperStyle()].join(" ")}
        onClick={handleClick}
      ></div>
    );
  }
);

const Map = () => {
  const [targetPosition, setTargetPostion] = useState(-1);
  const [startPosition, setStartPosition] = useState(-1);
  const [subMap, setSubMap] = useState([]);
  const [hasReachedTarget, setHasReachedTarget] = useState(false);
  const [weight, setWeight] = useState(1);
  const [done, setDone] = useState(false);

  const map = Array(MAP_SIZE).fill(<Square />);

  function didReachTarget(setOfPositions) {
    return setOfPositions.find(({ position }) => position === targetPosition);
  }

  function isAlreadyTagged(position) {
    return (
      subMap.find(obj => obj.position === position) ||
      position === startPosition
    );
  }

  function weighAdjascentPoint(startPosition, weight) {
    const setOfPositions = [];

    if (
      !isAlreadyTagged(startPosition - 1) &&
      startPosition % NUMBER_OF_COLUMNS !== 0
    ) {
      setOfPositions.push({
        from: startPosition,
        position: startPosition - 1,
        weight,
        visited: false,
        isPath: false
      });
    }
    if (
      !isAlreadyTagged(startPosition + 1) &&
      (startPosition + 1) % NUMBER_OF_COLUMNS > 0
    ) {
      setOfPositions.push({
        from: startPosition,
        position: startPosition + 1,
        weight,
        visited: false,
        isPath: false
      });
    }
    if (
      !isAlreadyTagged(startPosition - NUMBER_OF_COLUMNS) &&
      startPosition - NUMBER_OF_COLUMNS >= 0
    ) {
      setOfPositions.push({
        from: startPosition,
        position: startPosition - NUMBER_OF_COLUMNS,
        weight,
        visited: false,
        isPath: false
      });
    }
    if (
      !isAlreadyTagged(startPosition + NUMBER_OF_COLUMNS) &&
      startPosition + NUMBER_OF_COLUMNS <= MAP_SIZE - 1
    ) {
      setOfPositions.push({
        from: startPosition,
        position: startPosition + NUMBER_OF_COLUMNS,
        weight,
        visited: false,
        isPath: false
      });
    }
    if (!didReachTarget(setOfPositions)) {
      return setOfPositions;
    } else {
      setHasReachedTarget(true);
      return setOfPositions;
    }
  }

  function findLowestWeightPoint() {
    let min = 10000;
    let lowestPoint;
    subMap
      .filter(({ visited }) => !visited)
      .forEach(point => {
        if (point.weight < min) {
          min = point.weigh;
          lowestPoint = point;
        }
      });
    const index = subMap.findIndex(
      ({ position }) => position === lowestPoint.position
    );
    subMap[index].visited = true;
    return lowestPoint;
  }

  function setPath() {
    let mapCopy = subMap;
    let targetPoint = mapCopy.find(
      ({ position }) => position === targetPosition
    );
    let isStartPoint = false;
    while (!isStartPoint) {
      const previousPointIndex = mapCopy.findIndex(
        ({ position }) => position === targetPoint.from
      );
      mapCopy[previousPointIndex].isPath = true;
      const previousPoint = mapCopy[previousPointIndex];
      if (previousPoint.position === startPosition) {
        isStartPoint = true;
      }
      targetPoint = previousPoint;
    }
    setSubMap([...mapCopy]);
  }

  useEffect(() => {
    if (startPosition > -1 && !hasReachedTarget && subMap.length > 0) {
      const { position, weight } = findLowestWeightPoint();
      const result = weighAdjascentPoint(position, ++weight);
      setWeight(weight + 1);
      setSubMap([...subMap, ...result]);
    } else if (subMap.length === 0 && startPosition > -1) {
      setSubMap([
        {
          position: startPosition,
          weight: 0,
          visited: false,
          from: startPosition,
          isPath: false
        }
      ]);
    } else if (hasReachedTarget && !done) {
      setPath();
      setDone(true);
    }
  }, [map, hasReachedTarget]);

  const clickHandler = position => {
    if (targetPosition < 0) {
      setTargetPostion(position);
    } else if (startPosition < 0) {
      setStartPosition(position);
    }
  };

  return map.map((square, i) => {
    const coordinates = subMap.find(({ position }) => position === i);
    const props = {
      position: i,
      isTarget: i === targetPosition,
      isStart: i === startPosition,
      weight: coordinates && coordinates.weight,
      isPath: coordinates && coordinates.isPath
    };
    if (startPosition === -1 || targetPosition === -1) {
      return React.cloneElement(square, {
        onClick: clickHandler,
        ...props
      });
    } else {
      return React.cloneElement(square, {
        onClick: null,
        ...props
      });
    }
  });
};

export default Map