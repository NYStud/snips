import Vue from 'vue';
import Vuex from 'vuex';
import App from './components/App/App.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    snippets: []
  },

  getters: {
    getSnippet: (state) => (id) => {
      return state.snippets.find(snippet => snippet.id === id);
    }
  },

  mutations: {
    addSnippet (state, payload) {
      state.snippets.push(payload);
    },

    deleteSnippet(state, payload) {
      const idx = state.snippets.findIndex(snip => {
        return snip.id === payload.id;
      });
      
      state.snippets.splice(idx, 1);
    },

    updateSnippet (state, payload) {
      const idx = state.snippets.findIndex(snip => {
        return snip.id === payload.id;
      });

      Vue.set(state.snippets, idx, payload);
    }
  }
});

new Vue({
  el: '#app',
  store,
  render: h => h(App)
});