<script setup lang="ts">
// Accept a Post object as a prop.


import type {Post} from "@/typing";

const props = defineProps<{
  post: Post
}>()
</script>

<template>
  <v-card>
    <v-card-title><RouterLink style="text-decoration: none; color: inherit;" :to="'/user/' + props.post.author_id">@{{ props.post.username }}</RouterLink></v-card-title>
    <v-card-text>
      <p style="white-space: pre-line; font-size: 2ex">
        {{ props.post.content }}
      </p>
    </v-card-text>
    <v-card-item v-if="props.post.attachments.length > 0">
      <v-container fluid>
        <v-row>
          <v-col
            :key="attachment.id"
            v-for="attachment in props.post.attachments"
          >
            <v-img :src="attachment.url" :width="300" :alt="attachment.description" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-item>
    <v-card-actions>
      <a :href="props.post.post_url" target="_blank">
        <v-btn color="primary" prepend-icon="mdi-open-in-new">Open original</v-btn>
      </a>
      {{ props.post.indexed_at.toLocaleString() }}
      <small class="align-content-end">Post ID: {{ props.post.id }}</small>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="sass">

</style>
