import { defineStore } from 'pinia';

export const useSessionStore = defineStore('session', {
    state: () => ({
        user: "hola",
        sessionTime: null,
    }),

    actions: {
        returnUser() {
            return ({
                user: this.user
            })
        },
        saveUser(user) {
            this.user = user;
            this.sessionTime = new Date();
        },
        clearUser() {
            this.user = null;
            this.sessionTime = null;
        }
    },
});