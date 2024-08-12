<script setup lang="ts">
  const search = ref('')
  const searchResults = ref([])
  const loading = ref(false)

  // Check for a ?q= query parameter
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.has('q')) {
    search.value = urlParams.get('q')
    runSearch()
  }

  function runSearch() {
    loading.value = true
    if (search.value.length <= 1) {
      searchResults.value = [];
      loading.value = false
      return
    }

    // Set ?q= query parameter
    window.history.pushState({}, '', '/search?q=' + encodeURIComponent(search.value))

    fetch("http://127.0.0.1:8000/api/search?q=" + encodeURIComponent(search.value))
    .then((res) => res.json())
    .then((res) => {
      searchResults.value = res.posts
      loading.value = false
    })
  }
</script>

<template>
  <v-container>
    <v-row>
      <v-text-field
        v-model="search"
        hide-details
        label="Search"
        single-line
        variant="outlined"
        @keyup.enter="runSearch"
      >
        <template #append-inner>
          <v-btn @click="runSearch" prepend-icon="mdi-magnify" height="100%" density="compact">Search</v-btn>
        </template>
      </v-text-field>
    </v-row>
  </v-container>


  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Global Antenna</v-card-title>
          <v-card-text>
            <p>
              The global antenna is a feature that allows you to search for and receive posts across the entire fediverse.
            </p>
            <p>
              This is a great way to discover new stuff that you're interested in.
            </p>
          </v-card-text>
        </v-card>

        <br />

        <v-expansion-panels>
          <v-expansion-panel title="Search operators">
            <v-expansion-panel-text>
              Search for a specific word: <code class="searchOp">"word"</code><br />
              Search for multiple words: <code class="searchOp">word1 word2</code><br />
              Search for a phrase: <code class="searchOp">"this is a phrase"</code><br />
              Search with an OR parameter: <code class="searchOp">"phrase1" or "phrase2"</code><br />
              Exclude a word or phrase: <code class="searchOp">-politics</code><br />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-if="!loading && searchResults.length > 0">
    <p>Sample of posts matching your global antenna:</p>
    <br />
    <v-row>
      <v-col v-for="post in searchResults" :key="post.id" cols="12">
        <v-card>
          <v-card-title>@{{ post.username }}</v-card-title>
          <v-card-text>
            <p style="white-space: pre-line; font-size: 2ex">
              {{ post.content }}
            </p>
          </v-card-text>
          <v-card-item v-if="post.attachments.length > 0">
            <v-container fluid>
              <v-row>
                <v-col
                  :key="attachment.id"
                  v-for="attachment in post.attachments"
                >
                  <v-img :src="attachment.url" :width="300" :alt="attachment.description" />
                </v-col>
              </v-row>
            </v-container>
          </v-card-item>
          <v-card-actions>
            <a :href="post.post_url" target="_blank">
              <v-btn color="primary" prepend-icon="mdi-open-in-new">Open original</v-btn>
            </a>
            <small class="align-content-end">Post ID: {{ post.id }}</small>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-if="loading">
    <v-skeleton-loader type="card" />
    <br />
    <v-skeleton-loader type="card" />
    <br />
    <v-skeleton-loader type="card" />
    <br />
    <v-skeleton-loader type="card" />
    <br />
    <v-skeleton-loader type="card" />
  </v-container>
</template>

<style scoped>
.searchOp {
  color: yellow;
}
</style>
