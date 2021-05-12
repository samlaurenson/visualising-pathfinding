import React from 'react';
import Grid from './Grid.js';

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
        this.grid.init();
    }

    startAlg() {
        this.grid.loadPathfind();
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

export default PathFind;
