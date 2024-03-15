import { createRouter, createWebHashHistory } from "vue-router";
import Home from '../views/Home.vue';
import EventoView from '../views/Evento.vue';
import LoginEvento from '../views/Login.vue'
import Registro from '../views/Registro.vue';
import Panel from '../views/Panel.vue'
import Evento from '../components/Evento.vue'
import Creadores from '../components/Creadores.vue'
import Bonus from '../components/Bonus.vue'
import Promocion from '../components/Promocion.vue'
import Promouser from '../components/Promouser.vue'
import PremioAleatorio from "../components/PremioAleatorio.vue"
import Game from '../views/game/Game.vue'
import Logingame from '../views/game/Login.vue'
import Admingame from '../views/game/Admin.vue'
import { useStoreEvento } from '../store'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/evento', name: 'EventoView', component: EventoView },
    { path: '/login', name: 'LoginEvento', component: LoginEvento },
    { path: '/registro', name: 'RegistroEvento', component: Registro },
    {
        path: '/panel',
        name: 'Panel',
        component: Panel,
        children: [{
                path: '/panel/evento',
                name: 'Evento',
                component: Evento,
                beforeEnter: (to, from, next) => {
                    const store = useStoreEvento();
                    if (store.isActive()) {
                        return store.isAdmin() ? next() : next(from);
                    }
                    return next('/login');
                }
            },
            {
                path: '/panel/creadores',
                name: 'Creadores',
                component: Creadores,
                beforeEnter: (to, from, next) => {
                    const store = useStoreEvento();
                    if (store.isActive()) {
                        return store.isAdmin() ? next() : next(from);
                    }
                    return next('/login');
                }
            },
            {
                path: '/panel/bonus',
                name: 'Bonus',
                component: Bonus,
                beforeEnter: (to, from, next) => {
                    const store = useStoreEvento();
                    return store.isActive() ? next() : next('/login');
                }
            },
            {
                path: '/panel/promocion',
                name: 'Promocion',
                component: Promocion,
                beforeEnter: (to, from, next) => {
                    const store = useStoreEvento();
                    return store.isActive() ? next() : next('/login');
                }
            },
            {
                path: '/panel/promouser',
                name: 'Promouser',
                component: Promouser,
                beforeEnter: (to, from, next) => {
                    const store = useStoreEvento();
                    return store.isActive() ? next() : next('/login');
                }
            },
            {
                path: '/panel/aleatorios',
                name: 'PremiosAleatorios',
                component: PremioAleatorio,
                beforeEnter: (to, from, next) => {
                    const store = useStoreEvento();
                    return store.isActive() ? next() : next('/login');
                }
            }
        ]
    },
    { path: '/duckracer', name: 'Game', component: Game },
    { path: '/duckracer/login', name: 'Login', component: Logingame },
    { path: '/duckracer/admin', name: 'Admin', component: Admingame }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;