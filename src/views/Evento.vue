<template>
    <div>
        <NavBar></NavBar>
        <div class="evento">
            <div v-if="spiner" class="flex w-full justify-content-center align-items-center" style="min-height: 100vh;">
                <ProgressSpinner />
            </div>
            <Card v-else>
                <template #content>
                    <TabView>
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
                                <InlineMessage icon="pi pi-verified" severity="success">GRUPO {{ creadores[0].grupo }}
                                </InlineMessage>
                                <div class="flex gap-2">
                                    <Button @click="changeCreador('A')" label="A" severity="success" />
                                    <Button @click="changeCreador('B')" label="B" severity="info" />
                                    <Button @click="changeCreador('C')" label="C" severity="danger" />
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
                        <Column field="diamantes_mes_actual" header="Puntos"></Column>
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
</style>
<script>
import axios from "axios";
export default {
    name: 'EventoView',
    data: () => ({
        API: import.meta.env.VITE_APP_API,
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
    }),
    methods: {
        changeCreador(grupo) {
            for (let i = 0; i < this.arrayCreadores.length; i++) {
                if (this.arrayCreadores[i]._id === grupo) {
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
        await axios.get(`${this.API}/usuario/agrupados`).then((resp) => {
            this.arrayCreadores = resp.data;
            for (let i = 0; i < this.arrayCreadores.length; i++) {
                if (this.arrayCreadores[i]._id === "A") {
                    this.creadores = [];
                    this.creadores = this.arrayCreadores[i].usuarios;
                }
            }
        });
        await axios.get(`${this.API}/usuario/top`).then((resp) => {
            this.arrayTop3 = resp.data;
            for (let i = 0; i < this.arrayTop3.length; i++) {
                if (this.arrayTop3[i].grupo === "A") {
                    this.top3 = [];
                    this.top3 = this.arrayTop3[i].usuarios;
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
        this.spiner = false;
    },
};
</script>
<style scoped>
.evento {
    margin-top: 80px;
}

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