import Vue from "vue";
import Vuex from "vuex";
import router from "../routing/router";

import { defaultClient as apolloClient } from "../main";
import {
  GET_CURRENT_USER,
  GET_POSTS,
  INFINITE_SCROLL_POSTS,
  GET_USER_POSTS,
  SEARCH_POSTS,
  ADD_POST,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  SIGNIN_USER,
  SIGNUP_USER
} from "../gql/queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    searchResults: [],
    user: null,
    userPosts: [],
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) state.searchResults = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    clearUser: state => (state.user = null),
    clearError: state => (state.error = null),
    clearSearchResults: state => (state.searchResults = [])
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          // console.log(data.getCurrentUser);
          commit("setLoading", false);
          // Add user data to state
          commit("setUser", data.getCurrentUser);
        })
        .catch(err => {
          console.log({ err });
          commit("setLoading", false);
        });
    },
    getPosts: ({ commit }) => {
      commit("setLoading", true);
      // Use Apollo Client to fire getPosts query
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
          // Get data from actions to state via mutations
          // Commit passes data from actions along to mutation functions
          commit("setPosts", data.getPosts);
          commit("setLoading", false);
        })
        .catch(err => {
          console.log({ err });
          commit("setLoading", false);
        });
    },
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("setUserPosts", data.getUserPosts);
          console.log("getUserPosts :", data.getUserPosts);
        })
        .catch(err => console.log(err));
    },
    searchPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("setSearchResults", data.searchPosts);
          console.log({ data });
        })
        .catch(err => console.log(err));
    },
    addPost: ({ commit }, payload) => {
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            // console.log(cache, data);
            // First read the query we want to update
            const data = cache.readQuery({ query: GET_POSTS });
            // Create updated data
            data.getPosts.unshift(addPost);
            // Write updated data back to query
            console.log({ data });
            cache.writeQuery({
              query: GET_POSTS,
              data
            });
          },
          // Optimistic response ensures data is added immediately as we specified for the update function
          optimisticResponse: {
            __typename: "Mutation",
            addPost: {
              __typename: "Post",
              _id: -1,
              ...payload
            }
          },
          // Rerun specified queries after performing the mutation in order to get fresh data
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 2
              }
            }
          ]
        })
        .then(({ data }) => {
          console.log(data.addPost);
          commit("setLoading", false);
        })
        .catch(err => {
          console.log({ err });
          commit("setLoading", false);
          commit("setError", err);
        });
    },
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.updateUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index), // Retrieve post to be updated
            data.updateUserPost, // Paste new info in it
            ...state.userPosts.slice(index + 1) // Pate rest of the array of posts
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(err => console.log({ err }));
    },
    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.deleteUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(err => {
          console.log({ err });
        });
    },
    signinUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signinUser.token);
          // To make sure created method is run in main.js (we run getCurrentUser), reload
          router.go();
        })
        .catch(err => {
          console.log({ err });
          commit("setLoading", false);
          commit("setError", err);
        });
    },
    signupUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signupUser.token);
          // To make sure created method is run in main.js (we run getCurrentUser), reload
          router.go();
        })
        .catch(err => {
          console.log({ err });
          commit("setLoading", false);
          commit("setError", err);
        });
    },
    signoutUser: async ({ commit }) => {
      // Clear user in state
      commit("clearUser");
      // Remove token in localStorage
      localStorage.setItem("token", "");
      // End session - Clear apollo cache
      // console.dir(apolloClient);
      await apolloClient.resetStore();
      // Redirect home - Kick users out of private pages (i.e. profile)
      router.push("/");
    }
  },
  getters: {
    posts: state => state.posts,
    searchResults: state => state.searchResults,
    user: state => state.user,
    userPosts: state => state.userPosts,
    userFavorites: state => state.user && state.user.favorites,
    loading: state => state.loading,
    error: state => state.error,
    authError: state => state.authError
  }
});
