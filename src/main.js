import { createApp } from 'vue'
import './style.css'
import '../node_modules/primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import 'primevue/resources/themes/lara-dark-purple/theme.css'

import App from './App.vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice';
import router from './router'
import { createPinia } from 'pinia'

createApp(App)
    .use(createPinia())
    .use(router)
    .use(PrimeVue)
    .use(ToastService)

    .mount('#app')
