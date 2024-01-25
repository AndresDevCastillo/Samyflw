<template>
    <div class="admin">
        <h1>Admin</h1>

        <DataTable paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]" :value="data" dataKey="_id" filterDisplay="row"
            v-model:filters="filters" tableStyle="min-width: 60rem" sortField="coinTotal" :sortOrder="-1" stripedRows
            :expandedRows="[1]" :globalFilterFields="['name']">
            <template #header>
                <div class="flex justify-content-end">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                    </span>
                </div>
            </template>
            <Column expander style="width: 5rem" />
            <Column field="name" header="Nombre"></Column>
            <Column field="coinTotal" header="Monedas"></Column>
            <Column field="gameTotal" header="Partidas"></Column>
            <Column field="timeTotal" header="Tiempo jugado">
                <template #body="slotProps">
                    {{ convertirMilisegundos(slotProps.data.timeTotal) }}
                </template>
            </Column>
            <Column field="jugadoresMax" header="Max. Jugadores"></Column>
            <template #expansion="slotProps">
                <div class="p-3">
                    <DataTable :value="slotProps.data.history">
                        <Column field="date" header="Fecha">
                            <template #body="slotProps">
                                {{ parsearFecha(slotProps.data.date) }}
                            </template>
                        </Column>
                        <Column field="coinTotal" header="Monedas"></Column>
                        <Column field="timeTotal" header="Tiempo Jugado">
                            <template #body="slotProps">
                                {{ convertirMilisegundos(slotProps.data.timeTotal) }}
                            </template>
                        </Column>
                        <Column field="playerTotal" header="N° Jugadores"></Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
    </div>
</template>
<script>
import { useSessionStore } from '../store';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
export default {
    components: {
        DataTable,
        Column,
        InputText
    },
    data: () => ({
        data: [
            {
                "_id": "65b1856bffa6a535e8e33f17",
                "name": "susanita_1964",
                "coinTotal": 0,
                "active": true,
                "timeTotal": 0,
                "gameTotal": 0,
                "jugadoresMax": 0,
                "history": [],
                "__v": 0
            },
            {
                "_id": "65b1857fffa6a535e8e33f19",
                "name": "onoquevihotmail.com",
                "coinTotal": 0,
                "active": true,
                "timeTotal": 0,
                "gameTotal": 0,
                "jugadoresMax": 0,
                "history": [],
                "__v": 0
            },
            {
                "_id": "65b18586ffa6a535e8e33f1b",
                "name": "ridddleess",
                "coinTotal": 0,
                "active": true,
                "timeTotal": 0,
                "gameTotal": 0,
                "jugadoresMax": 0,
                "history": [],
                "__v": 0
            },
            {
                "_id": "65b1858cffa6a535e8e33f1d",
                "name": "jomenboy1",
                "coinTotal": 0,
                "active": true,
                "timeTotal": 0,
                "gameTotal": 0,
                "jugadoresMax": 0,
                "history": [],
                "__v": 0
            },
            {
                "_id": "65b18592ffa6a535e8e33f1f",
                "name": "dalixmar2",
                "coinTotal": 0,
                "active": true,
                "timeTotal": 0,
                "gameTotal": 0,
                "jugadoresMax": 0,
                "history": [],
                "__v": 0
            },
            {
                "_id": "65b18599ffa6a535e8e33f21",
                "name": "morenoyuder2508",
                "coinTotal": 0,
                "active": true,
                "timeTotal": 0,
                "gameTotal": 0,
                "jugadoresMax": 0,
                "history": [],
                "__v": 0
            },
            {
                "_id": "65b1859fffa6a535e8e33f23",
                "name": "kary_urdaneta",
                "coinTotal": 0,
                "active": true,
                "timeTotal": 0,
                "gameTotal": 0,
                "jugadoresMax": 0,
                "history": [],
                "__v": 0
            },
            {
                "_id": "65b185a4ffa6a535e8e33f25",
                "name": "isabelyelkar",
                "coinTotal": 0,
                "active": true,
                "timeTotal": 0,
                "gameTotal": 0,
                "jugadoresMax": 0,
                "history": [],
                "__v": 0
            },
            {
                "_id": "65b1c6e6e49cdb7b5acdd913",
                "name": "shatsosky",
                "coinTotal": 0,
                "active": true,
                "timeTotal": 0,
                "gameTotal": 0,
                "jugadoresMax": 0,
                "history": [
                    {
                        "date": "2024-01-25T02:30:45.941Z",
                        "playerTotal": 0,
                        "coinTotal": 0,
                        "timeTotal": "10000"
                    }
                ],
                "__v": 1
            },
            {
                "_id": "65b1d09e9d5562fa0e6490b8",
                "name": "king_sylvester02",
                "coinTotal": 0,
                "active": true,
                "timeTotal": 0,
                "gameTotal": 0,
                "jugadoresMax": 0,
                "history": [
                    {
                        "date": "2024-01-25T03:13:20.221Z",
                        "playerTotal": 28,
                        "coinTotal": 0,
                        "timeTotal": "10000"
                    },
                    {
                        "date": "2024-01-25T03:09:05.966Z",
                        "playerTotal": 37,
                        "coinTotal": 3,
                        "timeTotal": "10000"
                    }
                ],
                "__v": 2
            },
            {
                "_id": "65b1d3db82f36368d2755e1a",
                "name": "fahddxb80",
                "coinTotal": 37,
                "active": true,
                "timeTotal": 50000,
                "gameTotal": 5,
                "jugadoresMax": 58,
                "history": [
                    {
                        "date": "2024-01-25T03:35:16.785Z",
                        "playerTotal": 55,
                        "coinTotal": 14,
                        "timeTotal": "10000"
                    },
                    {
                        "date": "2024-01-25T03:33:37.394Z",
                        "playerTotal": 52,
                        "coinTotal": 1,
                        "timeTotal": "10000"
                    },
                    {
                        "date": "2024-01-25T03:31:16.514Z",
                        "playerTotal": 58,
                        "coinTotal": 6,
                        "timeTotal": "10000"
                    },
                    {
                        "date": "2024-01-25T03:24:21.958Z",
                        "playerTotal": 58,
                        "coinTotal": 6,
                        "timeTotal": "10000"
                    },
                    {
                        "date": "2024-01-25T03:22:34.432Z",
                        "playerTotal": 52,
                        "coinTotal": 10,
                        "timeTotal": "10000"
                    }
                ],
                "__v": 5
            }
        ],
        store: null,
        user: null,
        filters: null
    }),
    created() {
        this.store = useSessionStore();
        if (!this.store.isActive()) {
            this.$router.push('/login');
        }
    },
    methods: {
        convertirMilisegundos(milisegundos) {
            // Calcula los segundos, minutos, horas y días
            let segundos = Math.floor(milisegundos / 1000);
            let minutos = Math.floor(segundos / 60);
            let horas = Math.floor(minutos / 60);
            let dias = Math.floor(horas / 24);

            // Ajusta las cantidades para obtener los valores individuales
            segundos %= 60;
            minutos %= 60;
            horas %= 24;

            // Construye la cadena de resultado

            if (dias != 0) {
                return `${dias} días, ${horas} horas, ${minutos} minutos, ${segundos} segundos`;
            }
            if (horas != 0) {
                return `${horas} horas, ${minutos} minutos, ${segundos} segundos`;
            }
            if (minutos != 0) {
                return `${minutos} minutos, ${segundos} segundos`;
            }
            if (segundos != 0) {
                return `${segundos} segundos`;
            }
            else {
                return "No Disponible";
            }


        },
        parsearFecha(fechaString) {
            const fecha = new Date(fechaString);
            return fecha.toLocaleString("es-CO", { timeZone: "America/Bogota" });
        }

    }
}
</script>