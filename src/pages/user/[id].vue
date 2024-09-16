<script setup lang="ts">
import type {Post, User} from "@/typing"

type InfiniteScrollStatus = 'ok' | 'empty' | 'loading' | 'error';
type InfiniteScrollSide = 'start' | 'end' | 'both';

import { useRoute } from "vue-router";

const offset = ref(0)
const loading = ref(false)
const user = ref<User | null>(null)
const postFeed = ref<Post[]>([])
const route = useRoute()

const userHost = computed(() => {
  if (user.value) {
    const url = new URL(user.value.url)
    return url.host
  }
  return ''
})


async function fetchUser() {
  loading.value = true

  if (route.name !== "/user/[id]" || !route.params.id) {

    console.error("No user ID provided.")
    return
  }

  await fetch(window.BASE_URL + `/api/author/${route.params.id}?offset=` + offset.value)
    .then(res => res.json())
    .then(data => {
      user.value = data
      // Map posts indexed_at to Date objects
      data.posts.forEach((post: Post) => {
        post.indexed_at = new Date(post.indexed_at)
      })
      postFeed.value = [...postFeed.value, ...data.posts]
      loading.value = false
    })
}

async function fetchMorePosts(options: {
  side: InfiniteScrollSide;
  done: (status: InfiniteScrollStatus) => void;
}) {
  let postCount = postFeed.value.length
  offset.value += 50
  console.log("Loading more posts...")
  await fetchUser()
  if (postCount === postFeed.value.length) {
    console.log("No more posts to load.")
    options.done('empty')
    return
  }
  options.done('ok')
}

</script>

<template>
  <!-- Build a user overview in a modern style with Vuetify. -->
  <!-- Note: use infinite scroll to load more posts. -->

  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>User Profile: @{{ user?.username }}</v-card-title>
          <v-card-text>
            <p>{{ user?.total_posts }} posts indexed in FediBGS</p>
            <p>Instance: {{userHost}}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-divider style="margin: 10px" />

    <v-row v-if="!loading">
      <v-col cols="12">
        <v-card>
          <v-card-title>Posts</v-card-title>
          <v-card-text>
            <p>Displaying {{ postFeed.length }} of {{ user?.total_posts }} posts</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>


    <v-infinite-scroll :items="postFeed" @load="fetchMorePosts" :disabled="loading" load-more-text="Loading more...">
      <template v-for="post in postFeed" :key="post.id">
        <Post :post="post" style="margin-bottom: 10px" />
      </template>
    </v-infinite-scroll>
  </v-container>

  <v-container v-if="loading">
    <v-row>
      <v-col cols="12">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="sass">

</style>
