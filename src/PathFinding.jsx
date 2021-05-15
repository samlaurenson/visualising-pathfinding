import React from 'react';
import Grid from './Grid.js';

class PathFind extends React.Component {
    constructor(props)
    {
        super(props);
        this.handleLoad = this.handleLoad.bind(this);
        this.startAlg = this.startAlg.bind(this);
        this.clearGrid = this.clearGrid.bind(this);
        this.grid = new Grid(15, 15);
    }

    componentDidMount() {
        window.addEventListener('load', this.handleLoad);
    }

    handleLoad() {
        this.grid.init();
    }

    startAlg() {
        this.grid.clearGrid();
        this.grid.loadPathfind();
    }

    clearGrid() {
        this.grid.clearGrid();
    }

    render() {
        return (
            <div id='grid'>
                <button id="startPathing" onClick={this.startAlg}>Start</button>
                <button id="clear" onClick={this.clearGrid}>Reset</button>
                <table id='board'></table>
            </div>
        ); 
    }
}

export default PathFind;
