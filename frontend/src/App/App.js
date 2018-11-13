import React, {Component} from 'react';
import './App.css';
import Tile from '../Tile/Tile.js';
import {
    getFortune,
    getPings,
    ips,
    whoami,
    sensors
} from '../services.js';

const tiles = [
    ['Pings', getPings],
    ['IP', ips],
    ['whoami', whoami],
    ['Sensors', sensors]
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
