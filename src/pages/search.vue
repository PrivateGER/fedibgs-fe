<script setup lang="ts">
  import Post from "@/components/Post.vue";

  interface Post {
    id: string
    username: string
    content: string
    post_url: string
    indexed_at: Date
    attachments: Attachment[]
  }

  interface Attachment {
    id: string
    url: string
    description: string
  }

  type SearchResults = Post[]
  type InfiniteScrollStatus = 'ok' | 'empty' | 'loading' | 'error';
  type InfiniteScrollSide = 'start' | 'end' | 'both';

  const search = ref('')
  const searchResults: Ref<SearchResults> = ref([])
  const offset = ref(0)
  const loading = ref(false)
  const total_results = ref(0)
  const searchTime = ref(0)

  // Check for a ?q= query parameter
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.has('q')) {
    search.value = urlParams.get('q') || ''
    runSearch()
  }

  async function search_more(options: {
    side: InfiniteScrollSide;
    done: (status: InfiniteScrollStatus) => void;
  }) {
    offset.value += 50
    let postCount = searchResults.value.length
    console.log("Loading more...")
    await runSearch()
    if (postCount === searchResults.value.length) {
      console.log("No more posts to load.")
      options.done('empty')
      return
    }
    options.done('ok')
  }

  function new_search() {
    offset.value = 0
    searchResults.value = []
    runSearch()
  }

  async function runSearch() {
    if (searchResults.value.length === 0) loading.value = true

    if (search.value.length <= 1) {
      searchResults.value = [];
      loading.value = false
      return
    }

    // Set ?q= query parameter
    window.history.pushState({}, '', '/search?q=' + encodeURIComponent(search.value))

    let startTime = new Date().getTime()
    await fetch(window.BASE_URL + "/api/search?q=" + encodeURIComponent(search.value) + "&offset=" + offset.value)
    .then((res) => res.json())
    .then((res) => {
      searchResults.value = [...searchResults.value, ...res.posts]
      // Convert indexed_at to Date
      searchResults.value.forEach((post) => {
        post.indexed_at = new Date(post.indexed_at)
      })
      total_results.value = res.total_result_count
      searchTime.value = new Date().getTime() - startTime
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
        @keyup.enter="new_search"
      >
        <template #append-inner>
          <v-btn @click="new_search" prepend-icon="mdi-magnify" height="100%" density="compact">Search</v-btn>
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
    <p>Search results<span v-if="searchTime"> (showing {{offset+50}} of {{total_results}} found in {{searchTime}}ms)</span>:</p>
    <br />
    <v-row>
      <v-infinite-scroll :items="searchResults" @load="search_more" load-more-text="Loading more...">
        <template v-for="post in searchResults" :key="post.id">
          <v-col>
            <Post :post="post" />
          </v-col>
        </template>
      </v-infinite-scroll>
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
