import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate"

const store = createStore({
    state() {
        return {
            isLoggedIn: false,
            user: null
        };
    },

    mutations: {
        login(state, user) {
            state.isLoggedIn = true;
            state.user = user;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.user = null;
        }
    },

    actions: {
        login({ commit }, user) {
            commit('login', user);
        },
        logout({ commit }) {
            commit('logout');
        }
    },

    getters: {
        isLoggedIn: state => state.isLoggedIn,
        user: state => state.user
    },

    plugins: [createPersistedState({
        storage: window.sessionStorage
    })]
})

export default store;