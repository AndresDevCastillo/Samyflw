import { createApp } from 'vue'
import './style.css'
import 'primevue/resources/themes/lara-light-green/theme.css'

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
