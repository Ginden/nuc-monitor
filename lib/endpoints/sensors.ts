'use strict';

import {
    exec,
    dictionary
} from '../utils';

module.exports = async function () {
    const {stdout} = await exec('sensors -u -A');
    return parseSensorsOutput(stdout);
};

function parseSensorsOutput(output: string) {
    const lines = output
        .split('\n')
        .map(e => e.trimRight());
    const groups = dictionary();
    let currentGroup = '';
    let currentDevice = '';
    for(const line of lines) {
        if (!currentGroup) {
            currentGroup = line;
            groups[currentGroup] = dictionary();
        } else if (line === '') {
            currentGroup = '';
            currentDevice = '';
        } else if (line.startsWith('Adapter:')) {
            continue;
        } else if (line.endsWith(':')) {
            currentDevice = line.slice(0, -1);
            groups[currentGroup][currentDevice] = dictionary();
        } else if(line.startsWith('  ' /* Two spaces */)) {
            const withoutPrefix = line.slice(line.indexOf('_')+1);
            const [name, temperature] = withoutPrefix.split(': ');
            groups[currentGroup][currentDevice][name] = Number(temperature);
        }
    }
    delete groups[''];
    return groups;
}

