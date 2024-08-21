import { ipcRenderer } from 'electron';
import {
    IPC_EVENT_CONNECT,
    IPC_EVENT_NOTIFY_MAIN,
    IPC_EVENT_NOTIFY_RENDERERS,

    IPC_EVENT_SUBSCRIBE,
    IPC_EVENT_DISPATCH_RENDERER,
} from './constants';

class SharedMutations {
    constructor(options, store) {
        this.options = options;
        this.store = store;

        this.originalCommit = () => { };
        this.originalDispatch = () => { };
    }

    loadOptions() {
        if (!this.options.type) this.options.type = process.type === 'renderer' ? 'renderer' : 'main';
        if (!this.options.ipcRenderer) this.options.ipcRenderer = ipcRenderer;
    }

    activatePlugin() {
        console.log(process.type);
        if (this.options.type === 'renderer') {
            // Connect renderer to main process
            this.options.ipcRenderer.send(IPC_EVENT_CONNECT);

            // Save original Vuex methods
            this.originalCommit = this.store.commit;
            this.originalDispatch = this.store.dispatch;

            // Don't use commit in renderer outside of actions
            this.store.commit = () => {
                throw new Error('[Vuex Electron] Please, don\'t use direct commit\'s, use dispatch instead of this.');
            };

            // Forward dispatch to main process
            this.store.dispatch = (type, payload) => {
                this.options.ipcRenderer.send(IPC_EVENT_NOTIFY_MAIN, { type, payload });
            };

            // Dispatch changes from main process event:IPC_EVENT_NOTIFY_MAIN
            this.options.ipcRenderer.on(IPC_EVENT_DISPATCH_RENDERER, (event, { type, payload }) => {
                this.originalDispatch(type, payload);
            });
        }

        // will bellow reachable...? idk
        if (this.options.type === 'main') {
            // Subscribe on changes from Vuex store
            this.store.subscribe((mutation) => {
                const { type, payload } = mutation;
                // Forward changes to renderer processes
                this.options.ipcRenderer.send(IPC_EVENT_SUBSCRIBE, { type, payload });
            });
            // Subscribe on changes from main process and apply them
            this.options.ipcRenderer.on(IPC_EVENT_NOTIFY_RENDERERS, (event, { type, payload }) => {
                this.originalCommit(type, payload);
            });
        }
    }
}

export default (options = {}) => (store) => {
    const sharedMutations = new SharedMutations(options, store);

    sharedMutations.loadOptions();
    sharedMutations.activatePlugin();
};
