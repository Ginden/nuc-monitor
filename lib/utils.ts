'use strict';

import Bluebird = require('bluebird');

import cp = require('child_process');

type RejectCallback = (error?: any) => void;
type ResolveCallback = (thenableOrResult?: any) => void;
type ExecResult = Bluebird<{stdout: string, stderr: string}>;

export function exec(command: string, options = {}): ExecResult {
    return new Bluebird((resolve: ResolveCallback, reject: RejectCallback) => {
        cp.exec(command, options, commandOutput(resolve, reject));
    });
}

export function execFile(command: string, args: string[], options: object): ExecResult {
    return new Bluebird((resolve: ResolveCallback, reject: RejectCallback) => {
        cp.execFile(command, args, options, commandOutput(resolve, reject));
    });
}

export const dictionary = () => Object.create(null);

function commandOutput(resolve: ResolveCallback, reject: RejectCallback) {
    return (err: Error, stdout: string, stderr: string): void => {
        if (err) {
            return reject(err);
        }
        resolve({
            stdout,
            stderr
        });
    };
}
