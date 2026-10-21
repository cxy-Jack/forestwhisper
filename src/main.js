import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 导入自定义加载动画组件
import LoadingAnimation from './components/LoadingAnimation.vue'

// 导入Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

// 添加所有solid图标到库中
library.add(fas)

const app = createApp(App)

// 注册全局组件
app.component('LoadingAnimation', LoadingAnimation)

// 注册Font Awesome组件
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router).mount('#app')