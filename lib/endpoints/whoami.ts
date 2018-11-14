'use strict';


import {
    exec
} from '../utils';

import {Promise} from 'bluebird';

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

function execValue(cmd: string) {
    return Promise.resolve(exec(cmd))
        .get('stdout')
        .catch((err: Error) => ({
            error: err.message,
            stack: err.stack
        }));
}

module.exports = async function () {
    return Promise.props(Object.assign({
        whoami: execValue('whoami'),
        env: pick(process.env, ['HOME', 'PWD', 'USER', 'LOGNAME', 'LANG']),
        id: execValue('id'),
        groups: execValue('groups'),
        uptime: execValue('uptime -p')
    }, values));
};

function memoryToHumanReadable(bytes: number) : string {
    return (bytes/(1024*1024)).toFixed(1).concat('MB');
}
