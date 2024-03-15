<template>
    <div class="app">
        <NavBar></NavBar>
        <!-- <div class="video-container">
            <video autoplay muted loop>
                <source src="/assets/video/eventos/fondo-eventos.mp4" type="video/mp4">
                Tu navegador no soporta esta funcionalidad video
            </video>
        </div> -->
        <div class="evento">
            <div v-if="spiner" class="flex w-full justify-content-center align-items-center" style="min-height: 100vh;">
                <ProgressSpinner />
            </div>
            <Card v-else>
                <template #content>
                    <TabView class="font-gamers">
                        <TabPanel v-for="evento in  eventos " :header="evento.titulo">
                            <div class="flex justify-content-around m-3  flex-wrap gap-6">
                                <Fieldset legend="Descripción" :toggleable="true">
                                    <p class="m-0">
                                        {{ evento.descripcion }}
                                    </p>
                                </Fieldset>
                                <Fieldset legend="Reglas" :toggleable="true">
                                    <p class="m-0">
                                        {{ evento.reglas }}
                                    </p>
                                </Fieldset>
                                <Fieldset :legend="`${evento.fecha_inicio} | ${evento.fecha_fin}`" :toggleable="true">
                                    <ProgressBar style="min-width: 300px;"
                                        :value="calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)">
                                    </ProgressBar>
                                </Fieldset>
                            </div>
                            <Carousel :value="Object.values(evento.premios)" :numVisible="3" :numScroll="3"
                                :responsiveOptions="responsiveOptions">
                                <template #item="slotProps">
                                    <div class="border-1 surface-border border-round m-2  p-3">
                                        <div class="mb-3">
                                            <div class="relative mx-auto">
                                                <img width="100%" :src="slotProps.data.imagen"
                                                    :alt="slotProps.data.descripcion" class="border-round imgPremio" />
                                                <Tag :value="'Puesto ' + (slotProps.index + 1)" class="absolute"
                                                    style="left:5px; top: 5px" />
                                            </div>
                                        </div>
                                        <div class="mb-3 font-medium">{{ slotProps.data.descripcion }}</div>

                                    </div>
                                </template>
                            </Carousel>
                        </TabPanel>

                    </TabView>
                    <DataTable :value="creadores" tableStyle="min-width: 8rem" sortField="diamantes_mes_actual"
                        :sortOrder="-1">
                        <template #header>
                            <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                                <span class="text-xl text-900 font-bold">Creadores de contenido</span>
                                <InlineMessage v-if="all != true" class="text-inline-evento" icon="pi pi-vedied" severity="success">
                                    GRUPO {{ grupoMostrado }}
                                </InlineMessage>
                                <InlineMessage v-else class="text-inline-evento" icon="pi pi-vedied" severity="success">
                                    Todos
                                </InlineMessage>
                                <div class="flex gap-2">
                                    <Button @click="changeCreador('Todos')" label="Todos" severity="warning" />
                                    <div class="flex gap-2" v-if="gruposMezcla == 'A-B' || gruposMezcla == 'B-A'">
                                        <Button @click="changeCreador('A-B')" label="A-B" severity="success" />
                                        <Button @click="changeCreador('C')" label="C" severity="danger" />
                                    </div>
                                    <div class="flex gap-2" v-else-if="gruposMezcla == 'A-C' || gruposMezcla == 'C-A'">
                                        <Button @click="changeCreador('A-C')" label="A-C" severity="success" />
                                        <Button @click="changeCreador('B')" label="B" severity="info" />
                                    </div>
                                    <div class="flex gap-2" v-else-if="gruposMezcla == 'C-B' || gruposMezcla == 'B-C'">
                                        <Button @click="changeCreador('A')" label="A" severity="success" />
                                        <Button @click="changeCreador('B-C')" label="B-C" severity="info" />
                                    </div>
                                    <div class="flex gap-2" v-else>
                                        <Button @click="changeCreador('A')" label="A" severity="success" />
                                        <Button @click="changeCreador('B')" label="B" severity="info" />
                                        <Button @click="changeCreador('C')" label="C" severity="danger" />
                                    </div>
                                </div>
                            </div>
                            <div class="containerC">
                                <Clasificacion :nombre="top3[1].usuario" top="2" tipo="Platino" :foto="top3[1].foto" />
                                <Clasificacion top="1" tipo="Oro" :nombre="top3[0].usuario" :foto="top3[0].foto" />
                                <Clasificacion :nombre="top3[2].usuario" top="3" tipo="Cobre" :foto="top3[2].foto" />
                            </div>
                        </template>
                        <Column header="#" headerStyle="width:3rem">
                            <template #body="slotProps">
                                {{ slotProps.index + 1 }}
                            </template>
                        </Column>
                        <Column field="usuario" header="Creador">
                            <template #body="slotProps">
                                <InlineMessage v-if="slotProps.index == 0" icon="pi pi-star" severity="warn"> {{
                slotProps.data.usuario }}
                                </InlineMessage>
                                <InlineMessage v-else-if="slotProps.index == 1" icon="pi pi-star" severity="error"> {{
                slotProps.data.usuario }}
                                </InlineMessage>
                                <InlineMessage v-else-if="slotProps.index == 2" icon="pi pi-star" severity="info"> {{
                slotProps.data.usuario }}
                                </InlineMessage>
                                <p v-else> {{ slotProps.data.usuario }}</p>
                            </template>
                        </Column>
                        <Column field="diamantes_mes_actual" header="Puntos">
                            <template #body="slotProps">
                                {{ slotProps.data.diamantes_mes_actual * multiplicador }}
                            </template>
                        </Column>
                        <Column field="diamantes_mes_anterior" header="Puntos Mes Anterior"></Column>
                        <Column field="grupo" header="Grupo">
                            <template #body="slotProps">
                                <Badge v-if="slotProps.data.grupo == 'A'" :value="slotProps.data.grupo" severity="success">
                                </Badge>
                                <Badge v-if="slotProps.data.grupo == 'B'" :value="slotProps.data.grupo" severity="info">
                                </Badge>
                                <Badge v-if="slotProps.data.grupo == 'C'" :value="slotProps.data.grupo" severity="danger">
                                </Badge>
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>
        </div>
    </div>
</template>
<style>
.containerC {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
}

/*.p-tabview .p-tabview-nav {
    border: 0 !important;
    border-width: 0 !important;
}

.p-tabview-nav-content::after {
    content: '';
    display: block;
    height: 2px;
    background-image: url('/assets/img/eventos/linea.png');
    width: 100%;
}

.p-tabview .p-tabview-nav li .p-tabview-nav-link {
    z-index: 2 !important;
    border: 0 !important;
}

.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
    border: solid !important;
    border-width: 0 0 2px 0 !important;
}*/
</style>

<script>
import axios from "axios";
import { useStoreMezcla } from "../store";

export default {
    name: 'EventoView',
    data: () => ({
        multiplicador: 1,
        API: import.meta.env.VITE_APP_API,
        gruposMezcla: null,
        storeMezcla: null,
        grupoMostrado: 'A',
        spiner: true,
        eventos: [],
        eventosLabel: [],
        arrayCreadores: [],
        creadores: [],
        premios: [
            {
                name: "Silla Gamer",
                image:
                    "https://i.linio.com/p/c3786e7c22a6664d487c3b0c47ee67a3-product.jpg",
            },
            {
                name: "Aro de luz",
                image: "https://static.foto321.com/2021/09/aro-de-luz-321-sirve.jpg",
            },
            {
                name: "Box Ramdon",
                image:
                    "https://toogeek.co/wp-content/uploads/2021/11/D_NQ_NP_864337-MCO45705901406_042021-O.jpg",
            },
        ],
        responsiveOptions: [
            {
                breakpoint: "1199px",
                numVisible: 3,
                numScroll: 1,
            },
            {
                breakpoint: "1000px",
                numVisible: 2,
                numScroll: 1,
            },
            {
                breakpoint: "750px",
                numVisible: 1,
                numScroll: 1,
            },
        ],
        topInsignias: ['Oro', 'Platino', 'Cobre'],
        arrayTop3: [],
        top3: [{
            usuario: '',
            foto: ''
        }, {
            usuario: '',
            foto: ''
        }, {
            usuario: '',
            foto: ''
        }],
        all: false
    }),
    methods: {
        changeCreador(grupo) {
            if (grupo != 'Todos') {
                if (grupo.length == 1) {
                    for (let i = 0; i < this.arrayCreadores.length; i++) {
                        if (this.arrayCreadores[i]._id === grupo) {
                            this.grupoMostrado = grupo;
                            this.creadores = [];
                            this.creadores = this.arrayCreadores[i].usuarios;
                        }
                    }
                    for (let i = 0; i < this.arrayTop3.length; i++) {
                        if (this.arrayTop3[i].grupo === grupo) {
                            this.top3 = [];
                            this.top3 = this.arrayTop3[i].usuarios;
                        }
                    }
                } else {
                    const mezcla = this.gruposMezcla.split('-');
                    const index1 = this.arrayCreadores.findIndex(creador => creador._id == mezcla[0]);
                    const index2 = this.arrayCreadores.findIndex(creador => creador._id == mezcla[1]);
                    if (index1 != -1 && index2 != -1) {
                        this.grupoMostrado = this.gruposMezcla;
                        this.creadores = [...this.arrayCreadores[index1].usuarios, ...this.arrayCreadores[index2].usuarios];
                    }
                    const index3 = this.arrayTop3.findIndex(top => top.grupo == mezcla[0]);
                    const index4 = this.arrayTop3.findIndex(top => top.grupo == mezcla[1]);
                    if (index3 != -1 && index4 != -1) {
                        const mezclaTops = [...this.arrayTop3[index3].usuarios, ...this.arrayTop3[index4].usuarios];
                        mezclaTops.sort((a, b) => b.diamantes_mes_actual - a.diamantes_mes_actual);
                        this.top3 = mezclaTops.slice(0, 3);
                    }
                }
                this.all = false;
            } else {
                this.creadores = [...this.arrayCreadores[0].usuarios, ...this.arrayCreadores[1].usuarios, ...this.arrayCreadores[2].usuarios];
                this.top3 = this.creadores.slice(0, 3);
                this.all = true;
            }
        },
        calcularPromdioTranscurrido(fechaInicio, fechaFin) {
            let fechaI = new Date(fechaInicio);
            let fechaF = new Date(fechaFin);

            let fechaActual = new Date();

            const tiempoTranscurrido = fechaActual - fechaI;

            const tiempoTotal = fechaF - fechaI;

            let porcentajeTranscurrido = (tiempoTranscurrido / tiempoTotal) * 100;

            porcentajeTranscurrido = Math.ceil(porcentajeTranscurrido);
            console.log(porcentajeTranscurrido);
            return porcentajeTranscurrido;
        }
    },
    async created() {
        this.storeMezcla = useStoreMezcla();
        this.gruposMezcla = this.storeMezcla.getGrupo();
        await axios.get(`${this.API}/usuario/agrupados`).then((resp) => {
            this.arrayCreadores = resp.data;
            if (this.gruposMezcla == null) {
                for (let i = 0; i < this.arrayCreadores.length; i++) {
                    if (this.arrayCreadores[i]._id === "A") {
                        this.creadores = [];
                        this.creadores = this.arrayCreadores[i].usuarios;
                    }
                }
            } else {
                const mezcla = this.gruposMezcla.split('-');
                const index1 = this.arrayCreadores.findIndex(creador => creador._id == mezcla[0]);
                const index2 = this.arrayCreadores.findIndex(creador => creador._id == mezcla[1]);
                if (index1 != -1 && index2 != -1) {
                    this.grupoMostrado = this.gruposMezcla;
                    this.creadores = [...this.arrayCreadores[index1].usuarios, ...this.arrayCreadores[index2].usuarios];
                }
            }
        });
        await axios.get(`${this.API}/usuario/top`).then((resp) => {
            this.arrayTop3 = resp.data;
            if (this.gruposMezcla == null) {
                for (let i = 0; i < this.arrayTop3.length; i++) {
                    if (this.arrayTop3[i].grupo === "A") {
                        this.top3 = [];
                        this.top3 = this.arrayTop3[i].usuarios;
                    }
                }
            } else {
                const mezcla = this.gruposMezcla.split('-');
                const index1 = this.arrayTop3.findIndex(top => top.grupo == mezcla[0]);
                const index2 = this.arrayTop3.findIndex(top => top.grupo == mezcla[1]);
                if (index1 != -1 && index2 != -1) {
                    const mezclaTops = [...this.arrayTop3[index1].usuarios, ...this.arrayTop3[index2].usuarios];
                    mezclaTops.sort((a, b) => b.diamantes_mes_actual - a.diamantes_mes_actual);
                    this.top3 = mezclaTops.slice(0, 3);
                }
            }

        });
        await axios.get(`${this.API}/evento/activo`).then((resp) => {
            this.eventos = resp.data;
            resp.data.forEach((evento) => {
                this.eventosLabel.push({
                    label: evento.titulo,
                    icon: "pi pi-calendar-times",
                });
            });
        });
        await axios.get(`${this.API}/bonus/multiplicador`).then((resp) => {
            this.multiplicador = resp.data.multiplicador;
        });
        this.spiner = false;
    },
};
</script>
<style scoped>
.video-container {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -1;
}

video {
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.evento {
    margin-top: 55px;
}

/* .evento>* {
    background: transparent !important;
    font-family: 'planet-gamers';
} */



.imgPremio {
    height: 300px;
}

@media (max-width: 739px) {

    .imgPremio {
        height: 200px;
    }
}

.evento .p-fieldset-legend-text {
    color: var(--primary-color) !important;
}

.p-fieldset.p-fieldset-toggleable .p-fieldset-legend a .p-fieldset-toggler {
    color: var(--primary-color);
}

.text-900 {
    color: var(--primary-color) !important;
}

.p-column-title {
    color: var(--primary-color) !important;
}

.p-datatable .p-column-header-content {
    color: var(--primary-color) !important;
}

.p-fieldset {
    border: 1px solid var(--primary-color);
}

.p-fieldset .p-fieldset-legend {
    border: 1px solid var(--primary-color);
}

.p-tabview-nav-container {
    display: flex;
    justify-content: center;
}
</style>