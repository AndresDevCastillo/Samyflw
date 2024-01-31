import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/Home.vue';
import LoginEvento from '../views/Login.vue'
import Panel from '../views/Panel.vue'
import Evento from '../components/Evento.vue'
import Creadores from '../components/Creadores.vue'
import Game from '../views/game/Game.vue'
import Logingame from '../views/game/Login.vue'
import Admingame from '../views/game/Admin.vue'


const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'LoginEvento', component: LoginEvento },
    {
        path: '/panel',
        name: 'Panel',
        component: Panel,
        children: [{
                path: '/panel/evento',
                name: 'Evento',
                component: Evento
            },
            {
                path: '/panel/creadores',
                name: 'Creadores',
                component: Creadores
            }
        ]
    },
    { path: '/duckracer', name: 'Game', component: Game },
    { path: '/duckracer/login', name: 'Login', component: Logingame },
    { path: '/duckracer/admin', name: 'Admin', component: Admingame }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;