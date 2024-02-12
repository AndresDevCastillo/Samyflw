<template>
    <div class="appBarContainer">
        <Sidebar v-model:visible="visibleSidebar">
            <Menu :model="itemsMenu" class="w-full">
                <!-- <template #start>
                    <span class="inline-flex items-center gap-1 px-2 py-2 w-full sm:w-[15rem]">
                        <span class="text-2xl font-bold logo"><span>Samy</span>flw</span>
                    </span>
                </template> -->
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
                    <span class="text-2xl font-bold logo"><span>Samy</span>flw</span>
                </div>
            </template>
            <template #end>
                <div class="flex items-center gap-2">
                    <a href="#" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
                        <Avatar v-if="store.isAdmin() || store.getFoto().length == 0" icon="pi pi-user" class="mr-2"
                            shape="circle" style="background-color: var(--primary-color); color: #2a1261" />
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
                    label: 'Creadores',
                    items: [
                        {
                            label: 'Gestionar Creador',
                            icon: 'pi pi-users',
                            route: '/panel/creadores',
                        },
                        {
                            label: 'Configuración Bonus',
                            icon: 'pi pi-money-bill',
                            route: '/panel/bonus',
                        }
                    ]
                },
                {
                    label: 'Eventos',
                    items: [
                        {
                            label: 'Gestionar Eventos',
                            icon: 'pi pi-calendar-plus',
                            route: '/panel/evento',
                        },
                        {
                            label: 'Vista Previa',
                            icon: 'pi pi-desktop',
                            route: '/evento'
                        }
                    ]
                },
                {
                    separator: true
                },
                {
                    label: 'Administración',
                    items: [
                        {
                            label: 'Mi perfil',
                            icon: 'pi pi-user',
                            route: 'perfil',
                        },
                        {
                            label: 'Editar perfil',
                            icon: 'pi pi-user-edit',
                            route: 'editar_perfil',
                        }, {
                            label: 'Cerrar sesión',
                            icon: 'pi pi-sign-out',
                            route: 'cerrar_sesión',
                        }]
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
                },
                {
                    label: 'Evento',
                    icon: 'pi pi-calendar-plus',
                    route: '/evento'
                },
                {
                    separator: true
                },
                {
                    label: 'Administración',
                    items: [
                        {
                            label: 'Mi perfil',
                            icon: 'pi pi-user',
                            route: 'perfil',
                        },
                        {
                            label: 'Editar perfil',
                            icon: 'pi pi-user-edit',
                            route: 'editar_perfil',
                        }, {
                            label: 'Cerrar sesión',
                            icon: 'pi pi-sign-out',
                            route: 'cerrar_sesión',
                        }]
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

.logo {
    color: #fff;
    font-size: 2em;
    font-weight: 700;
    text-decoration: none;
}

.logo>span {
    color: #84DC16;
}
</style>
