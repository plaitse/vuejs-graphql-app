<template>
  <v-container text-xs-center>
    <!-- @@@ --- First method --- @@@ + Without Vuex -->
    <!-- <v-container text-xs-center v-if="getPosts"> -->
    <!-- <v-flex xs12>
      <v-carousel v-bind="{'cycle': true}" interval="3000">
        <v-carousel-item v-for="post in getPosts" :key="post._id" :src="post.imageUrl">
          <h1 id="carousel__title">{{post.title}}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>-->

    <!-- UX loader -->
    <v-layout row>
      <v-dialog v-model="loading" persistent fullscreen>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="secondary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <!-- @@@ --- First method --- @@@ + With Vuex -->
    <v-flex xs12>
      <v-carousel v-if="!loading && posts.length > 0" v-bind="{'cycle': true}" interval="3000">
        <v-carousel-item
          v-for="post in posts"
          :key="post._id"
          :src="post.imageUrl"
          @click.native="goToPost(post._id)"
        >
          <h1 id="carousel__title">{{post.title}}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>

    <!-- @@@ --- First method --- @@@ -->
    <!-- <div v-if="$apollo.loading">Loading...</div>
    <ul v-else v-for="post in getPosts" :key="post._id">
      <li>
        {{post.title}}
        {{post.imageUrl}}
        {{post.description}}
      </li>
    </ul>-->

    <!-- @@@ --- Second method --- @@@ -->
    <!-- <ApolloQuery :query="getPostQuery">
      <template slot-scope="{ result: { loading, error, data, networkStatus } }">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Error: {{error.message}}</div>
        <div v-else-if="!loading">Network status: {{networkStatus}}</div>
        <ul v-else v-for="post in data.getPosts" :key="post._id">
          <li>
            {{post.title}}
            {{post.imageUrl}}
            {{post.description}}
          </li>
        </ul>
      </template>
    </ApolloQuery>-->
  </v-container>
</template>

<script>
import { gql } from "apollo-boost";
import { mapGetters } from "vuex";

export default {
  name: "home",

  data() {
    return {
      // posts: []
      // @@@ --- Second method --- @@@
      // getPostQuery: gql`
      //   query {
      //     getPosts {
      //       _id
      //       title
      //       imageUrl
      //       description
      //     }
      //   }
      // `
    };
  },

  // @@@ --- First method --- @@@ + Without Vuex
  // apollo: {
  //   getPosts: {
  //     query: gql`
  //       query {
  //         getPosts {
  //           _id
  //           title
  //           imageUrl
  //           description
  //         }
  //       }
  //     `,
  //     // result({ data, loading, networkStatus }) {
  //     //   if (!loading) {
  //     //     this.posts = data.getPosts;
  //     //     console.log({ networkStatus });
  //     //   }
  //     // }
  //     result(args) {
  //       console.log({ args });
  //     },
  //     error(err) {
  //       console.log({ err });
  //     }
  //   }
  // }

  // @@@ --- First method --- @@@ + With Vuex
  methods: {
    handleGetCarouselPosts() {
      // Reach out to Vuex store, fire action that gets posts for carousel
      this.$store.dispatch("getPosts");
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    }
  },

  computed: {
    /* @@@ --- Withtout mapGetters --- @@@ */
    // posts() {
    //   return this.$store.getters.posts;
    // },
    // loading() {
    //   return this.$store.getters.loading;
    // }
    ...mapGetters(["loading", "posts"])
  },

  created() {
    this.handleGetCarouselPosts();
  }
};
</script>

<style>
#carousel__title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 5px 5px 0 0;
  padding: 0.5em;
  margin: 0 auto;
  bottom: 50px;
  left: 0;
  right: 0;
}
</style>
