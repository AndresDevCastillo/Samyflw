import { createRouter, createWebHistory } from "vue-router";
import Game from '../views/Game.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'

const routes = [
    { path: '/', name: 'Game', component: Game },
    { path: '/login', name: 'Login', component: Login },
    { path: '/admin', name: 'Admin', component: Admin }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;