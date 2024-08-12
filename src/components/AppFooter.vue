<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="align-center text-center">
        <!-- Text centered in the middle of the bottom of the page -->
        <p>Indexing <span style="color: green">active.</span> Current 7-day backlook size: <i>{{ postCount }} posts, {{ attachmentCount }} attachments</i></p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
let postCount = ref(0)
let attachmentCount = ref(0)

async function updateStats() {
  const res = await fetch(window.BASE_URL + '/api/stats').then(res => res.json()).then(res => res)
  postCount.value = res.posts
  attachmentCount.value = res.attachments
}

onMounted(() => {
  updateStats()
})

setInterval(() => {
  updateStats()
}, 5000)
</script>

<style scoped lang="sass">

</style>
