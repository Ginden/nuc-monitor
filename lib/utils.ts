'use strict';

import {Promise} from 'bluebird';

const cp = require('child_process');

type RejectCallback = (error?: any) => void;
type ResolveCallback = (thenableOrResult?: any) => void

export function exec(command: string, options = {}) : PromiseLike<{stdout: string, stderr: string}> {
    return new Promise((resolve: ResolveCallback, reject: RejectCallback) => {
        cp.exec(command, options, commandOutput(resolve, reject));
    });
}

export function execFile(command: string, args: string[], options: object) : PromiseLike<{stdout: string, stderr: string}> {
    return new Promise((resolve: ResolveCallback, reject: RejectCallback) => {
        cp.execFile(command, args, options, commandOutput(resolve, reject));
    });
}

export const dictionary = () => Object.create(null);

function commandOutput(resolve: ResolveCallback, reject: RejectCallback) {
    return (err: Error, stdout: string, stderr: string) : void => {
        if (err) {
            return reject(err);
        }
        resolve({
            stdout,
            stderr
        });
    }
}
