import './stylesheet.css';
import Node from './Nodes';
import AStar from './algorithms/astar';

function Grid(height, width) {
    this.height = height;
    this.width = width;
    this.gridArray = [];
    this.nodes = [];
    this.start = undefined;
    this.end = undefined;
    this.working = false;
    this.dragging = undefined; //Used to check if squares are currently being dragged
    //this.algorithm = undefined;
}

Grid.prototype.init = function() {
    this.createGrid();
    this.addEventListeners();
};

Grid.prototype.createGrid = function() {
    let gridHTML = "";

    for(let r = 0; r < this.height; ++r)
    {
        let row = [];
        let rowHTML = `<tr id="rowID ${r}">`;
        this.nodes.push([]);
        for(let c = 0; c < this.width; ++c)
        {
            //Adding nodes to the grid
            let nodeID = undefined;
            if(r !== 0)
            {
                nodeID = (r * this.width) + c;
            } else {
                nodeID = c;
            }

            let node = undefined;
            if(nodeID === 23)
            {
                node = new Node(nodeID, 'startPoint');
                this.start = node;
            } else if(nodeID === 120)
            {
                node = new Node(nodeID, 'endPoint');
                this.end = node;
            }
            else {
                node = new Node(nodeID, 'inactive');
            }

            row.push(node);
            rowHTML += `<td id="${nodeID}" class="${node.type}"></td>`; //Adding the row to the HTML table
            this.nodes[r].push(node);
        }
        this.gridArray.push(row);
        gridHTML += rowHTML +  `</tr>`;
    }
    //get board element and set the board elements innerHTML to gridHTML
    let grid = document.getElementById("board");
    grid.innerHTML = gridHTML;
};

Grid.prototype.loadPathfind = async function () {
    //Probably a better way of doing this - but the grid has a property to store whether it is currently working on an algorithm
    //If it is - then the reset button will not work until the algorithm has finished
    //Once algorithm is finished then the "working" property will be set to false and the user can press the reset button
    this.working = true;
    await AStar(this.nodes, findNodeWithID(this.start.id, this.nodes), findNodeWithID(this.end.id, this.nodes), this.height, this.width);
    this.working = false;
};

//Method to get rid of the yellow tiles (discovered path) and blue tiles (tiles in open list)
Grid.prototype.clearGrid = function() {
    if(this.working === true) { return; }
    for(let r = 0; r < this.nodes.length; ++r)
    {
        for(let c = 0; c < this.nodes[r].length; ++c)
        {
            let cell = document.getElementById(this.nodes[r][c].id);
            if(cell.className === 'path' || cell.className === 'open')
            {
                cell.className = 'inactive';
            }
        }
    }
};

Grid.prototype.addEventListeners = function() {
    for(let r = 0; r < this.nodes.length; ++r)
    {
        for(let c = 0; c < this.nodes[r].length; ++c)
        {
            let cell = document.getElementById(this.nodes[r][c].id);
            //cell.draggable = true;

            //When user clicks on an inactive square - will turn in to a wall
            //if user clicks on a wall then the square will turn inactive
            cell.onmousedown = (e) => {
                e.preventDefault();
                
                //If algorithm is already being worked then don't allow mouse events
                if(this.working) { return; }

                if(cell.className === 'startPoint' || cell.className === 'endPoint') {
                    //Set node to drag to the current start/end node 
                    this.dragging = this.nodes[r][c];

                    //Setting the start/end to undefined (will be used to check if the user has dragged either points off the grid)
                    cell.className === 'startPoint' ? this.start = undefined : this.end = undefined;

                    //Make this node inactive
                    this.nodes[r][c] = 'inactive';
                    cell.className = 'inactive';
                    return; 
                } 
                cell.className = cell.className === 'inactive' ? 'wall' : 'inactive';
                this.nodes[r][c].type = cell.className;
            }

            // cell.onmousemove = (e) => {
            //     if(this.dragging === undefined) { return; }
            //     //this.dragging.draggable = true;
            // }

            cell.onmouseup = (e) => {
                if(this.dragging === undefined) { return; }
                cell.className = this.dragging.type;
                this.nodes[r][c].type = this.dragging.type;
                this.dragging.type === 'startPoint' ? this.start = this.nodes[r][c] : this.end = this.nodes[r][c];
                this.clearGrid(); 
                this.dragging = undefined;
            }
        }
    }

    //In case the user drags the start or end point off the grid
    //they will be placed back in their default spots
    window.onmouseup = (e) => {
        console.log("up");
        if(this.start === undefined)
        {
            this.clearGrid();
            this.start = findNodeWithID(23, this.nodes);
            document.getElementById(this.start.id).className = this.start.type;
        }

        if(this.end === undefined)
        {
            this.clearGrid();
            this.end = findNodeWithID(120, this.nodes);
            document.getElementById(this.end.id).className = this.end.type;
        }
    }
};

//This function will find the node with the ID no matter where it is on the grid
//Unfortunately, this comes at a cost of greater time complexity than the "getNodeByID" function as it has to search every node
//So if it would be possible to swap ID's when moved in the grid that could improve program speeds
//But for now this will do. :)
function findNodeWithID(lookForID, nodes)
{
    for(let r = 0; r < nodes.length; ++r)
    {
        for(let n = 0; n < nodes[r].length; ++n)
        {
            if(nodes[r][n].id === lookForID)
            {
                return nodes[r][n];
            }
        }
    }
    return undefined;
}

function getNodeByID(nodeID, h, width, nodes)
{
    //Function that gets nodes by ID assuming they have not been moved on grid 
    let column = (nodeID % width); 
    let row = Math.floor(nodeID / width); //Assuming row starts at 0, otherwise (node.id/width) + 1
    return nodes[row][column];
}

export default  Grid;