'use strict';

import {
    exec
} from '../utils';
import _ = require('lodash');
import stats = require('stats-lite');


type ParsedPingLine = {
    time: string;
    host: string;
    timeTook: number;
};

module.exports = async function () {
    const todaysDateFileName = (await exec('date -u +%Y.%m.%d')).stdout.trim();
    const prefix = process.env.PINGS_PATH || `${process.env.HOME}/logs/pings`;
    const filePath = `${prefix}/${todaysDateFileName}.log`;
    const {
        stderr: error,
        stdout: todaysPings
    } = (await exec(`< "${filePath}" tail -n 1000`));

    const valuesArray = parseCustomPings(todaysPings);

    return {
        summary: summarise(valuesArray),
        values: valuesArray,
        error: (error ? error.trim() : '' ) || null,
        filePath
    };
};

function parseCustomPings(output: string) : Array<ParsedPingLine> {
    return output
        .split('\n')
        .filter(Boolean)
        .map((line : string) => {
            const time = line.slice(0, 5);
            const [hour, minute] = time.split(':').map(Number);
            const normalizedMinute = minute - minute % 5; // If execution took more than minute, round it
            const pingOutput = line.slice('00:25:13 64 bytes from '.length);
            const [host] = pingOutput.split(':', 1);
            try {
                const [, timeTook] = pingOutput.match(/time=(\d*(\.\d)?)/) || '';
                return {
                    time: `${hour}:${normalizedMinute}`,
                    host,
                    timeTook: Number(timeTook)
                };
            } catch(err) {
                console.error({line, pingOutput});
                throw err;
            }

        });
}

function summarise(values: Array<ParsedPingLine>) {
    const hosts = _.groupBy(values, 'host');
    return _.mapValues(hosts, (arr, ip) => {
        const rawValues = _.map(arr, 'timeTook');
        const fromTime = _.first(arr)!.time;
        const toTime = _.last(arr)!.time;
        return {
            ip,
            dateRange: `${fromTime} - ${toTime}`,
            mean: round1(stats.mean(rawValues)),
            median: round1(stats.median(rawValues)),
            variance: round1(stats.variance(rawValues)),
            standardDeviation: round1(stats.stdev(rawValues)),
            probesCount: rawValues.length,
            percentiles: {
                50: round1(stats.percentile(rawValues, 0.5)),
                90: round1(stats.percentile(rawValues, 0.9)),
                99: round1(stats.percentile(rawValues, 0.99)),
            }
        }
    });
}

function round1(number: number) : number {
    return roundPrecise(number, 1);
}

function roundPrecise(number: number, precision: number) : number {
    return Number(number.toFixed(precision));
}
