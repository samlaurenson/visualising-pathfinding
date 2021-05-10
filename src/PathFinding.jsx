import React from 'react';
import Grid from './Grid.js';

//let grid = undefined;

class PathFind extends React.Component {
    constructor(props)
    {
        super(props);
        this.handleLoad = this.handleLoad.bind(this);
        this.startAlg = this.startAlg.bind(this);
        this.grid = new Grid(15, 15);
    }

    componentDidMount() {
        window.addEventListener('load', this.handleLoad);
    }

    handleLoad() {
        //Build();
        this.grid.init();
    }

    startAlg() {
        this.grid.loadPathFind();
    }

    render() {
        return (
            <div id='grid'>
                <button id="startPathing" onClick={this.startAlg}>Start</button>
                <table id='board'></table>
            </div>
        ); 
    }
}

// function Build() {
//     grid = new Grid(15, 15);
//     grid.init();
//     console.log("Testing function only runs once");
//     //grid.loadPathfind();
// }

export default PathFind;
