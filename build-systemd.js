#!/usr/bin/env node

const fs = require('fs');

const systemDTemplate = fs.readFileSync(`${__dirname}/systemd.service.template`, 'utf8');
const pkg = require('./package');

const strippedPathEnv = process.env.PATH
    .split(':')
    .filter(el => !el.includes(process.env.HOME))
    .join(':');

const replaces = [
    ['%DESCRIPTION%', pkg.description],
    ['%APP_PATH%', __dirname],
    ['%APP_NAME%', pkg.name],
    ['%PATH%', strippedPathEnv]
];


const endResult = replaces.reduce((template, [pattern, toReplace]) => {
    const rex = new RegExp(pattern, 'g');
    return template.replace(rex, toReplace);
}, systemDTemplate);

const outputPath = `${__dirname}/${pkg.name}.service`;

fs.writeFileSync(outputPath, endResult);

console.log(outputPath);
