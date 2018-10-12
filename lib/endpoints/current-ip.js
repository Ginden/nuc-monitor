'use strict';

const {
    exec
} = require('./../utils');

module.exports = async function () {
    const externalIpPromise = exec('wget -qO- ipecho.net/plain');
    let externalIp = null;
    try {
        externalIp = (await externalIpPromise).stdout;
    } catch(err) {
        console.log(err);
    }
    return {
        externalIp
    };
};