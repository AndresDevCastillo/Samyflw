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
                    <div class="row" style="padding: 0 50px">
                        <div class="col-lg-6" style="margin-bottom: 40px;;">
                            <Fieldset legend="Evento" :toggleable="true">
                                <p class="m-0">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                                    eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
                                    qui officia deserunt mollit anim id est laborum.
                                </p>
                            </Fieldset>
                        </div>
                        <div class="col-lg-6">
                            <Fieldset legend="Reglas" :toggleable="true">
                                <p class="m-0">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo.
                                </p>
                            </Fieldset>
                        </div>
                    </div>
                    <div class="row">
                        <Carousel :value="premios" :numVisible="3" :numScroll="3" :responsiveOptions="responsiveOptions">
                            <template #item="slotProps">
                                <div class="border-1 surface-border border-round m-2  p-3">
                                    <div class="mb-3">
                                        <div class="relative mx-auto">
                                            <img width="100%" height="350px" :src="slotProps.data.image"
                                                :alt="slotProps.data.name" class="border-round" />
                                            <Tag :value="'Puesto ' + (slotProps.index + 1)" class="absolute"
                                                style="left:5px; top: 5px" severity="danger" />
                                        </div>
                                    </div>
                                    <div class="mb-3 font-medium">{{ slotProps.data.name }}</div>

                                </div>
                            </template>
                        </Carousel>
                    </div>
                </div>
            </section>

            <div>
                <DataTable :value="creadores" tableStyle="min-width: 8rem" sortField="diamantes_mes_actual" :sortOrder="-1">
                    <template #header>
                        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                            <span class="text-xl text-900 font-bold">Creadores de contenido</span>
                            <div class="flex gap-2">
                                <Button @click="changeCreador('A')" label="A" severity="success" />
                                <Button @click="changeCreador('B')" label="B" severity="info" />
                                <Button @click="changeCreador('C')" label="C" severity="danger" />
                            </div>
                        </div>
                        <div class="containerC">
                            <Clasificacion nombre="Luis Devs" top="2" tipo="Platino"
                                foto="https://kinemasterkingpro.com/wp-content/uploads/2023/11/fotos-de-perfil-de-anime-1024x1024.jpg" />
                            <Clasificacion top="1" tipo="Oro" nombre="Armando Ortega"
                                foto="https://i.pinimg.com/236x/70/71/71/707171e258b8e7a4f875d19aa8ca31ea.jpg" />
                            <Clasificacion nombre="Daniela UWU" top="3" tipo="Cobre"
                                foto="https://frasesparami.com/wp-content/uploads/2023/09/Fotos-de-Perfil-para-Whatsapp-Para-Mujer.jpg" />
                        </div>

                    </template>
                    <Column header="#" headerStyle="width:3rem">
                        <template #body="slotProps">
                            {{ slotProps.index + 1 }}
                        </template>
                    </Column>
                    <Column field="usuario" header="Creador"></Column>
                    <Column field="diamantes_mes_actual" header="Puntos"></Column>
                    <Column field="diamantes_mes_anterior" header="Puntos Mes Anterior"></Column>
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
        creadores: [],
        premios: [
            {
                name: 'Silla Gamer',
                image: 'https://i.linio.com/p/c3786e7c22a6664d487c3b0c47ee67a3-product.jpg',

            },
            {
                name: 'Aro de luz',
                image: 'https://static.foto321.com/2021/09/aro-de-luz-321-sirve.jpg',

            },
            {
                name: 'Box Ramdon',
                image: 'https://toogeek.co/wp-content/uploads/2021/11/D_NQ_NP_864337-MCO45705901406_042021-O.jpg',

            }
        ],
        responsiveOptions: [
            {
                breakpoint: '1199px',
                numVisible: 3,
                numScroll: 1
            },
            {
                breakpoint: '1000px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '750px',
                numVisible: 1,
                numScroll: 1
            }
        ]
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
            for (let i = 0; i < this.arrayCreadores.length; i++) {
                if (this.arrayCreadores[i]._id === 'A') {
                    this.creadores = [];
                    this.creadores = this.arrayCreadores[i].creadores;
                }
            }
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

.containerC {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
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
