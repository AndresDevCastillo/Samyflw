<template>
    <Panel class="Bonus">
        <template #header>
            <div class="flex items-center gap-2 flex-end w-full justify-content-between">
                <h1 class="m-0">Bonus</h1>
            </div>
        </template>
        <DataTable :value="tablaBonus" tableStyle="min-width: 100%">
            <Column field="nivel" header="Nivel 👑"></Column>
            <Column field="dias" header="Dias">
                <template #body="slotProps">
                    <Knob v-model="estadisticas.dias" :valueTemplate="slotProps.data.dias.toString()" readonly
                        :max="validarKnob(estadisticas.dias, slotProps.data.dias)" :size="70" />
                </template>
            </Column>
            <Column field="horas" header="Horas">
                <template #body="slotProps">
                    <Knob v-model="estadisticas.horas" :valueTemplate="slotProps.data.horas.toString()" readonly
                        :max="validarKnob(estadisticas.horas, slotProps.data.horas)" :size="70" />
                </template>
            </Column>
            <Column field="meta" header="Diamantes">
                <template #body="slotProps">
                    {{ slotProps.data.meta.toLocaleString() }}
                    <ProgressBar :value="calcularProgresoDiamantes(slotProps.data.meta, estadisticas.diamantes)">
                    </ProgressBar>
                </template>
            </Column>
            <Column field="ganancia" header="Ganancia"></Column>
            <Column field="bonificacion" header="Bonificacion"></Column>
            <Column header="Estado">
                <template #body="slotProps">
                    <Badge
                        v-if="estadisticas.dias >= slotProps.data.dias && estadisticas.horas >= slotProps.data.horas && estadisticas.diamantes >= slotProps.data.meta"
                        value="Aplica" />
                    <Badge v-else value="No Aplica" severity="danger" />
                </template>
            </Column>

        </DataTable>
    </Panel>
</template>
<script>
import axios from 'axios';
import { useStoreEvento } from '../store';
export default {
    data() {
        return {
            API: import.meta.env.VITE_APP_API,
            store: null,
            tablaBonus: [
                {
                    "nivel": 1,
                    "dias": 20,
                    "horas": 60,
                    "meta": 10000,
                    "ganancia": "50USD",
                    "bonificacion": "3USD"
                },
                {
                    "nivel": 2,
                    "dias": 20,
                    "horas": 60,
                    "meta": 30000,
                    "ganancia": "75USD",
                    "bonificacion": "5USD"
                },
                {
                    "nivel": 3,
                    "dias": 20,
                    "horas": 60,
                    "meta": 60000,
                    "ganancia": "250USD",
                    "bonificacion": "7USD"
                },
                {
                    "nivel": 4,
                    "dias": 20,
                    "horas": 80,
                    "meta": 100000,
                    "ganancia": "500USD",
                    "bonificacion": "10USD"
                },
                {
                    "nivel": 5,
                    "dias": 20,
                    "horas": 80,
                    "meta": 200000,
                    "ganancia": "1000USD",
                    "bonificacion": "15USD"
                },
                {
                    "nivel": 6,
                    "dias": 20,
                    "horas": 100,
                    "meta": 300000,
                    "ganancia": "1500USD",
                    "bonificacion": "20USD"
                },
                {
                    "nivel": 7,
                    "dias": 20,
                    "horas": 100,
                    "meta": 400000,
                    "ganancia": "2000USD",
                    "bonificacion": "30USD"
                },
                {
                    "nivel": 8,
                    "dias": 20,
                    "horas": 100,
                    "meta": 500000,
                    "ganancia": "2500USD",
                    "bonificacion": "80USD"
                },
                {
                    "nivel": 9,
                    "dias": 20,
                    "horas": 100,
                    "meta": 1000000,
                    "ganancia": "5000USD",
                    "bonificacion": "200USD"
                },
                {
                    "nivel": 10,
                    "dias": 20,
                    "horas": 100,
                    "meta": 1500000,
                    "ganancia": "7500USD",
                    "bonificacion": "300USD"
                },
                {
                    "nivel": 11,
                    "dias": 20,
                    "horas": 100,
                    "meta": 2000000,
                    "ganancia": "10.000USD",
                    "bonificacion": "400USD"
                },
                {
                    "nivel": 12,
                    "dias": 20,
                    "horas": 100,
                    "meta": 5000000,
                    "ganancia": "25.000USD",
                    "bonificacion": "800USD"
                }
            ],
            usuario: null,
            estadisticas: {
                dias: null,
                diamantes: null,
                horas: null
            }
        }
    },
    methods: {
        calcularProgresoDiamantes(meta, diamantes) {
            const progreso = Math.floor(((100 / meta) * diamantes));
            if (progreso >= 100) {
                return 100;
            }
            return progreso;
        },
        validarKnob(n1, n2) {
            if (n1 >= n2) {
                return n1;
            }
            return n2;
        }
    },
    async created() {
        this.store = useStoreEvento();
        this.usuario = this.store.getUsuario();
        this.estadisticas.dias = parseInt(this.usuario.dias_validos_mes_actual);
        this.estadisticas.horas = parseInt(this.usuario.last_live_duration_mes_actual.split('h')[0]);
        this.estadisticas.diamantes = parseInt(this.usuario.diamantes_mes_actual);
    }
}
</script>