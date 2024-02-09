<template>
    <div class="navbar">
        <header>
            <a href="" class="logo"> <span>Samy</span>flw</a>
            <nav>
                <a href="">Juegos</a>
                <a href="">Redes Sociales</a>

            </nav>
        </header>
    </div>
</template>
<script>

export default {
    data: () => ({

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

@media (max-width: 539px) {

    header nav {
        display: none;
        gap: 25px;
    }
}

header nav a {
    color: #fff;
    font-size: 1.1em;
    text-decoration: none;
}
</style>