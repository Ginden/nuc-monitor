'use strict';

const {
    exec
} = require('./../utils');


module.exports = async function () {
    const todaysPings = (await exec('cat $HOME/logs/pings/$(date -u +%Y.%m.%d).log | tail -n 500')).stdout;
    return parseCustomPings(todaysPings);
};

function parseCustomPings(output) {
    const lines = output
        .split('\n');
    return lines.map(line => {
        const time = line.slice(0, 5);
        const [hour, minute] = time.split(':').map(Number);
        const normalizedMinute = minute - minute % 5; // If execution took more than minute, round it
        const pingOutput = line.slice('00:25:13 64 bytes from '.length);
        const [host] = pingOutput.split(':', 1);
        const [, timeTook] = pingOutput.match(/time=(\d*\.\d)/);
        return {
            time: `${hour}:${normalizedMinute}`,
            host,
            timeTook: Number(timeTook)
        };
    });
}

