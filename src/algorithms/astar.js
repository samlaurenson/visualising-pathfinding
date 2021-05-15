async function AStar(nodeList, startNode, goalNode, boardHeight, boardWidth) {
    calculateConnections(nodeList, boardHeight, boardWidth);
    let openList = [];
    let path = [];

    let gScore = [];
    let fScore = [];

    //Filling gScore, fScore and path arrays
    for(let i = 0; i < boardHeight * boardWidth; ++i)
    {
        gScore.push(Number.MAX_SAFE_INTEGER);
        fScore.push(0);
        path.push(0);
    }

    openList.push(startNode);
    gScore[startNode.id] = 0;
    fScore[startNode.id] = 0;

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
            //Path has been found - draw the path
            let finalPath = [];
            let n = goalNode.id;
            let cell;

            while(n !== startNode.id)
            {
                finalPath.push(path[n]);
                if(n !== goalNode.id)
                {
                    cell = document.getElementById(n);
                    cell.className = 'path';
                }
                n = path[n];
            }

            return "Found!";
        }

        for(let i = 0; i < openList.length; ++i)
        {
            if(openList[i].id === currentNode.id)
            {
                openList.splice(i, 1);
                break;
            }
        }

        await exploreConnections(currentNode, gScore, fScore, goalNode, boardHeight, boardWidth, openList, path);
    }
    return undefined; //if goal was not found
}

async function exploreConnections(currentNode, gScore, fScore, goalNode, boardHeight, boardWidth, openList, path)
{
    for(let i = 0; i < currentNode.connections.length; ++i)
    {
        let neighbour = currentNode.connections[i];

        let gVal = gScore[currentNode.id] + 1; //Since this is a grid, will only need to increase distance by 1
            
        //If the distance travelled from current node to this neighbour node is less than the distance travelled already
        //(If there is a shorter route, then follow this one)
        if(gVal <= gScore[neighbour.id])
        {
            path[neighbour.id] = currentNode.id; //Neighbour will know where it has come from by placing it's parent in the path array
            gScore[neighbour.id] = gVal;
            let heuristic = calculateHeuristic(neighbour.id, goalNode.id, boardHeight, boardWidth);
            fScore[neighbour.id] = gVal + heuristic;

            //If neighbour node is not in the open list - then it will be added
            if(!openList.includes(neighbour))
            {
                await sleep(10 * i);
                openList.push(neighbour);

                //Making if statement to prevent goal node type being changed
                if(neighbour.id !== goalNode.id)
                {
                    neighbour.type = 'open';
                    let cell = document.getElementById(neighbour.id);
                    cell.className = neighbour.type;
                }
            }
        }
    }
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

//Function to get the neighbours/connections for each node
function calculateConnections(nodes, height, width)
{
    //Nested for loop to get connections for every node in the grid
    for(let x = 0; x < nodes.length; ++x)
    {
        for(let y = 0; y < nodes[x].length; ++y)
        {
            //If selected node is a wall - then skip it
            if(nodes[x][y].type === 'wall')
            {
                continue;
            }

            //If there is something above this node
            if(x - 1 >= 0 && nodes[x-1][y].type !== 'wall')
            {
                nodes[x][y].connections.push(nodes[x-1][y]);
            }

            //there is a node below - add to connection
            if(x + 1 < height && nodes[x+1][y].type !== 'wall')
            {
                nodes[x][y].connections.push(nodes[x+1][y]);
            }

            //there is a node to left - add to connection
            if(y - 1 >= 0 && nodes[x][y-1].type !== 'wall')
            {
                nodes[x][y].connections.push(nodes[x][y-1]);
            }

            //there is a node to right - add to connection
            if(y + 1 < width && nodes[x][y+1].type !== 'wall')
            {
                nodes[x][y].connections.push(nodes[x][y+1]);
            }

            //DIAGONALS

            //TOP LEFT
            if(x-1>=0 && y-1>=0 && nodes[x-1][y-1].type !== 'wall')
            {
                nodes[x][y].connections.push(nodes[x-1][y-1]);
            }

            //TOP RIGHT
            if(x-1>=0 && y+1 < width && nodes[x-1][y+1].type !== 'wall')
            {
                nodes[x][y].connections.push(nodes[x-1][y+1]);
            }

            //BOTTOM LEFT
            if(x+1 < height && y-1>=0 && nodes[x+1][y-1].type !== 'wall')
            {
                nodes[x][y].connections.push(nodes[x+1][y-1]);
            }

            //BOTTOM RIGHT
            if(x+1 < height && y+1 < width && nodes[x+1][y+1].type !== 'wall')
            {
                nodes[x][y].connections.push(nodes[x+1][y+1]);
            }
        }
    }
}

function calculateHeuristic(curr, goal, height, width)
{
    let current = new coordinate(((curr % width)), Math.floor(curr/width));
    let goalCoord = new coordinate(((goal % width)), Math.floor(goal/width));
    return Math.sqrt((goalCoord.x - current.x)**2 + (goalCoord.y - current.y)**2);
}

function coordinate(x, y)
{
    this.x = x;
    this.y = y;
}

export default AStar;