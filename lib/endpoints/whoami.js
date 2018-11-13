'use strict';

const {
    exec
} = require('./../utils');
const {
    userInfo,
    arch,
    freemem,
    hostname,
    networkInterfaces,
    platform,
    release,
    totalmem,
} = require('os');
const _ = require('lodash');

const values = {
    userInfo: userInfo(),
    arch: arch(),
    memory: {
        get free() {
            return memoryToHumanReadable(freemem());
        },
        get total() {
            return memoryToHumanReadable(totalmem());
        }
    },
    network: {
        hostname: hostname(),
        get interfaces() {
            return _.omit(networkInterfaces(), ['lo']);
        }
    },
    platform: platform(),
    release: release()
};

const {
    pick
} = require('lodash');

const Promise = require('bluebird');
const P = z => Promise.resolve(z);

module.exports = async function () {
    return Promise.props(Object.assign({
        whoami: errorAsValue(P(exec('whoami')).get('stdout')),
        env: pick(process.env, ['HOME', 'PWD', 'USER', 'LOGNAME', 'LANG']),
        id: errorAsValue(P(exec('id')).get('stdout')),
        groups: errorAsValue(P(exec('groups')).get('stdout')),
        uptime: (await exec('uptime -p')).stdout
    }, values));
};

function errorAsValue(p) {
    return p.catch(err => ({
        error: err.message
    }))
}

function memoryToHumanReadable(bytes) {
    return (bytes/(1024*1024)).toFixed(1).concat('MB');
}
