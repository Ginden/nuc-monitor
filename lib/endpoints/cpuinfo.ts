'use strict';

import {
    exec,
    dictionary
} from '../utils';

module.exports = async function() {
    const cpuOutput = (await exec('cat /proc/cpuinfo')).stdout;
    return cpuOutput
        .split('\n\n')
        .map((core: string) => {
            const props = core.split('\n');
            const obj = dictionary();
            props
                .map((line) => line.split(':', 2).map((e) => e.trim()))
                .forEach(([key, value]) => {
                    obj[key] = value;
                });
            return obj;
        });
};
