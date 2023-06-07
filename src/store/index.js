import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: "",
    balance: "",
    poolList: "",
    web3: ""
  },
  mutations: {
    setAccount(state, payload) {
      state.account = payload
    },
    setBalance(state, payload) {
      state.balance = payload
    },
    setWeb3(state, payload) {
      state.web3 = payload
    },
    setPoolList(state, payload) {
      state.poolList = payload
    },
  },
  actions: {
    setAccount({ commit }, payload) {
      commit("setAccount", payload)
    },
    setBalance({ commit }, payload) {
      commit("setBalance", payload)
    },
    setWeb3({ commit }, payload) {
      commit("setWeb3", payload)
    },
    setPoolList({ commit }, payload) {
      commit("setPoolList", payload)
    }
  },
  getters: {
    account: state => state.account,
    balance: state => state.balance,
    web3: state => state.web3,
    poolList: state => state.poolList
  }
})
