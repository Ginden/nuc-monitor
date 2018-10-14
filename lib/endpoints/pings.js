'use strict';

const {
    exec
} = require('./../utils');
const _ = require('lodash');
const stats = require("stats-lite");

module.exports = async function () {
    const todaysPings = (await exec('cat $HOME/logs/pings/$(date -u +%Y.%m.%d).log | tail -n 1000')).stdout;
    const valuesArray = parseCustomPings(todaysPings);

    return {
        summary: summarise(valuesArray),
        values: valuesArray
    };
};

function parseCustomPings(output) {
    return output
        .split('\n')
        .filter(Boolean)
        .map(line => {
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

function summarise(values) {
    const hosts = _.groupBy(values, 'host');
    return _.mapValues(hosts, (arr, key) => {
        const rawValues = _.map(arr, 'timeTook');
        const fromTime = _.first(arr).time;
        const toTime = _.last(arr).time;
        return {
            dateRange: `${fromTime} - ${toTime}`,
            mean: roundPrecise(stats.mean(rawValues), 1),
            median: roundPrecise(stats.median(rawValues), 1),
            variance: roundPrecise(stats.variance(rawValues), 1),
            standardDeviation: roundPrecise(stats.stdev(rawValues), 1),
            probesCount: rawValues.length,
            percentiles: {
                50: roundPrecise(stats.percentile(rawValues, 0.5), 1),
                90: roundPrecise(stats.percentile(rawValues, 0.9), 1),
                99: roundPrecise(stats.percentile(rawValues, 0.99), 1),
            }
        }
    });
}

function roundPrecise(number, precision) {
    return Number(number.toFixed(precision));
}