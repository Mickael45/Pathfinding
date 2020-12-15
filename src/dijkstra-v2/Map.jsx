import React from 'react'
import './Map.css'

const NUMBER_OF_COLUMNS = 74;
const NUMBER_OF_ROWS = 34;

const startNodeId = 'startPoint'
const endNodeId = 'endPoint'

let startSet = false
let endSet = false

const giveWeightToNode = (weight, from, node) =>{
  node.innerHTML = weight
  node.dataset.weight = weight
  node.dataset.from = from
}

const setNodeAsVisited = (node) => {
  if (node.id !== startNodeId) {
    node.classList.add('visited')
  }
  node.dataset.visited = 'true'
}

const wasNodeVisited = (node) => node && node.dataset.visited === 'true'

const getNodeByIndex = (index) => document.querySelector(`div.square[data-index='${index}']`)

const nodeIndexValidator = {
  TopLeft: (topLeftNodeIndex: number, visitedNodeIndex: number) => topLeftNodeIndex < 0 || topLeftNodeIndex % NUMBER_OF_COLUMNS > visitedNodeIndex % NUMBER_OF_COLUMNS,
  Top: (topNodeIndex: number) => topNodeIndex < 0,
  TopRight: (topRightNodeIndex: number, visitedNodeIndex: number) => topRightNodeIndex < 0 || topRightNodeIndex % NUMBER_OF_COLUMNS < visitedNodeIndex % NUMBER_OF_COLUMNS,
  Right: (rightNodeIndex: number, visitedNodeIndex: number) => rightNodeIndex > NUMBER_OF_COLUMNS * NUMBER_OF_ROWS || rightNodeIndex % NUMBER_OF_COLUMNS < visitedNodeIndex % NUMBER_OF_COLUMNS ,
  BottomRight: (bottomRightNodeIndex: number, visitedNodeIndex: number) => bottomRightNodeIndex > NUMBER_OF_COLUMNS * NUMBER_OF_ROWS || bottomRightNodeIndex % NUMBER_OF_COLUMNS < visitedNodeIndex % NUMBER_OF_COLUMNS,
  Bottom: (bottomNodeIndex: number) =>  bottomNodeIndex > NUMBER_OF_COLUMNS * NUMBER_OF_ROWS ,
  BottomLeft: (bottomLeftNodeIndex: number, visitedNodeIndex: number) => bottomLeftNodeIndex > NUMBER_OF_COLUMNS * NUMBER_OF_ROWS || bottomLeftNodeIndex % NUMBER_OF_COLUMNS > visitedNodeIndex % NUMBER_OF_COLUMNS,
  Left: (leftNodeIndex: number, visitedNodeIndex: number) => leftNodeIndex < 0 || leftNodeIndex % NUMBER_OF_COLUMNS > visitedNodeIndex % NUMBER_OF_COLUMNS,
}

const isNewWeightHigherThanCurrent =(nodeNewWeight: number, nodeCurrentWeight: number) => nodeCurrentWeight !== -1 && nodeNewWeight > nodeCurrentWeight

const nodeIndexCalculator = {
 TopLeft: (visitedNodeIndex: number, distanceFromVisitedNode: number) => visitedNodeIndex - (NUMBER_OF_COLUMNS + distanceFromVisitedNode),
 Top: (visitedNodeIndex: number) => visitedNodeIndex - NUMBER_OF_COLUMNS,
 TopRight: (visitedNodeIndex: number, distanceFromVisitedNode: number) => visitedNodeIndex - (NUMBER_OF_COLUMNS - distanceFromVisitedNode),
 Right: (visitedNodeIndex: number, distanceFromVisitedNode: number) => visitedNodeIndex + distanceFromVisitedNode,
 BottomRight: (visitedNodeIndex: number, distanceFromVisitedNode: number) => visitedNodeIndex + NUMBER_OF_COLUMNS + distanceFromVisitedNode,
 Bottom: (visitedNodeIndex: number) => visitedNodeIndex + NUMBER_OF_COLUMNS,
 BottomLeft: (visitedNodeIndex: number, distanceFromVisitedNode: number) => visitedNodeIndex + NUMBER_OF_COLUMNS - distanceFromVisitedNode,
 Left: (visitedNodeIndex: number, distanceFromVisitedNode: number) => visitedNodeIndex - distanceFromVisitedNode
}

const setNodeWeight = (visitedNodeIndex: number, visitedNodeWeight: number, distanceFromVisitedNode: number, position: string) => {
  const nodeIndex = nodeIndexCalculator[position](visitedNodeIndex, distanceFromVisitedNode)
  const node = getNodeByIndex(nodeIndex)

  if (!node) {
    return
  }

  const nodeNewWeight = distanceFromVisitedNode + visitedNodeWeight
  const nodeCurrentWeight = parseInt(node.dataset.weight, 10)

  if (wasNodeVisited(node) || nodeIndexValidator[position](nodeIndex, visitedNodeIndex) || isNewWeightHigherThanCurrent(nodeNewWeight, nodeCurrentWeight)) {
    return
  }
  giveWeightToNode(nodeNewWeight, visitedNodeIndex, node)
}

const getAllNonVisitedWieghtedNodes = () => document.querySelectorAll("div.square:not([data-weight='-1'])[data-visited='false']")

const setWeightToDirectNeighbors = (visitedNodeIndex: number, visitedNodeWeight: number, distanceFromVisitedNode: number) => {
  const positions = ['Top', 'Right',  'Bottom',  'Left']

  positions.forEach(position => setNodeWeight(visitedNodeIndex, visitedNodeWeight, distanceFromVisitedNode, position))
}

const wasEndPointReached = () => document.getElementById(endNodeId).dataset.weight === '-1'

const run = () => {
  while (wasEndPointReached()) {
    const nodes = getAllNonVisitedWieghtedNodes()

    if (!nodes || nodes.length === 0) {
      return
    }
    nodes.forEach(node => {
      const distanceFromVisitedNode = 1
      const { dataset: { weight, index } } = node
    
      setWeightToDirectNeighbors(parseInt(index, 10), parseInt(weight, 10), distanceFromVisitedNode)
      setNodeAsVisited(node)
    })
  }
}

const handleNodeClick = (e) => {
          if (startSet && e.target.style.backgroundColor !== 'green' && !endSet) {
                    e.target.style.backgroundColor = 'red'
                    e.target.id = endNodeId
                    endSet = true
                    run()     
          } else if (!startSet) {
                    e.target.style.backgroundColor = 'green'
                    e.target.id = startNodeId
                    e.target.dataset.weight = 0
                    startSet = true
          }
}


const Node = ({index}) => <div data-index={index} data-weight={-1} data-from={-1} data-visited={false} className='square' onClick={handleNodeClick}/>

const fillMap = () => {
          const map = []
          const numberOfNode = NUMBER_OF_COLUMNS * NUMBER_OF_ROWS

          for (let i = 0; i < numberOfNode; i++) {
                    map.push(<Node index={i} />)
          }
          return map
}

const Map = () => {
          const map = fillMap()
          return map
}

export default Map