'use strict';
import {Request, Response} from 'express';

import path = require('path');
const rel = path.join.bind(path, __dirname);
import express = require('express');
const app = express();
import fs = require('fs');
const port = 4546;
const url = `http://localhost:${port}`;
import {Promise} from 'bluebird';

type GetDataFunc = (...args: any) => PromiseLike<any>;

app.use(express.static(rel('../frontend/build')));

fs.readdirSync(rel('./endpoints'))
    .sort()
    .map((fileName: string) => [fileName.slice(0, -3), require(rel('./endpoints', fileName))])
    .forEach((pair: [string, GetDataFunc]) => {
        const [
            endpoint,
            func
        ] = pair;
        console.log(`${url}/${endpoint}`);
        app.get(`/${endpoint}`, displayData(func));
    });

app.use(defaultErrorHandler);

app.listen(4546, (err: Error): void => console.log(url, err));

function displayData(func: GetDataFunc) {
    return (req: Request, res: Response, next: (err: Error) => void): void => {
        Promise.resolve(req.query || {})
            .then(func)
            .then((data: any) => res.json(data))
            .asCallback(next);
    };
}

function defaultErrorHandler(err: Error, req: Request, res: Response, next: (err: Error) => void) {
    console.log(err);
    res
        .status(500)
        .json({
            error: err.message,
            stack: err.stack
        });
}
