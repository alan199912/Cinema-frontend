import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    user: null,
    token: null,
    cinemas: null,
    movies: null,
    schedules: null,
  },
  mutations: {
    loginUser(state) {
      state.user;
    },
    setToken(state) {
      state.token;
    },
    setMovie(state) {
      state.movies;
    },
    setCinema(state) {
      state.cinemas;
    },
    setSchedule(state) {
      state.schedules;
    },
  },
  actions: {
    loginUserAction({ commit }) {
      commit("loginUser");
    },
    setTokenAction({ commit }) {
      commit("setToken");
    },
    setMovieAction({ commit }) {
      commit("setMovie");
    },
    setCinemaAction({ commit }) {
      commit("setCinema");
    },
    setScheduleAction({ commit }) {
      commit("setSchedule");
    },
  },
  getters: {
    getLoggedUser(state) {
      return state.user;
    },
    getTokenActive(state) {
      return state.token;
    },
  },
  modules: {},
  plugins: [createPersistedState()],
});
