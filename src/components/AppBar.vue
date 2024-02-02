<template>
    <div class="appBarContainer">
        <Menubar class="appBar" :model="itemsMenu">
            <template #item="{ item, props, hasSubmenu }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                        <span :class="item.icon" />
                        <span class="ml-2">{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                    <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
                </a>
            </template>
            <template #end>
                <div class="flex items-center gap-2">
                    <a href="#" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
                        <Avatar icon="pi pi-user" size="xlarge" shape="circle" />
                    </a>
                    <Menu ref="menu" id="overlay_menu" :model="itemsUsuario" :popup="true" :focusedOptionId="null" :aria-activedescendant="false">
                        <template #start>
                            <button v-ripple class="relative overflow-hidden w-full p-link flex items-center p-2 pl-3 text-surface-700 dark:text-surface-0/80 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-none">
                                <Avatar v-if="store.isAdmin() || store.getFoto().length == 0" icon="pi pi-user" class="mr-2" shape="circle" />
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
        <dialogEditarPerfil :mostrarEditar="mostrarEditar" @dialogEditarOculto="mostrarEditar = false" @perfilActualizado="getNewDatos" />
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
        itemsMenu: [
            {
                label: 'Eventos',
                icon: 'pi pi-calendar-plus',
                route: '/panel/evento',
            },
            {
                label: 'Creadores',
                icon: 'pi pi-users',
                route: '/panel/creadores',
            }
        ],
        itemsUsuario: [
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
        ],
        mostrarPerfil: false,
        mostrarEditar: false,
        usuarioLog: {
            usuario: null,
            rol: null,
            correo: null,
            telefono: null
        }
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
            await axios.get(`${this.API}/usuario/${this.store.getUsuario()._id}`).then(response => {
                console.log(response.data);
                this.usuarioLog.usuario = response.data.usuario;
                this.usuarioLog.rol = response.data.rol;
            }).catch(error => {
                console.log('Error: ', error);
            });
        },
        async getNewDatos() {
            await axios.get(`${this.API}/usuario/${this.store.getId()}`).then(response => {
                this.store.saveUser(response.data);
            });
        },
        cerrarSesion() {
            this.store.clearUser();
            this.$router.push('/login');
        }
    },
    created() {
        this.store = useStoreEvento();
        this.getDatosUsuario();
    }
};
</script>
