import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./routing/router";
import store from "./store/store";

import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

Vue.use(VueApollo);

// Setup Apollo client
export const defaultClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  // Include auth token w/ requests made to backend
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    // If no token in localStorage, add it
    if (!localStorage.token) {
      localStorage.setItem("token", "");
    }
    // Operation adds the token to an authorization header which is sent to backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token")
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) console.log({ networkError });
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir({ err });
      }
    }
  }
});

const apolloProvider = new VueApollo({
  defaultClient
});

Vue.config.productionTip = false;

new Vue({
  // provide: apolloProvider.provide(), ---> Deprecated
  apolloProvider,
  router,
  store,
  render: h => h(App),
  created() {
    // Execute getCurrentUser query
    this.$store.dispatch("getCurrentUser");
  }
}).$mount("#app");
