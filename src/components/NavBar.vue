<template>
    <div class="navbar">
        <Menubar :model="items">
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
                <div class="flex align-items-center gap-2">
                    <Button icon="pi pi-verified" label="TikTok" severity="danger" />
                    <Button icon="pi pi-instagram" severity="danger" />
                    <Button icon="pi pi-whatsapp" severity="danger" />
                </div>
            </template>
        </Menubar>
    </div>
</template>
<script>

export default {
    data: () => ({
        items: [

            {
                label: 'Duck Racer',
                icon: 'pi pi-bolt',
                route: '/duckracer'
            },
        ]
    })

}
</script>
<style scoped>
.p-menubar {
    position: absolute;
    top: 0;
    width: 100%;
    border-radius: 0px !important;
    z-index: 10000;
}

.navbar {
    margin-bottom: 50px;
}
</style>