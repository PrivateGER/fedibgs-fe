<script setup lang="ts">

const search = ref('')
const searchResults = ref([])

let debounceTimeout: number | undefined;

const prettyfiedResults = computed(() => {
  let prettyResults = []
  if (searchResults.value.length === 0) return []
  searchResults.value.forEach((result: any) => {
    prettyResults.push({
      id: result.id,
      username: result.username,
      url: result.url,
      total_posts: result.total_posts,
      instance: new URL(result.url).host,
      webfinger: `@${result.username}@${new URL(result.url).host}`
    })
  })
  return prettyResults
})

async function search_user() {
  console.log('Searching for', search.value)
  await fetch(window.BASE_URL + `/api/author/search?q=${search.value}`)
    .then(res => res.json())
    .then(data => {
      searchResults.value = data
    })
}

function debounceSearch() {
  clearTimeout(debounceTimeout);
  debounceTimeout = window.setTimeout(() => {
    search_user();
  }, 300); // Adjust the delay as needed
}

</script>

<template>
  <v-container>
    <v-row>
      <v-text-field
        v-model="search"
        hide-details
        @input="debounceSearch"
        label="Enter a username or domain..."
        single-line
        variant="outlined"
        @keyup.enter="search_user"
      >
        <template #append-inner>
          <v-btn @click="search_user" prepend-icon="mdi-magnify" height="100%" density="compact">Search</v-btn>
        </template>
      </v-text-field>
    </v-row>
  </v-container>

  <v-container>
    <v-row>
      <v-col cols="12" v-for="result in prettyfiedResults" :key="result.id">
        <v-card>
          <v-card-title>{{ result.webfinger }}</v-card-title>
          <v-card-actions>
            <RouterLink :to="'/user/' + result.id">
              <v-btn color="primary" prepend-icon="mdi-account">View profile</v-btn>
            </RouterLink>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="sass">

</style>
