<template>
    <Panel class="creadores">
        <Toast />
        <template #header>
            <div class="flex items-center gap-2 flex-end w-full justify-content-between">
                <h1 class="m-0">Promocion</h1>
                <div class="botones flex gap-2">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filtersCreadores['global'].value" placeholder="Buscar.." />
                    </span>
                    <Button label="Servicios" icon="pi pi-plus" @click="modalServicios = true" />
                </div>
            </div>
        </template>
        <DataTable :value="creadores" :filters="filtersCreadores" sortField="saldo" :sortOrder="-1" paginator :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 100%">
            <Column field="usuario" header="Usuario" sortable></Column>
            <Column field="grupo" header="Grupo" sortable>
                <template #body="slotProps">
                    <Badge v-if="slotProps.data.grupo == 'A'" :value="slotProps.data.grupo" severity="success"></Badge>
                    <Badge v-if="slotProps.data.grupo == 'B'" :value="slotProps.data.grupo" severity="info"></Badge>
                    <Badge v-if="slotProps.data.grupo == 'C'" :value="slotProps.data.grupo" severity="danger"></Badge>
                </template>
            </Column>
            <Column header="Saldo" field="saldo" sortable>
                <template #body="slotProps">
                    <span class="text-xl font-semibold text-700">$ {{ slotProps.data.saldo }}</span>
                </template>
            </Column>
            <Column header="Cambiar">
                <template #body="slotProps">
                    <Button icon="pi pi-money-bill" @click="() => {
                        modalCambiarSaldo = true;
                        actualizarSaldo.id = slotProps.data._id;
                        actualizarSaldo.saldo = slotProps.data.saldo;
                        actualizarSaldo.usuario = slotProps.data.usuario;
                    }"></Button>
                </template>
            </Column>
        </DataTable>
        <Dialog v-model:visible="modalServicios"
            :header="`Servicios Disponibles: ${servicios.length} - Servicios selesccionado: ${selectedServicios.length}`"
            :style="{ width: '80rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true"
            :draggable="false">
            <DataTable :value="servicios" :filters="filters" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
                tableStyle="min-width: 100%">
                <template #header>
                    <div class="flex items-center gap-2 flex-end w-full justify-content-end">
                        <div class="botones flex gap-2">
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar.." />
                            </span>
                            <Button icon="pi pi-trash" label="Vaciar" @click="selectedServicios = []" />
                        </div>
                    </div>
                </template>
                <Column field="service" header="Código" />
                <Column field="name" header="Nombre" />
                <Column field="type" header="Tipo" />
                <Column field="category" header="Categoría" />
                <Column field="rate" header="Costo" />
                <Column field="min" header="Minimo" />
                <Column field="max" header="Maximo" />
                <Column field="dripfeed" header="Dripfeed" />
                <Column field="refill" header="Refill" />
                <Column field="cancel" header="Cancel" />
                <Column header="Agencia">
                    <template #body="slotProps">
                        <Checkbox v-model="selectedServicios" :inputId="slotProps.data.service" name="serviceSelect"
                            :value="slotProps.data" />
                    </template>
                </Column>

            </DataTable>
            <template #footer>
                <Button label="Cancelar" @click="modalServicios = false" text severity="danger" autofocus />
                <Button :icon="btnServiciosIcon" label="Actualizar" @click="actualizarServiciosActive()"
                    :disabled="btnServiciosSelect" severity="success" />
            </template>
        </Dialog>
        <Dialog v-model:visible="modalCambiarSaldo" :header="`Actualizar Saldo: ${actualizarSaldo.usuario}`"
            :style="{ width: '30rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="center" :modal="true"
            :draggable="false">
            <div class="flex flex-column gap-1 mb-2">
                <label for="excel" class="font-bold block">$ Saldo</label>
                <InputText type="number" id="saldo" v-model="actualizarSaldo.saldo" />
                <small id="saldo">Advertencia: Revise bien el saldo</small>
            </div>
            <template #footer>
                <Button label="Cancelar" @click="modalCambiarSaldo = false" text severity="danger" autofocus />
                <Button label="Actualizar" @click="updateSaldo()" :disabled="btnActualizarSaldo" severity="success" />
            </template>
        </Dialog>
    </Panel>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";
import { FilterMatchMode, FilterOperator } from 'primevue/api';

export default {
    data: () => ({
        API: import.meta.env.VITE_APP_API,
        token: null,
        modalServicios: false,
        modalCambiarSaldo: false,
        actualizarSaldo: {
            saldo: null,
            id: null,
            usuario: null,
        },
        btnActualizarSaldo: false,
        servicios: [],
        selectedServicios: [],
        btnServiciosSelect: false,
        btnServiciosIcon: '',
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
        },
        filtersCreadores: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
        },
        creadores: []

    }),
    methods: {
        async getServicios() {
            await axios.get(`${this.API}/promocion/servicesALL`, this.token).then(response => {
                this.servicios = response.data;
            }).catch((error) => {
                switch (error.response.data.statusCode) {
                    case 401:
                        //Se le termino la sesión
                        this.store.clearUser();
                        this.$router.push("/login");
                        break;
                    default:
                        this.$toast.add({
                            severity: "error",
                            summary: "Obtener Servicios de API Promociones",
                            detail: "Sucedió un error, Comuniquese con soporte",
                            life: 1500,
                        });
                        console.log("Error: ", error);
                        break;
                }
            });
        },
        async getServiciosActive() {
            await axios.get(`${this.API}/promocion/servicesActive`, this.token).then((response) => {
                this.selectedServicios = response.data;
            }).catch((error) => {
                switch (error.response.data.statusCode) {
                    case 401:
                        console.log(error);
                        break;
                    default:
                        this.$toast.add({
                            severity: "error",
                            summary: "Obtener servicios Activos",
                            detail: "Sucedió un error, Comuniquese con soporte",
                            life: 1500,
                        });
                        console.log("Error: ", error);
                        break;
                }
            });
        },
        async actualizarServiciosActive() {
            this.btnServiciosIcon = 'pi pi-spin pi-spinner';
            this.btnServiciosSelect = true;
            await axios.post(`${this.API}/promocion/servicesActive`, this.selectedServicios, this.token).then((response) => {
                if (response.data) {
                    this.$toast.add({
                        severity: "success",
                        summary: "Actualizar servicios",
                        detail: "Se actualizo correctamente",
                        life: 1500,
                    });
                } else {
                    this.$toast.add({
                        severity: "error",
                        summary: "Actualizar servicios",
                        detail: "Comuniquese con soporte",
                        life: 1500,
                    });
                }
            }).catch((error) => {
                switch (error.response.data.statusCode) {
                    case 401:
                        console.log(error);
                        break;
                    default:
                        this.$toast.add({
                            severity: "error",
                            summary: "Actualizar servicios",
                            detail: "Sucedió un error, Comuniquese con soporte",
                            life: 1500,
                        });
                        console.log("Error: ", error);
                        break;
                }
            });
            this.btnServiciosIcon = '';
            this.btnServiciosSelect = false;
            this.modalServicios = false;
        },
        async getCreadores() {
            await axios
                .get(`${this.API}/usuario`, this.token)
                .then((response) => {
                    this.creadores = response.data;
                })
                .catch((error) => {
                    switch (error.response.data.statusCode) {
                        case 401:
                            //Se le termino la sesión
                            this.store.clearUser();
                            this.$router.push("/login");
                            break;
                        default:
                            console.log("Error: ", error);
                            break;
                    }
                });
        },
        async updateSaldo() {
            this.btnActualizarSaldo = true;
            await axios.post(`${this.API}/promocion/updateSaldo`, this.actualizarSaldo, this.token).then((response) => {
                if (response.data) {
                    this.$toast.add({
                        severity: "success",
                        summary: "Actualizar saldo",
                        detail: "Se actualizo correctamente",
                        life: 1500,
                    });
                } else {
                    this.$toast.add({
                        severity: "error",
                        summary: "Actualizar saldo",
                        detail: "Comuniquese con soporte",
                        life: 1500,
                    });
                }
            }).catch((error) => {
                switch (error.response.data.statusCode) {
                    case 401:
                        console.log(error);
                        break;
                    default:
                        this.$toast.add({
                            severity: "error",
                            summary: "Actualizar saldo",
                            detail: "Sucedió un error, Comuniquese con soporte",
                            life: 1500,
                        });
                        console.log("Error: ", error);
                        break;
                }
            });
            await this.getCreadores();
            this.btnActualizarSaldo = false;
            this.modalCambiarSaldo = false;
        }
    },
    async created() {
        this.store = useStoreEvento();
        if (!this.store.isActive()) {
            this.$router.push("/login");
        }
        this.token = {
            headers: {
                Authorization: `Bearer ${this.store.getToken()}`,
            },
        }
        await this.getCreadores();
        await this.getServicios();
        await this.getServiciosActive();
    }
}
</script>