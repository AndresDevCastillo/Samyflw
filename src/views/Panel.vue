<template>
    <appBar />
    <div class="Panel">
        <main class="main">
            <router-view />
        </main>
    </div>
</template>
<script>
import { useStoreEvento } from '../store';
export default {
    data: () => ({

    }),
    created() {
        this.store = useStoreEvento();
        if (!this.store.isActive()) {
            this.$router.push('/login');
        }
    }
}

</script>
<style scoped>
.panel {
    height: 100vh;
}

* {
    border-width: 0 !important;
}
</style>