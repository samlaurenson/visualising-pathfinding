import './stylesheet.css';
import Node from './Nodes';
import AStar from './astar';

function Grid(height, width) {
    this.height = height;
    this.width = width;
    this.gridArray = [];
    this.nodes = [];
    //this.algorithm = undefined;
}

Grid.prototype.init = function() {
    this.createGrid();
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
            } else if(nodeID === 120)
            {
                node = new Node(nodeID, 'endPoint');
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

Grid.prototype.loadPathfind = function () {
    AStar(this.nodes, getNodeByID(23, this.height, this.width, this.nodes), getNodeByID(120, this.height, this.width, this.nodes), this.height, this.width);
};

function getNodeByID(nodeID, h, width, nodes)
{
    // let column = (nodeID % width) - 1; //Doing -1 as arrays start from 0 
    let column = (nodeID % width); //Doing -1 as arrays start from 0 
    let row = Math.floor(nodeID / width); //Assuming row starts at 0, otherwise (node.id/width) + 1
    return nodes[row][column];
}

export default  Grid;