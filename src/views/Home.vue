<template>
    <div class="inicio">
        <navBar />
        <main class="container mx-auto mt-6">

            <div class="mx-auto">
                <div class="perfil mx-auto flex">
                    <div class="informacion flex align-center">
                        <a href="#"><i class="pi pi-home"></i></a>
                        <div class="media rounded-circle">
                            <img src="../assets/img/logo_samy.jpeg" alt="profile-image" class="rounded-circle">
                            <div class="data-fill style-2 name"><span>SamiFlw</span></div>
                        </div>
                        <a href="#"><i class="pi pi-trash"></i></a>
                    </div>
                </div>
            </div>
            <h1 class="font-bold bc-pink">TikTok LIVE Ascendente 1</h1>

            <Accordion :multiple="true" :activeIndex="[0, 1, 2]" class="tabs">
                <AccordionTab v-for="(tab, index) in tabs" :key="index" :header="tab.title">
                    <p class="m-0">{{ tab.description }}</p>
                </AccordionTab>
            </Accordion>
        </main>
    </div>
</template>
<script>
export default {
    data: () => ({
        msg: 'Hola  mundo',
        tabs: [
            {
                title: 'Reglas',
                description: 'los premios son entregados al siguiente mes, la clasificación de grupo depende de su cantidad de puntos ganados. GRUPO A (Fuerte) GRUPO B (Medio) GRUPO C (Novato)'
            }, {
                title: 'Recompensas',
                description: ' Gran premio '
            },

            {
                title: 'Grupos',
                description: ' Grupos A'
            }
        ]
    })
}
</script>
<style scoped>
:root {
    --btn-gradient: linear-gradient(94deg, #E93E84 14.36%, #F46D8F 42.6%, #FE854E 80.39%)
}

.inicio {
    margin-bottom: 20px !important;
}

.perfil {
    width: 690px;
    height: 400px;
    max-width: 100%;
    background-image: url('../assets/img/tiktok.webp');
    background-repeat: no-repeat;
    background-size: cover;
    margin-bottom: 40px;
    justify-content: center;
}

.perfil>.informacion {
    color: white !important;
    align-items: center !important;
    gap: 20px;
}

.rounded-circle {
    border-radius: 50% !important;
}

.media {
    position: relative;
    margin: 0 auto 15px;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    padding: 11px;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
}


.media>img {
    border-style: none;
    max-width: 130px;
    vertical-align: middle;
    width: 130px;
    min-width: 130px;
    height: 130px;
    object-fit: cover;
}

svg.radial-progress {
    height: auto;
    position: absolute;
    overflow: visible;
    height: 100%;
    top: 0;
    transform: rotate(-265deg);
    width: 100%;
}

.media>.data-fill {
    background: var(--btn-gradient);
    padding: 3px 10px;
    width: 130px;
    font-size: 14px;
    border: 0;
    transform: translateY(-10px);
    border-radius: 20px;
}

.m-b20 {
    margin-bottom: 20px;
}

a {
    color: #000000;
    cursor: pointer;
}

.header.nav>.navBarInicio {
    background-color: #2c2f39 !important;
    border-width: 0 !important;
}

.appBar,
[data-pc-section="submenu"] {
    background-color: #2c2f39 !important;
}

.tabs>* {
    margin-bottom: 40px !important;
    border-radius: 12px !important;
}

.tabs>div>div:first-child {
    background-color: #F64F72 !important;
}

.tabs>div>div:last-child {
    background-color: #2c2f39 !important;
    border-bottom-left-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
}

.tabs>div>div:first-child>a,
.tabs>div>div:last-child>div {
    border-width: 0 !important;
}

h1 {
    font-size: 2.5rem !important;
}

.bc-pink {
    color: #F64F72 !important;
}
</style>
