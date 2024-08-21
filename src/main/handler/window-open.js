export default function winOpen(BroWin, openList, wUrl, event, args) {
    const winid = args.mywinid || new Date().getTime();

    // 同一个窗口不能重复打开，调用时务必添加mywinid参数
    try {
        if (openList.has(winid)) {
            const curwin = openList.get(winid);
            if (curwin && !curwin.isDestroyed()) {
                return curwin.focus();
            }
            openList.delete(winid);
        }
    } catch (e) {
        openList.delete(winid);
    }

    const winparams = {
        minWidth: 400,
        minHeight: 400,
        backgroundColor: '#f3f5f7',
        center: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            devTools: process.env.NODE_ENV === 'development',
            webviewTag: true,
        },
        frame: false,
    };
    Object.assign(winparams, args);

    if (args.WindowControllerVisible === true) {
        winparams.frame = true;
    }

    let myWindow = new BroWin(winparams);
    openList.set(winid, myWindow);

    const myUrl = args.wurl || `${wUrl}index${args.pidx || 1}.html#${args.name}?winid=${myWindow.id}&${args.query}`;

    myWindow.loadURL(myUrl);

    myWindow.on('closed', () => {
        openList.delete(winid);

        event.reply('reply-close-window', { ...args.params, query: args.query } || {});

        myWindow = null;
    });

    myWindow.on('maximize', () => {
        event.reply('reply-win-maximize');
    });

    myWindow.on('unmaximize', () => {
        event.reply('reply-win-unmaximize');
    });

    args.max && myWindow.maximize();
    myWindow.removeMenu();
    myWindow.webContents.closeDevTools();
}
