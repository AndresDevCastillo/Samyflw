<template>
    <NavBar></NavBar>
    <div class="inicio">
        <div class="fondo">
            <section id="hero">
                <div class="hero-container">
                    <h1 class="mb-4 pb-0">The TikTok<br><span>LIVE</span> Ascendente <span>1</span></h1>
                    <p class="mb-4 pb-0">10-12 December, Downtown Conference Center, New York</p>
                    <a href="#about" class="about-btn">Contactar</a>
                </div>
            </section>
            <!-- ======= About Section ======= -->
            <section id="about">
                <div class="container position-relative">
                    <div class="row">
                        <div class="col-lg-6">
                            <h2>Sobre el evento</h2>
                            <p>Sed nam ut dolor qui repellendus iusto odit. Possimus inventore eveniet accusamus error amet
                                eius aut
                                accusantium et. Non odit consequatur repudiandae sequi ea odio molestiae. Enim possimus sunt
                                inventore in
                                est ut optio sequi unde.</p>
                        </div>
                        <div class="col-lg-6">
                            <h3>Reglas</h3>
                            <p>los premios son entregados al siguiente mes, la clasificación de grupo depende de su cantidad
                                de puntos ganados. GRUPO A (Fuerte) GRUPO B (Medio) GRUPO C (Novato)</p>
                        </div>
                    </div>
                </div>
            </section>
            <div class="table">
                <DataTable :value="creadores" tableStyle="min-width: 27rem" sortField="diamantes_mes_actual" :sortOrder="-1"
                    paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
                    <template #header>
                        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                            <span class="text-xl text-900 font-bold">Creadores de contenido</span>
                            <div class="flex gap-2">
                                <Button @click="changeCreador('A')" label="A" severity="success" />
                                <Button @click="changeCreador('B')" label="B" severity="info" />
                                <Button @click="changeCreador('C')" label="C" severity="danger" />
                            </div>
                        </div>
                    </template>
                    <Column field="usuario" header="Creador"></Column>
                    <Column field="diamantes_mes_actual" header="Diamantes 💎"></Column>
                    <Column field="diamantes_mes_anterior" header="Mes Anterior 💎"></Column>
                    <Column field="grupo" header="Grupo">
                        <template #body="slotProps">
                            <Badge v-if="slotProps.data.grupo == 'A'" :value="slotProps.data.grupo" severity="success">
                            </Badge>
                            <Badge v-if="slotProps.data.grupo == 'B'" :value="slotProps.data.grupo" severity="info"></Badge>
                            <Badge v-if="slotProps.data.grupo == 'C'" :value="slotProps.data.grupo" severity="danger">
                            </Badge>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data: () => ({
        API: 'https://samyflw.fly.dev',
        arrayCreadores: [],
        creadores: []
    }),
    methods: {
        changeCreador(grupo) {
            for (let i = 0; i < this.arrayCreadores.length; i++) {
                if (this.arrayCreadores[i]._id === grupo) {
                    this.creadores = [];
                    this.creadores = this.arrayCreadores[i].creadores;
                }
            }
        },
    },
    async mounted() {
        await axios.get(`${this.API}/creador/agrupados`).then(resp => {
            this.arrayCreadores = resp.data;
            this.creadores = this.arrayCreadores[0].creadores;
        })
    }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato&family=Raleway&display=swap');

.fondo {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-image: url('../assets/img/hero-bg.jpg');
    background-size: cover;
}

.table {
    width: 95%;
    margin: 0 auto;
    padding: 70px;
}

#hero {
    width: 100%;
    height: 100vh;
    background: url(../img/hero-bg.jpg) top center;
    background-size: cover;
    overflow: hidden;
    position: relative;
}

@media (min-width: 1024px) {
    #hero {
        background-attachment: fixed;
    }
}

#hero:before {
    content: "";
    background: rgba(6, 12, 34, 0.8);
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
}

#hero .hero-container {
    position: absolute;
    bottom: 0;
    left: 0;
    top: 90px;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    padding: 0 15px;
}

@media (max-width: 991px) {
    #hero .hero-container {
        top: 70px;
    }
}

#hero h1 {
    color: #fff;
    font-family: "Raleway", sans-serif;
    font-size: 56px;
    font-weight: 600;
    text-transform: uppercase;
}

#hero h1 span {
    color: #f82249;
}

@media (max-width: 991px) {
    #hero h1 {
        font-size: 34px;
    }
}

#hero p {
    color: #ebebeb;
    font-weight: 700;
    font-size: 20px;
}

@media (max-width: 991px) {
    #hero p {
        font-size: 16px;
    }
}




#hero .about-btn {
    font-family: "Raleway", sans-serif;
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 1px;
    display: inline-block;
    padding: 12px 32px;
    border-radius: 50px;
    transition: 0.5s;
    line-height: 1;
    margin: 10px;
    color: #fff;
    animation-delay: 0.8s;
    border: 2px solid #f82249;
    text-decoration: none;
}

#hero .about-btn:hover {
    background: #f82249;
    color: #fff;
}

@keyframes pulsate-btn {
    0% {
        transform: scale(0.6, 0.6);
        opacity: 1;
    }

    100% {
        transform: scale(1, 1);
        opacity: 0;
    }
}

#about {
    background: url("../img/about-bg.jpg");
    background-size: cover;
    overflow: hidden;
    position: relative;
    color: #fff;
    padding: 60px 0 40px 0;
}

@media (min-width: 1024px) {
    #about {
        background-attachment: fixed;
    }
}

#about:before {
    content: "";
    background: rgba(13, 20, 41, 0.8);
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
}

#about h2 {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #fff;
}

#about h3 {
    font-size: 18px;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 10px;
    color: #fff;
}

#about p {
    font-size: 14px;
    margin-bottom: 20px;
    color: #fff;
}

.container {
    --bs-gutter-x: 1.5rem;
    --bs-gutter-y: 0;
    width: 100%;
    padding-right: calc(var(--bs-gutter-x) * .5);
    padding-left: calc(var(--bs-gutter-x) * .5);
    margin-right: auto;
    margin-left: auto
}

.position-relative {
    position: relative !important
}

.row {
    --bs-gutter-x: 1.5rem;
    --bs-gutter-y: 0;
    display: flex;
    flex-wrap: wrap;
    margin-top: calc(-1 * var(--bs-gutter-y));
    margin-right: calc(-0.5 * var(--bs-gutter-x));
    margin-left: calc(-0.5 * var(--bs-gutter-x));
}

.row>* {
    flex-shrink: 0;
    width: 100%;
    max-width: 100%;
    padding-right: calc(var(--bs-gutter-x) * 0.5);
    padding-left: calc(var(--bs-gutter-x) * 0.5);
    margin-top: var(--bs-gutter-y);
}

@media (min-width: 992px) {
    .col-lg-6 {
        flex: 0 0 auto;
        width: 50%;
    }

    .col-lg-3 {
        flex: 0 0 auto;
        width: 25%;
    }
}
</style>
