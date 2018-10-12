import PingsChart from './PingsChart/PingsChart.js';
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

export async function uptime() {
    return fetch('/uptime')
        .then(r => r.json())
}

export async function ips() {
    return fetch('/current-ip')
        .then(r => r.json())
        .then(r => <div>{r.externalIp}</div>)
}