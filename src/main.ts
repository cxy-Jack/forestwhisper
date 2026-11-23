import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'maotaui'
import 'maotaui/styles.css'
import App from './App.vue'
import router from './router'
import { initTheme } from './composables/useTheme'
import './styles/app.scss'

initTheme()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
