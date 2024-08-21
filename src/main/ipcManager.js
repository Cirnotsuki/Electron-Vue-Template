import winOperation from './handler/window-operation';
import winOpen from './handler/window-open';

export default class IpcManager {
    constructor(app, ipc, broWin, dialog, menu, wurl, shell) {
        this.App = app;
        this.ipcMain = ipc;
        this.BrowserWindow = broWin;
        this.Dialog = dialog;
        this.Menu = menu;
        this.winURL = wurl;
        this.shell = shell;

        this.openWinList = new Map();
    }

    init() {
        const _this = this;

        // 窗口操作
        // operating window maximun minimun close etc...
        this.ipcMain.handle('my-window-operation', (event, args) => winOperation(_this.BrowserWindow, event, args));

        // 获取用户本地数据保存目录
        // get electron user path in tempfolder
        this.ipcMain.handle('my-get-user-path', (event, args) => _this.App.getPath(args));

        // 打开窗口
        this.ipcMain.on('my-open-window', (event, args) => winOpen(_this.BrowserWindow, _this.openWinList, _this.winURL, event, args));

        // 选择文件（文件夹），args.eventType 是发送消息自带的参数，用于区分事件类别，回发时带回
        // open file selector dialog, choose file or dir, reply type
        this.ipcMain.on('my-open-dialog', (event, args) => {
            _this.Dialog.showOpenDialog(args).then((res) => {
                event.reply('reply-my-dialog', Object.assign(res.filePaths, args.params || {}));
            }).catch(() => { });
        });

        // open web url on web browser
        this.ipcMain.on('open-url', (event, link) => {
            console.log(link);
            this.shell.openExternal(link);
        });

        // 退出程序
        this.ipcMain.on('my-app-quit', () => _this.App.quit());
    }

    // registry eventEmitor on main process
    registry(module) {
        module.register.call(this);
    }
}
