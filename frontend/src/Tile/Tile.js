import './Tile.css';
import React, { Component } from 'react';

class Tile extends React.Component {
    constructor(props) {
        super(props);
        const {func, name} = props;
        this.state = {
            currentValue: null,
            name,
            func
        };
    }

    render() {
        return (
            <div className="Tile">
                <h1>{this.props.name}</h1>
                {this.state.currentValue}
            </div>
        );
    }

    componentDidMount() {
        Promise.resolve(null)
            .then(this.props.func)
            .then(data => this.setState({currentValue: data}))
            .catch(err => this.setState({currentValue: err.message}));
    }
}

export default Tile;