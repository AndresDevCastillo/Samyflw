<template>
    <appBar />
    <div class="Panel">
        <main class="main">
            <router-view />
        </main>
    </div>
</template>
<script>
export default {
    data: () => ({

    })
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