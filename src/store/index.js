import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authenticatedUser: null,
  },
  getters: {
    authenticatedUser: (state) => state.authenticatedUser,
  },
  actions: {
    setAuthenticatedUser({ commit }, user) {
      console.log(this.state.authenticatedUser);
      commit('setAuthenticatedUser', user);
    },
  },
  mutations: {
    setAuthenticatedUser: (state, user) => {
      state.authenticatedUser = user;
    },
  },
  modules: {},
});
