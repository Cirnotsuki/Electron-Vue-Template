let myWindow = null;

function shortcutOpen(BroWin, openList, wUrl, event, args) {
    const winid = new Date().getTime();

    const winparams = {
        fullscreen: true,
        transparent: true,
        frame: false,
        resizable: false,
        webPreferences: {
            webSecurity: false, // 是否禁用浏览器的跨域安全特性
            enableRemoteModule: true,
            nodeIntegration: true, // 是否完整支持node
            contextIsolation: false, // --增加改行解决我的报错
            devTools: process.env.NODE_ENV === 'development',
            // preload: `${__dirname}/preload.js`,
            webviewTag: true,
        },
    };
    // const newargs = Object.assign(winparams, args);
    myWindow = new BroWin(winparams);
    openList.set(winid, myWindow);

    const myUrl = args.wurl || `${wUrl}/index1.html#/capture?winid=${winid}`;
    myWindow.loadURL(myUrl);
    // 快捷键测试时关闭
    myWindow.webContents.closeDevTools();
}

function closeScreenshot() {
    if (myWindow) {
        myWindow.hide();
        setTimeout(() => {
            myWindow.close();
        }, 200);
    }
}

// function formatDate(date, fmt) {
//     const dateObj = typeof date === 'string' ? new Date(date) : date;
//     const o = {
//         'M+': dateObj.getMonth() + 1,
//         'd+': dateObj.getDate(),
//         'H+': dateObj.getHours(),
//         'm+': dateObj.getMinutes(),
//         's+': dateObj.getSeconds(),
//         'q+': Math.floor((dateObj.getMonth() + 3) / 3),
//         S: dateObj.getMilliseconds(),
//     };
//     if (/(y+)/.test(fmt)) {
//         fmt = fmt.replace(/(y+)/, (str, p1) => (`${dateObj.getFullYear()}`).substr(4 - p1.length));
//     }
//     for (const k in o) {
//         if (new RegExp(`(${k})`).test(fmt)) {
//             fmt = fmt.replace(new RegExp(`(${k})`), (str, p1) => (p1.length === 1
//                 ? o[k]
//                 : (`00${o[k]}`).substr((`${o[k]}`).length)));
//         }
//     }
//     return fmt;
// }

export default { shortcutOpen, closeScreenshot };
