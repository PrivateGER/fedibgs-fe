<script setup lang="ts">


import type {Post} from "@/typing";

let socket = new WebSocket(window.BASE_URL + "/stream");
const posts = ref<Post[]>([]);
posts.value = [];
let maxLookback = 1000;

socket.onopen = function() {
  console.log("Connected to the stream.");
};

socket.onmessage = function(event) {
  let newPosts = JSON.parse(event.data);
  console.log(newPosts);
  posts.value = [...newPosts.posts, ...posts.value];
  if (posts.value.length > maxLookback) {
    posts.value = posts.value.slice(0, maxLookback);
  }
};

socket.onclose = function() {
  console.log("Disconnected from the stream.");
};

</script>

<template>
  <!-- This is a live feed of new posts streaming into the system. Emphasize this. -->

  <v-container>
    <v-row>
      <transition-group name="fade" tag="div">
        <v-col cols="12">
          <v-card class="py-4" color="surface-variant" rounded="lg" variant="text">
            <v-card-title>
              <span class="ml-2">Live Post Feed</span>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-alert color="info" icon="mdi-information-outline">
                    This is a live feed of new posts streaming into the system. Posts are imported in batches of 32.
                  </v-alert>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </transition-group>
    </v-row>
  </v-container>

  <!-- Display the live feed of posts here. -->
  <v-container>
    <v-row>
      <v-col v-if="posts.length === 0">
        <v-card>
          <v-card-title>No posts yet.</v-card-title>
          <v-card-text>
            <p>Posts will appear here as they are imported.</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-for="post in posts" >
        <Post :key="post.id" :post="post" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="css">
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
