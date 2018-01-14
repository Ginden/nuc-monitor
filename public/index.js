'use strict';

function addCell(content) {
    const table = document.querySelector('table#data'); //tbody
    const lastRow = [...table.querySelectorAll('tr')].reverse()[0];
    const row = (!lastRow || table.lastElementChild.childElementCount === 2) ? table.appendChild(document.createElement('tr')) : table.lastElementChild;
    const cell = row.appendChild(document.createElement('td'));
    if (typeof content === 'string') {
        cell.innerHTML = content;
    } else {
        cell.appendChild(content);
    }
}

function fortune() {
    return fetch('/fortune')
        .then(r => r.json());
}

function uptime() {
    return fetch('/uptime')
        .then(r => r.json());
}

Promise.all([
    fortune(),
    uptime()
])
    .then(a => a.map(addCell));