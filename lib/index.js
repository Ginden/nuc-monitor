'use strict';
const path = require('path');
const rel = path.join.bind(path, __dirname);
const express = require('express');
const app = express();
const fs = require('fs');
const port = 4546;
const url = `http://localhost:${port}`;
const Promise = require('bluebird');


/*
const basicAuth  = require('express-basic-auth');

app.use(basicAuth({
    users: {
        'admin': process.env.NUC_MONITOR_PASSWORD || ''
    },
    challenge: true
}));
*/
app.use(express.static(rel('../frontend/build')));


fs.readdirSync(rel('./endpoints'))
    .map(fileName => [fileName.slice(0,-3), require(rel('./endpoints', fileName))])
    .forEach(([endpoint, func]) => {
        console.log(`${url}/${endpoint}`);
        app.get(`/${endpoint}`, displayData(func));
    });

app.use(defaultErrorHandler);

app.listen(4546, (err) => console.log(url));

function displayData(func) {
    return (req, res, next) => {
        Promise.resolve(req.query || {})
            .then(func)
            .then(data => res.json(data))
            .asCallback(next);
    }
}

function defaultErrorHandler(err, req, res, next) {
    console.log(err);
    res
        .status(500)
        .json({
            error: err.message,
            stack: err.stack
        });
}
