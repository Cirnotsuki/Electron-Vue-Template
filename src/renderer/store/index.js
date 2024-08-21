import VuexElectron from '../modules/vuex-electron';

import Vuex from '../modules/vuex/index';
import Vue from '../modules/vue/index';

import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
    modules,
    plugins: [
        VuexElectron.createPersistedState(),
        VuexElectron.createSharedMutations(),
    ],
    strict: process.env.NODE_ENV !== 'production',
});
