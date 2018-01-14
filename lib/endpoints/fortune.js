'use strict';

const {
    exec
} = require('./../utils');

module.exports = async function () {
    return (await exec('fortune')).stdout;
};