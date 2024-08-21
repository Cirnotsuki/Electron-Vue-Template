import {
    IPC_EVENT_CONNECT,
    IPC_EVENT_NOTIFY_MAIN,
    IPC_EVENT_DISPATCH_RENDERER,
} from '../../../renderer/modules/vuex-electron/lib/constants';

export default {
    register() {
        // Vuex-electron registry events on main process
        const connections = {};

        // Save new connection
        this.ipcMain.on(IPC_EVENT_CONNECT, (event) => {
            const win = event.sender;
            const winId = win.id;

            connections[winId] = win;

            // Remove connection when window is closed
            win.on('destroyed', () => {
                delete connections[winId];
            });
        });

        this.ipcMain.on(IPC_EVENT_NOTIFY_MAIN, (event, payload) => {
            // notify all connection to dispatch changes
            Object.keys(connections).forEach((processId) => {
                connections[processId].send(IPC_EVENT_DISPATCH_RENDERER, payload);
            });
        });

        /**
         * main process can not access vuex's store on Electron 22. abandon bellow
         * this.ipcMain.on(IPC_EVENT_SUBSCRIBE, (event, payload) => {
                Object.keys(connections).forEach((processId) => {
                    connections[processId].send(IPC_EVENT_NOTIFY_RENDERERS, payload);
                });
            });
         */
    },
};
