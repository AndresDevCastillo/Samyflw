import { defineStore } from 'pinia';

export const useSessionStore = defineStore('session', {
    state: () => ({
        user: null,
        sessionTime: null,
    }),

    actions: {
        isActive() {
            console.log(this.user);
            if (this.user) {
                return true;
            }
            return false;
        },
        saveUser(user) {
            console.log("guardando")
            this.user = user;
            this.sessionTime = new Date();
            console.log(this.user);

        },
        token() {
            return this.user.access_token;
        },
        clearUser() {
            this.user = null;
            this.sessionTime = null;
        }
    },
});

export const useStoreEvento = defineStore('evento', {
    state: () => ({
        user: null,
    }),

    actions: {
        isActive() {
            let u;
            try {
                u = JSON.parse(localStorage.user);
            } catch (error) {
                u = null;
            }

            return u != null;
        },
        isAdmin() {
            const u = JSON.parse(localStorage.user);
            return u.rol.toLowerCase() == "admin";
        },
        saveUser(user) {
            console.log("guardando")
            localStorage.user = JSON.stringify(user);
            this.user = user;

        },
        getToken() {
            const u = JSON.parse(localStorage.user);
            return u.access_token;
        },
        getUsuario() {
            return JSON.parse(localStorage.user);
        },
        getId() {
            const u = JSON.parse(localStorage.user);
            return u._id;
        },
        getFoto() {
            const u = JSON.parse(localStorage.user);
            return u.foto;
        },
        clearUser() {
            this.user = null;
            localStorage.user = null;
        },
    },
});