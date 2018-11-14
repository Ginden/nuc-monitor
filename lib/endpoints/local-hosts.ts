'use strict';

import {
    exec
} from '../utils';

import {
    networkInterfaces
} from 'os';

import {Promise} from 'bluebird';
import _ = require('lodash');


const flattenNmapOutput = (arr: Array<{stdout: string}>) => _(arr)
    .map('stdout')
    .map(s => s.split('\n'))
    .flatten()
    .map(_.unary(_.trim))
    .filter(Boolean);

module.exports = async function () {
    const networks = _(networkInterfaces())
        .omit(['lo'])
        .values()
        .flatten()
        .filter({family: 'IPv4'});
    const myIps = new Set(networks
        .map('address')
        .value());
    const cidrs = networks
        .map('cidr')
        .value();

    const hosts = await Promise.resolve(cidrs)
        .map(cidr => exec(`nmap ${cidr} -n -sP --min-parallelism 10 | grep report | awk '{print $5}'`))
        .then(flattenNmapOutput)
        .filter(ip => !(myIps.has(ip)));


    return {
        cidrs,
        hosts,
        myIps: [...myIps]
    };

};
