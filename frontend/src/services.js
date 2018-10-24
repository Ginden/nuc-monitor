import PingsChart from './PingsChart/PingsChart.js';
import ReactJson from 'react-json-view';
import React from 'react';

export async function getFortune() {
    return fetch('/fortune')
        .then(r => r.json())
        .then(s => <pre>{s}</pre>)
}

export async function getPings() {
    return fetch('/pings')
        .then(r => r.json())
        .then(r => <PingsChart data={r}/>);
}


export async function ips() {
    return fetch('/current-ip')
        .then(r => r.json())
        .then(r => <div>{r.externalIp}</div>)
}

export async function whoami() {
    const divStyle = {
        textAlign: 'left'
    };
    return fetch('/whoami')
        .then(r => r.json())
        .then(r => <ReactJson style={divStyle} displayObjectSize={false} displayDataTypes={false} src={r} />)
}
