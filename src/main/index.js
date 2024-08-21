import {
    app, BrowserWindow, ipcMain, dialog, Menu, shell,
} from 'electron';
import os from 'os';
// 目前electron-screenshots不调用，可卸载
// import Screenshots from 'electron-screenshots';
// import path from 'path';
import IpcManager from './ipcManager';
import IpcScreenshot from './ipcScreenshot'; //  clipboard, screen, desktopCapturer,

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

process.env.ElectronAppUserPath = app.getPath('userData');

// 定义全局变量，所有窗口共享，通过ipcMain和ipcRenderer实现设置更改
global.ZLTB_DATA = {
    KEYNO: '', // 加密狗编号
};

// win7 禁用硬件加速（程序黑屏）
if (os.release().startsWith('6.1')) {
    app.disableHardwareAcceleration();
}

let mainWindow = null;
const winURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9080/' : `file://${__dirname}/`;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 650,
        minWidth: 400,
        minHeight: 400,
        center: true,
        backgroundColor: '#f3f5f7',
        title: 'Electron-Vue Template',
        icon: './renderer/assets/logo.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: process.env.NODE_ENV === 'development',
            webviewTag: true,
        },
        // frame: false,
    });

    mainWindow.loadURL(`${winURL}index.html`);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // 系统首页是登录页，不显示菜单栏和开发调试工具
    // mainWindow.removeMenu();
    mainWindow.webContents.closeDevTools();
}

// 限制单实例应用
const curInstance = app.requestSingleInstanceLock();
if (!curInstance) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });

    app.whenReady().then(() => {
        createWindow();
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// 监听窗口崩溃
app.on('render-process-gone', (event, webcon, detial) => {
    webcon.reload();
});

const ipcInstance = new IpcManager(app, ipcMain, BrowserWindow, dialog, Menu, winURL, shell);
ipcInstance.init();
// 注册 Vuex 事件
ipcInstance.registry(require('./registry/vuex').default);

process.on('uncaughtException', (err) => {
});

const ipcShortcutCapture = new IpcScreenshot(app, ipcMain, BrowserWindow, dialog, Menu, winURL);
ipcShortcutCapture.init();
