'use strict';
const path = require('path');
const rel = path.join.bind(path, __dirname);
const express = require('express');
const app = express();
const fs = require('fs');
const port = 4546;
const url = `http://localhost:${port}`;



const basicAuth  = require('express-basic-auth');
/*
app.use(basicAuth({
    users: {
        'admin': process.env.NUC_MONITOR_PASSWORD || ''
    },
    challenge: true
}));
*/
app.use(express.static(rel('../public')));


fs.readdirSync(rel('./endpoints'))
    .map(fileName => [fileName.slice(0,-3), require(rel('./endpoints', fileName))])
    .forEach(([endpoint, func]) => {
        console.log(`${url}/${endpoint}`);
        app.get(`/${endpoint}`, displayData(func));
    });


app.listen(4546, (err) => console.log(url));

function displayData(func) {
    return (req, res, next) => {
        Promise.resolve(req.query || {})
            .then(func)
            .then(data => res.json(data))
            .catch(next);
    }
}