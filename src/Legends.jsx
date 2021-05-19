import React from 'react';
import './stylesheet.css';

class Legends extends React.Component {
    render() {
        return(
        <div class='leg-bar'>
            <ul>
                <li id='legend'>
                    <div id='icon' class='startLegend'></div>
                    Start Node
                </li>
                <li id='legend'>
                    <div id='icon' class='goalLegend'></div>
                    Goal Node
                </li>
                <li id='legend'>
                    <div id='icon' class='openLegend'></div>
                    Open Node
                </li>
                <li id='legend'>
                    <div id='icon' class='visitedLegend'></div>
                    Visited Node
                </li>
                <li id='legend'>
                    <div id='icon' class='pathLegend'></div>
                    Path Node
                </li>
                <li id='legend'>
                    <div id='icon' class='wallLegend'></div>
                    Wall Node
                </li>
            </ul>
        </div>
        );
    }
}

export default Legends;