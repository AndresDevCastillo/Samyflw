<template>
    <div>
        <div v-if="false">
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
                    <!--  <div class="containerC">
              <Clasificacion :nombre="top3[1].usuario" top="2" tipo="Platino" :foto="top3[1].foto" />
              <Clasificacion top="1" tipo="Oro" :nombre="top3[0].usuario" :foto="top3[0].foto" />
              <Clasificacion :nombre="top3[2].usuario" top="3" tipo="Cobre" :foto="top3[2].foto" />
            </div> -->
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
</template>
<script>
import axios from "axios";
export default {
    data: () => ({
        API: import.meta.env.VITE_APP_API,
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
    },
};
</script>