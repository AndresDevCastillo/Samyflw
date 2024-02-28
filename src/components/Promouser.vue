<template>
    <div class="promo">
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
                <div class="form" style="width: 30rem;">
                    <div class="flex flex-column gap-1 mb-2">
                        <label class="font-bold block">Servicios</label>

                    </div>
                    {{ serviciosActivos }}
                    <div class="flex flex-column gap-1 mb-2">
                        <label class="font-bold block">$ Saldo</label>
                        <InputText type="number" id="saldo" />
                        <small id="saldo">Advertencia: Revise bien el saldo</small>
                    </div>
                </div>
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
        serviciosActivos: [],
        paquetePromocion: {
            servicio: null
        }
    }),
    methods: {
        search(event) {
            this.serviciosActivos.value = [...Array(10).keys()].map((item) => event.query + '-' + item);
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
        this.User._id = this.store.getId();
        await this.getUserInfo();
        await this.getServiciosActive();
    }
}
</script>
