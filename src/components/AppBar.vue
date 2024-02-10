<template>
    <div class="appBarContainer">
        <Sidebar v-model:visible="visibleSidebar">
            <Menu :model="itemsMenu" class="w-full">
                <template #start>
                    <span class="inline-flex items-center gap-1 px-2 py-2 w-full sm:w-[15rem]">
                        <svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-[2rem]">
                            <path
                                d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
                                class="fill-primary-500 dark:fill-primary-400" />
                            <path
                                d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z"
                                class="fill-surface-700 dark:fill-surface-0/80" />
                        </svg>
                        <span class="font-medium text-xl font-bold">SAMYFLW</span>
                    </span>
                </template>
                <template #submenuheader="{ item }">
                    <span class="text-primary-500 dark:text-primary-400 font-bold leading-none">{{ item.label }}</span>
                </template>
                <template #item="{ item, props }">
                    <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                            <span :class="item.icon" />
                            <span class="ml-2">{{ item.label }}</span>
                        </a>
                    </router-link>
                </template>
            </Menu>
        </Sidebar>
        <Menubar class="appBar" :model="sinMenu">
            <template #start>
                <div class="flex gap-2 align-items-center">
                    <Button icon="pi pi-bars" @click="visibleSidebar = true" />
                    <h2 class="m-0 font-bold">SAMYFLW</h2>
                </div>
            </template>
            <template #end>
                <div class="flex items-center gap-2">
                    <a href="#" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
                        <Avatar v-if="store.isAdmin() || store.getFoto().length == 0" icon="pi pi-user" class="mr-2"
                            shape="circle" />
                        <Avatar v-else :image="store.getFoto()" class="mr-2" shape="circle" />
                    </a>
                    <Menu ref="menu" id="overlay_menu" :model="itemsUsuario" :popup="true" :focusedOptionId="null"
                        :aria-activedescendant="false">
                        <template #start>
                            <button v-ripple
                                class="relative overflow-hidden w-full p-link flex items-center p-2 pl-3 text-surface-700 dark:text-surface-0/80 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-none">
                                <Avatar v-if="store.isAdmin() || store.getFoto().length == 0" icon="pi pi-user" class="mr-2"
                                    shape="circle" />
                                <Avatar v-else :image="store.getFoto()" class="mr-2" shape="circle" />

                                <span class="inline-flex flex-column justify-start">
                                    <span class="font-bold">{{ usuarioLog.usuario }}</span>
                                    <span class="text-sm">{{ usuarioLog.rol }}</span>
                                </span>
                            </button>
                        </template>
                        <template #item="{ item, props }">
                            <a v-ripple class="flex items-center" @click="actionMenu(item.action)" v-bind="props.action">
                                <span :class="item.icon" />
                                <span class="ml-2">{{ item.label }}</span>
                            </a>
                        </template>
                    </Menu>
                </div>
            </template>
        </Menubar>
        <dialogMiPerfil :mostrarMiPerfil="mostrarPerfil" @dialogPerfilOculto="mostrarPerfil = false" />
        <dialogEditarPerfil :mostrarEditar="mostrarEditar" @dialogEditarOculto="mostrarEditar = false"
            @perfilActualizado="getNewDatos" />
    </div>
</template>

<script>
import axios from 'axios';
import { useStoreEvento } from '../store';
import dialogMiPerfil from './MiPerfil.vue';
import dialogEditarPerfil from './EditarPerfil.vue';
export default {
    components: {
        dialogMiPerfil,
        dialogEditarPerfil,
    },
    data: () => ({
        API: import.meta.env.VITE_APP_API,
        store: null,
        sinMenu: [],
        itemsMenu: [],
        itemsUsuario: [

        ],
        mostrarPerfil: false,
        mostrarEditar: false,
        usuarioLog: {
            usuario: null,
            rol: null,
            correo: null,
            telefono: null
        },
        visibleSidebar: false

    }),
    methods: {
        toggle(event) {
            this.$refs.menu.toggle(event);
        },
        actionMenu(action) {
            action = action.toLowerCase();
            switch (action) {
                case 'perfil':
                    this.mostrarPerfil = true;
                    break;

                case 'editar_perfil':
                    this.mostrarEditar = true;
                    break;

                case 'cerrar_sesión':
                    this.cerrarSesion();
                    break;
            }
        },
        async getDatosUsuario() {
            await axios.get(`${this.API}/usuario/${this.store.getId()}`, {
                headers: {
                    Authorization: `Bearer ${this.store.getToken()}`
                }
            }).then(response => {
                this.usuarioLog.usuario = response.data.usuario;
                this.usuarioLog.rol = response.data.rol;
            }).catch(error => {
                console.log('Error: ', error);
            });
        },
        async getNewDatos() {
            await axios.get(`${this.API}/usuario/${this.store.getId()}`, {
                headers: {
                    Authorization: `Bearer ${this.store.getToken()}`,
                }
            }).then(response => {
                this.store.newDatos(response.data);
            });
        },
        cerrarSesion() {
            this.store.clearUser();
            this.$router.push('/login');
        }
    },
    created() {
        this.store = useStoreEvento();
        const admin = this.store.isAdmin();
        if (admin) {
            this.itemsMenu = [
                {
                    separator: true
                },
                {
                    label: 'Eventos',
                    items: [
                        {
                            label: 'Eventos',
                            icon: 'pi pi-calendar-plus',
                            route: '/panel/evento',
                        }
                    ]
                },
                {
                    label: 'Creadores',
                    items: [
                        {
                            label: 'Creador',
                            icon: 'pi pi-users',
                            route: '/panel/creadores',
                        }
                    ]
                },
                {
                    label: 'Bonus',
                    items: [{
                        label: 'Bonus',
                        icon: 'pi pi-money-bill',
                        route: '/panel/bonus',
                    }]
                },
                {
                    separator: true
                }
            ];
            this.itemsUsuario = [
                {
                    label: 'Mi perfil',
                    icon: 'pi pi-user',
                    action: 'perfil',
                },
                {
                    label: 'Editar perfil',
                    icon: 'pi pi-user-edit',
                    action: 'editar_perfil',
                }, {
                    label: 'Cerrar sesión',
                    icon: 'pi pi-sign-out',
                    action: 'cerrar_sesión',
                }
            ];
        }
        else {
            this.itemsMenu = [
                {
                    separator: true
                },
                {
                    label: 'Bonus',
                    icon: 'pi pi-money-bill',
                    route: '/panel/bonus',
                }, {
                    separator: true
                }
            ];
            this.itemsUsuario = [
                {
                    label: 'Editar perfil',
                    icon: 'pi pi-user-edit',
                    action: 'editar_perfil',
                }, {
                    label: 'Cerrar sesión',
                    icon: 'pi pi-sign-out',
                    action: 'cerrar_sesión',
                }
            ];
        }
        this.getDatosUsuario();
    }
};
</script>
<style>
.appBar {
    background-color: #1f2937 !important;
    border-radius: 0 !important;
    border: 0 !important;
}

.p-sidebar-content>div,
.p-sidebar-content>.p-menu.p-component>.p-menu-end>.p-menu.p-component {
    background: none !important;
    border: 0 !important;
    min-width: 100% !important;
    border-radius: 0 !important;
    height: 100% !important;
}

.p-menu .p-submenu-header {
    background: none !important;
}

.p-panel .p-panel-header {
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
}
</style>
