import getDesktopCapturer from './handler/shortcut-capture';
import openwin from './handler/shortcut-openwin';

const { closeScreenshot, shortcutOpen } = openwin;

export default class IpcScreenshot {
    constructor(app, ipc, broWin, dialog, menu, wurl) {
        this.App = app;
        this.ipcMain = ipc;
        this.BrowserWindow = broWin;
        this.Dialog = dialog;
        this.Menu = menu;
        this.winURL = wurl;

        this.openWinList = new Map();
        this.imgbase64 = null;
        this.mywinid = null;
        this.finished = false;
        this.coordinate = null;
    }

    init() {
        const _this = this;

        function getWindowFromID(winid) {
            return _this.BrowserWindow.getAllWindows().filter(win => +win.id === +winid)[0];
        }

        // 打开并获取全屏截图
        this.ipcMain.on('screen-Capture', async (event, args) => {
            const imgbase64 = await getDesktopCapturer();

            _this.imgbase64 = imgbase64;
            _this.wintype = args.wintype;
            _this.mywinid = args.mywinid;
            _this.coordinate = args.coordinate;
            args.imgbase64 = imgbase64;
            args.length = imgbase64.length;
            shortcutOpen(_this.BrowserWindow, _this.openWinList, _this.winURL, event, args);
        });

        this.ipcMain.on('get-imageData', (event, args) => {
            args.wintype = _this.wintype;
            args.mywinid = _this.mywinid;
            args.imgbase64 = _this.imgbase64;
            event.reply('imageData', args);
        });

        // 关闭截图
        this.ipcMain.on('close-screen-Capture', (event, args) => {
            closeScreenshot(event, args);
        });

        // 截图完成
        this.ipcMain.on('ok-screen-Capture', (event, args) => {
            const selectwinid = _this.mywinid.substring(_this.mywinid.indexOf('_') + 1, _this.mywinid.length);
            args.wintype = _this.wintype;
            args.winid = selectwinid;
            args.finished = true;
            args.coordinate = _this.coordinate;

            const prjWindow = getWindowFromID(selectwinid);
            if (prjWindow) {
                prjWindow.webContents.send('screenshot-Completed', args);
            }
        });
    }
}
