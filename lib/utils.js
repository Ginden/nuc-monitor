'use strict';

const cp = require('child_process');

module.exports.exec = (command, options = {}) => {
    return new Promise((resolve, reject) => {
        cp.exec(command, options, commandOutput(resolve, reject));
    });
};

module.exports.execFile = (command, args, options) => {
    return new Promise((resolve, reject) => {
        cp.execFile(command, args, options, commandOutput(resolve, reject));
    });
};

module.exports.dictionary = () => Object.create(null);

function commandOutput(resolve, reject) {
    return (err, stdout, stderr) => {
        if (err) {
            return reject(err);
        }
        resolve({stdout, stderr});
    }
}