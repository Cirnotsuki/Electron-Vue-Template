const proc = require('child_process');
const pjson = require('../package.json');
const path = require('path');
const os = require('os');

let arch = '';
if (process.env.EXTRACT_TYPE === 'dev') {
    arch = os.arch();
} else {
    arch = pjson.build.win.target[0].arch[0];
}

let electron = path.join(__dirname, '../node_modules/electron/dist/electron.exe');


if (process.env.EXTRACT_TYPE === 'dev') {
    electron = path.join(__dirname, '../node_modules/electron/dist/electron.exe');
}

const child = proc.spawn(electron, process.argv.slice(2), { stdio: 'inherit', windowsHide: false });
child.on('close', function (code) {
    process.exit(code);
});

const handleTerminationSignal = function (signal) {
    process.on(signal, function signalHandler() {
        if (!child.killed) {
            child.kill(signal);
        }
    });
};

handleTerminationSignal('SIGINT');
handleTerminationSignal('SIGTERM');
