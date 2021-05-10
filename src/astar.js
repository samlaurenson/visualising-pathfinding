function AStar(nodeList, startNode, goalNode, boardHeight, boardWidth) {
    calculateConnections(nodeList, boardHeight, boardWidth);
    let openList = [];
    let path = [];

    let gScore = [];
    let fScore = [];

    //Filling the gScore array with maximum integer values
    for(let i = 0; i < boardHeight * boardWidth; ++i)
    {
        gScore.push(Number.MAX_SAFE_INTEGER);
        fScore.push(0);
        path.push(-1);
    }

    openList.push(startNode);
    gScore[startNode.id] = 0;
    fScore[startNode.id] = 0;

    // let minFVal = Number.MAX_SAFE_INTEGER;

    while(openList.length !== 0)
    {
        let currentNode;
        let minFVal = Number.MAX_SAFE_INTEGER;

        openList.forEach(function(node) {
            if(fScore[node.id] < minFVal)
            {
                minFVal = fScore[node.id];
                currentNode = node;
            }
        });

        if(currentNode === goalNode)
        {
            //Path has been found - return path
            let finalPath = [];
            
            //traversing through the path array to get back to beginning to find the shortest path taken
            while(currentNode.id !== -1)
            {
                finalPath.push(path[currentNode.id] + 1);
                currentNode = path[currentNode.id];
            }

            finalPath.reverse();

            return "Found!";
        }

        openList.splice(currentNode.id, 1);
        //turn currentnode.id blue

        //Turn nodes green if they are in the connections for the node
        currentNode.connections.forEach(function(neighbour) {
            let gVal = gScore[currentNode.id] + 1; //Since this is a grid, will only need to increase distance by 1
            
            //If the distance travelled from current node to this neighbour node is less than the distance travelled already
            //(If there is a shorter route, then follow this one)
            if(gVal < gScore[neighbour])
            {
                path[neighbour] = currentNode.id; //Neighbour will know where it has come from by placing it's parent in the path array
                gScore[neighbour] = gVal;
                let heuristic = calculateHeuristic(neighbour, goalNode.id, boardHeight, boardWidth);
                fScore[neighbour] = gVal + heuristic;

                //If neighbour node is not in the open list - then it will be added
                if(!openList.contains(neighbour))
                {
                    openList.push(neighbour);
                }
            }
        });    
    }
    return undefined; //if goal was not found
}

//Function to get the neighbours/connections for each node
//Only top, bottom, left and right nodes are counted as connections. Does not do diagonals.
function calculateConnections(nodes, height, width)
{
    //(this.height * this.width) - this.width >>> First node ID on last row, any ID greater  than, or equal to this is on the last row of the grid
    //this.width >>> Anything less than, or equal to this is on the first row of the grid
    // ID mod width >>> produces column the ID is on
    // floor( (ID/width) + 1) >>> prodcues the row the ID is on (i think)
    for(let node in nodes)
    {
        let column = (node.id % width) - 1; //Doing -1 as arrays start from 0 
        let row = Math.floor(node.id/width); //Assuming row starts at 0, otherwise (node.id/width) + 1

        let currentNodeCoords = new coordinate(row, column);
        //To get the ID of a node from the row and column, just multiply them

        //there is a node left - add to connection
        if(currentNodeCoords.x - 1 >= 0)
        {
            node.connections.push(currentNodeCoords.x-1 * currentNodeCoords.y); //Adding the adjacent node ID to the connections of the current node
        }

        //there is a node right - add to connection
        if(currentNodeCoords.x + 1 <= width)
        {
            node.connections.push(currentNodeCoords.x+1 * currentNodeCoords.y); //Adding the adjacent node ID to the connections of the current node
        }

        //there is a node above - add to connection
        if(currentNodeCoords.y - 1 >= 0)
        {
            node.connections.push(currentNodeCoords.x * currentNodeCoords.y-1); //Adding the adjacent node ID to the connections of the current node
        }

        //there is a node below - add to connection
        if(currentNodeCoords.y + 1 <= height)
        {
            node.connections.push(currentNodeCoords.x * currentNodeCoords.y+1); //Adding the adjacent node ID to the connections of the current node
        }
    }
}

function calculateHeuristic(curr, goal, height, width)
{
    let current = new coordinate(((curr % width) - 1), Math.floor(curr/width));
    let goalCoord = new coordinate(((goal % width) - 1), Math.floor(goal/width));
    return Math.sqrt((goalCoord.x - current.x)**2 + (goalCoord.y - current.y)**2);
}

function coordinate(x, y)
{
    this.x = x;
    this.y = y;
}

export default AStar;