'use strict';

const {
    exec
} = require('./../utils');

module.exports = async function () {
    const externalIpPromise = exec('wget -qO- ipecho.net/plain');
    let externalIp = null;
    let error = undefined;
    try {
        externalIp = (await externalIpPromise).stdout;
    } catch(err) {
        console.log(err);
        error = err.message;
    }
    return {
        externalIp,
        error
    };
};
