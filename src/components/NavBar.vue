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
        <header>
            <a href="" class="logo"> <span>Samy</span>flw</a>
            <nav>
                <router-link to="/duckracer">Juegos</router-link>
                <a></a>
                <a href="#footer">Redes Sociales</a>
                <router-link to="/evento">Eventos</router-link>
                <router-link to="/login">Agencia</router-link>
                <Button icon="pi pi-bars" class="botonMenu" text size="large" @click="visibleSidebar = true" />
            </nav>
        </header>
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
                        label: 'Ingresar',
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
    width: 100%;
    height: 80px;
    padding: 0 80px;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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