import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/Home.vue';
import Panel from '../views/Panel.vue'
import Evento from '../components/Evento.vue'
import Usuarios from '../components/Usuarios.vue'
import Creadores from '../components/Creadores.vue'
import Game from '../views/game/Game.vue'
import Logingame from '../views/game/Login.vue'
import Admingame from '../views/game/Admin.vue'


const routes = [
    { path: '/', name: 'Home', component: Home },
    {
        path: '/panel',
        name: 'Panel',
        component: Panel,
        children: [{
                path: '/panel/evento',
                name: 'Evento',
                component: Evento
            }, {
                path: '/panel/usuarios',
                name: 'Usuarios',
                component: Usuarios
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