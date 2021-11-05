const state = {
  authenticatedUser: null,
  idToken: '',
};
const getters = {
  authenticatedUser: (state) => state.authenticatedUser,
  idToken: (state) => state.idToken,
};
const actions = {
  setAuthenticatedUser({ commit }, user) {
    commit('setAuthenticatedUser', user);
  },
  setIdToken({ commit }, token) {
    commit('setIdToken', token);
  },
};
const mutations = {
  setAuthenticatedUser: (state, user) => {
    state.authenticatedUser = user;
  },
  setIdToken: (state, token) => {
    state.idToken = token;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
