<template>
  <v-app>
    <v-main>
      <v-app-bar :elevation="2">
        <template v-slot:prepend>
        </template>

        <v-toolbar-title>
          <img style="height: 3ex; justify-content: center; vertical-align: middle; top: -50px" :src="fediverse" /> FediBGS
        </v-toolbar-title>

        <v-toolbar-items>
          <v-btn to="/">Home</v-btn>
          <v-btn to="/search">Post Search</v-btn>
          <v-btn to="/usersearch">User Search</v-btn>
          <v-btn to="/feed">Post Feed</v-btn>
        </v-toolbar-items>

      </v-app-bar>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
    import fediverse from '@/assets/fediverse.svg'
</script>
