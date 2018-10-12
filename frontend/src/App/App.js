import React, {Component} from 'react';
import './App.css';
import Tile from '../Tile/Tile.js';
import {
    getFortune,
    getPings,
    uptime,
    ips
} from '../services.js';

const tiles = [
    ['Fortune', getFortune],
    ['Pings', getPings],
    ['Uptime', uptime],
    ['IP', ips]
];

class App extends Component {
    render() {
        return (
            <div className="App">
                {
                    tiles.map(([name, func]) => <Tile name={name} func={func}/>)
                }
            </div>
        );
    }
}

export default App;
