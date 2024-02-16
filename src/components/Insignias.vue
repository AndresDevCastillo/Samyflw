<template>
    <div class="Insignias">
        <Dialog v-model:visible="mostrarInsignias" @hide="dialogOculto()">
            <Carousel :value="insignias" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions">
                <template #item="slotProps">
                    <div class="border-1 surface-border border-round m-2  p-3">
                        <div class="mb-3">
                            <div class="relative">
                                <img width="100%" :src="slotProps.data.secure_url" alt="Insignia"
                                    class="border-round imgInsignias" />
                                <Tag value="Insignia" class="absolute" style="left:5px; top: 5px" />
                            </div>
                        </div>
                        <div class="flex justify-content-center align-items-center">
                            <Button icon="pi pi-trash" severity="secondary" outlined />
                        </div>
                    </div>
                </template>
            </Carousel>
        </Dialog>
    </div>
</template>
<script>
import axios from 'axios';
import { useStoreEvento } from '../store';

export default {
    props: ['mostrarInsigniasProp'],
    data: () => ({
        API: import.meta.env.VITE_APP_API,
        mostrarInsignias: false,
        store: null,
        token: null,
        insignias: null,
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

    }),
    watch: {
        mostrarInsigniasProp(newV, old) {
            this.mostrarInsignias = newV;
            this.getInsignias();
        }
    },
    methods: {
        dialogOculto() {
            this.$emit('dialogOculto');
        },
        async getInsignias() {
            axios.get(`${this.API}/usuario/insigniasCloud`, this.token).then(resp => {
                this.insignias = resp.data;
            })
        }
    },

    async created() {
        this.store = useStoreEvento();
        this.token = {
            headers: {
                Authorization: `Bearer ${this.store.getToken()}`,
            }
        }
        await this.getInsignias()

    }
}
</script>
<style scoped>
.imgInsignias {
    height: 300px;
}

@media (max-width: 739px) {

    .imgInsignias {
        height: 200px;
    }
}
</style>