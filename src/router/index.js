import { createRouter, createWebHistory } from "vue-router";
import Game from '../views/Game.vue'
import Login from '../views/Login.vue'

const routes = [
    { path: '/', name: 'Game', component: Game },
    { path: '/login', name: 'Login', component: Login }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;