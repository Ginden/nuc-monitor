import PingsChart from './PingsChart/PingsChart.js';
import ReactJson from 'react-json-view';
import React from 'react';
import {
    toPairs,
    flattenDeep
} from 'lodash-es';

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

export async function sensors() {
    return fetch('/sensors')
        .then(r => r.json())
        .then(sensorsOutput => {
            const values = flattenDeep(toPairs(sensorsOutput).map(([groupName, elements]) => {
                return toPairs(elements).map(([name, {input, crit, max}]) => {
                    return {
                        groupName,
                        name,
                        input,
                        maximum: crit || max
                    };
                })
            })).map(({groupName, name, input, maximum}) => <tr>
                <td>{groupName}</td>
                <td>{name}</td>
                <td>{input}&deg;C</td>
                <td>{maximum}&deg;C</td>
            </tr>);
            return <table className="sensors-table">
                <thead>
                    <tr>
                        <td>Group</td>
                        <td>Element</td>
                        <td>Value</td>
                        <td>Max</td>
                    </tr>
                </thead>
                <tbody>
                    {values}
                </tbody>
            </table>
        })
}
