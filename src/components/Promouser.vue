<template>
    <div class="promo">
        <Toast />
        <Panel>
            <template #header>
                <div class="flex items-center gap-2 flex-end w-full justify-content-between">
                    <h1 class="m-0">Promocion</h1>
                    <div class="botones flex gap-2">
                        <Button :label="`Saldo: $${User.saldo}`" />
                    </div>
                </div>
            </template>
            <div class="flex justify-content-center">
                <form ref="formServicio" style="width: 30rem;">
                    <div class="form-container">
                        <div class="flex flex-column gap-1 mb-2">
                            <label class="font-bold block">Servicios</label>
                            <Dropdown v-model="servicioSelect" showClear :options="serviciosActivos" filter optionLabel="name" @update:modelValue="selectServicio" placeholder="Selecciona servicio">
                                <template #option="slotProps">
                                    <div class="flex align-items-center">
                                        <div>{{ slotProps.option.name }}</div>
                                    </div>
                                </template>
                            </Dropdown>
                        </div>
                        <div class="flex flex-column gap-1 mb-2">
                            <label class="font-bold block">Cantidad</label>
                            <InputText type="number" v-model="paquetePromocion.cantidad" :min="min" :max="max" @update:modelValue="calcularPago" aria-describedby="cantidad-help" />
                            <small id="cantidad-help">{{ help_cantidad }}</small>
                        </div>
                        <div class="flex flex-column gap-1 mb-2">
                            <label class="font-bold block">Link</label>
                            <InputText type="url" v-model="paquetePromocion.link" aria-describedby="url-help" />
                            <small id="url-help">Del perfil o publicación a aumentar reacciones o seguidores</small>
                        </div>
                        <div class="flex flex-column gap-1 mb-2">
                            <label class="font-bold block">$ Pagar</label>
                            <InputText type="number" id="saldo" disabled v-model="paquetePromocion.pagar" />
                            <small id="saldo">Advertencia: Revise bien el saldo, se descontará de tu saldo</small>
                        </div>
                        <div class="flex justify-content-center">
                            <Button label="Ordenar" :disabled="btnOrden" @click="ordenar" />
                        </div>
                    </div>
                </form>
            </div>
        </Panel>
    </div>
</template>
<script>
import axios from 'axios';
import { useStoreEvento } from "../store";

export default {
    data: () => ({
        API: import.meta.env.VITE_APP_API,
        User: {
            saldo: '',
            _id: null
        },
        token: null,
        btnOrden: false,
        servicioSelect: null,
        precioRate: 0,
        min: 1,
        max: 2,
        serviciosActivos: [],
        paquetePromocion: {
            service: null,
            cantidad: null,
            link: null,
            pagar: 0,
            idUsuario: null
        },
        help_cantidad: 'Cantidad del servicio.'
    }),
    methods: {
        selectServicio(event) {
            this.help_cantidad = `Puedes ordenar entre ${event.min} y ${event.max}`;
            this.paquetePromocion.service = event.service;
            this.min = parseInt(event.min);
            this.max = parseInt(event.max);
            this.precioRate = (parseFloat(event.rate) / 1000);
        },
        calcularPago() {
            this.paquetePromocion.pagar = this.paquetePromocion.cantidad * this.precioRate;
        },
        async getServiciosActive() {
            await axios.get(`${this.API}/promocion/servicesActive`, this.token).then((response) => {
                this.serviciosActivos = response.data;
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
        async getUserInfo() {
            await axios.get(`${this.API}/usuario/${this.User._id}`, this.token).then(response => {
                this.User = response.data;
            }).catch((error) => {
                switch (error.response.data.statusCode) {
                    case 401:
                        console.log(error);
                        break;
                    default:
                        this.$toast.add({
                            severity: "error",
                            summary: "Obtener usuario",
                            detail: "Sucedió un error, Comuniquese con soporte",
                            life: 1500,
                        });
                        console.log("Error: ", error);
                        break;
                }
            });
        },
        async ordenar() {
            if (this.paquetePromocion.service != null) {
                this.paquetePromocion.cantidad = parseInt(this.paquetePromocion.cantidad);
                if (this.paquetePromocion.cantidad >= this.min && this.paquetePromocion.cantidad <= this.max) {
                    this.paquetePromocion.pagar = parseFloat(this.paquetePromocion.pagar);
                    if (parseFloat(this.User.saldo) >= this.paquetePromocion.pagar) {
                        if (this.paquetePromocion.link != null) {
                            this.btnOrden = true;
                            await axios.post(`${this.API}/promocion/ordenar`, this.paquetePromocion, this.token).then(response => {
                                console.log(response);
                                if (response.data) {
                                    this.$toast.add({ severity: 'success', summary: 'Ordenar', detail: 'Orden creada con éxito', life: 1500 });
                                    this.servicioSelect = null;
                                    this.$refs.formServicio.reset();
                                    this.getUserInfo();
                                    this.getServiciosActive();
                                } else {
                                    this.$toast.add({ severity: 'error', summary: 'Ordenar', detail: 'No se pudo crear la orden', life: 1500 });
                                }
                            }).catch(error => {
                                console.log('Error orden; ', error);
                                this.$toast.add({ severity: 'error', summary: 'Ordenar', detail: 'Ocurrió un problema creando la orden', life: 1500 });
                            });
                            this.btnOrden = false;
                        } else {
                            this.$toast.add({ severity: 'info', summary: 'Ordenar', detail: 'Ingresa el link de la publicación o perfil', life: 1500 });
                        }
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Ordenar', detail: 'No tienes suficiente saldo', life: 1500 });
                    }
                } else {
                    this.$toast.add({ severity: 'info', summary: 'Ordenar', detail: `La cantidad debe estar entre ${this.min} y ${this.max}`, life: 1500 });
                }
            } else {
                this.$toast.add({ severity: 'info', summary: 'Ordenar', detail: 'Debes escoger un servicio', life: 1500 });
            }
        },
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
        this.User._id = this.store.getId();
        this.paquetePromocion.idUsuario = this.store.getId();
        await this.getUserInfo();
        await this.getServiciosActive();
    }
}
</script>
