<template>
    <div class="navbar">
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
        <header class="w-full m-0">
            <div class="opciones flex justify-content-between align-items-center w-full">
                <a href="" class="logo"> <span>Samy</span>flw</a>
                <nav>
                    <router-link to="/duckracer">Juegos</router-link>
                    <a></a>
                    <a href="#footer">Redes Sociales</a>
                    <router-link to="/evento">Eventos</router-link>
                    <router-link to="/login">Login Agencia</router-link>
                    <Button icon="pi pi-bars" class="botonMenu" text size="large" @click="visibleSidebar = true" />
                </nav>
            </div>
        </header>
        <div class="container-linea flex sm:justify-content-start md:justify-content-end w-full">
            <div class="linea xs:w-full sm:w-full md:w-6"></div>
        </div>
    </div>
</template>
<script>

export default {
    data: () => ({
        visibleSidebar: false,
        itemsMenu: [
            {
                separator: true
            },
            {
                label: 'Creadores',
                items: [
                    {
                        label: 'Login Agencia',
                        icon: 'pi pi-users',
                        route: '/login',
                    },
                ]
            },
            {
                label: 'Eventos',
                items: [
                    {
                        label: 'Eventos Activos',
                        icon: 'pi pi-desktop',
                        route: '/evento'
                    }
                ]
            },
            {
                separator: true
            },
            {
                label: 'Juegos',
                items: [
                    {
                        label: 'DuckRacer',
                        icon: 'pi pi-caret-right',
                        route: '/duckracer',
                    },]
            }
        ]
    })
}
</script>
<style scoped>
header {
    position: absolute;
    top: 0;
    height: 60px;
    padding: 0 80px;
    padding-top: 10px;
    z-index: 1;
    font-family: 'planet-gamers' !important;
    background-image: url('/assets/img/header/header-bg.png') !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
}

.container-linea {
    position: absolute;
}

.linea {
    background-image: url('/assets/img/header/header-line.png') !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
    z-index: 12;
    height: 4px;
}

header .logo {
    color: #fff;
    font-size: 2em;
    font-weight: 700;
    text-decoration: none;
}

header .logo span {
    color: #84DC16;
}

header nav {
    display: flex;
    gap: 25px;
}

.botonMenu {
    display: none;
}

@media (max-width: 739px) {

    header nav a {
        display: none;
    }

    .botonMenu {
        display: flex;
    }
}

header nav a {
    color: #fff;
    font-size: 1.1em;
    text-decoration: none;
}
</style>
