const path = require('path');
const Conf = require('conf');
const electron = require('electron');

export default function ElectronStore(opts) {
    const defaultCwd = process.env.ElectronAppUserPath;

    opts = { name: 'config', ...opts };

    if (opts.cwd) {
        opts.cwd = path.isAbsolute(opts.cwd) ? opts.cwd : path.join(defaultCwd, opts.cwd);
    } else {
        opts.cwd = defaultCwd;
    }

    opts.configName = opts.name;
    delete opts.name;

    const conf = new Conf(opts);

    console.log(conf);
    // conf.openInEditor = function () {
    //     electron.shell.openItem(this.path);
    // };

    // conf.options = opts;
    Object.defineProperties(conf, {
        openInEditor: function () {
            electron.shell.openItem(this.path);
        },
        options: opts,
    })

    console.log(conf);


    return conf;
};
