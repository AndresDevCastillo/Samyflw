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
        clearUser() {
            this.user = null;
            this.sessionTime = null;
        }
    },
});