import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// Unocss
import "@unocss/reset/tailwind.css";
import 'uno.css'

// pinia全局状态管理
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // pinia持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

//vue-router路由管理
import router from "./router/index";
app.use(router);

app.mount("#app")