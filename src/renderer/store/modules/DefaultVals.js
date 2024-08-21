const state = {
    text: 'A text from electron-vuex',
};

const mutations = {
    change_default_text(_state) {
        _state.text = 'Text Changed';
    },
    revert_default_text(_state) {
        _state.text = 'A text from electron-vuex';
    },
};

const actions = {
    changeText({ commit }) {
        // do something async
        commit('change_default_text');
    },
    revertText({ commit }) {
        // do something async
        commit('revert_default_text');
    },
};

export default {
    state,
    mutations,
    actions,
};
