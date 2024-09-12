/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

declare global {
  interface Window {
    BASE_URL: string
  }
}

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

if (import.meta.env.PROD) {
  window.BASE_URL = ""
} else {
  window.BASE_URL = "http://127.0.0.1:8000"
}

app.mount('#app')
