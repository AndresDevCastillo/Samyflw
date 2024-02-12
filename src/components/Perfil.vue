<template>
    <Panel class="perfil">
        <template #header>
            <div class="flex items-center gap-2 flex-end w-full justify-content-between">
                <h1 class="m-0">Mi perfil</h1>
                <Button label="Editar perfil" icon="pi pi-user-edit" @click="mostrarEditar = true" />
            </div>
        </template>
        <div class="flex gap-8 w-full sm:flex-wrap xs:flex-wrap xs:justify-content-center md:flex-wrap lg:flex-nowrap sm:justify-content-center">
            <div class="flex align-items-start md:ml-8 md:pl-4 mt-4">
                <div v-if="isTop" class="top">
                    <Avatar :image="`/src/assets/img/cinta_${cinta}.png`" class="w-full cinta" />
                    <p class="text-center w-full m-0 info-grupo"><strong>Grupo {{ store.getUsuario().grupo }}</strong></p>
                    <Clasificacion class="clasificacion" :nombre="store.getUsuario().usuario" :top="infoTop.top" :tipo="infoTop.tipo" :foto="store.getUsuario().foto" />
                </div>
                <div v-else-if="store.getFoto().length > 0" style="width: max-content;">
                    <p class="text-center w-full m-0 font-bold">Grupo {{ store.getUsuario().grupo }}</p>
                    <Avatar :image="store.getFoto()" style="width: 100px; height: 100px;" size="xlarge" shape="circle" />
                    <p class="text-center w-full m-0 font-bold">{{ store.getUsuario().usuario }}</p>
                </div>
                <div v-else class="flex flex-column align-items-center" style="width: max-content;">
                    <p class="text-center w-full m-0 font-bold">Grupo {{ store.getUsuario().grupo }}</p>
                    <Avatar icon="pi pi-user" size="xlarge" shape="circle" />
                    <p class="text-center w-full m-0 font-bold">{{ store.getUsuario().usuario }}</p>
                </div>
            </div>
            <div class="w-full">
                <h2 class="mb-0 sm:text-center xs:text-center">Actualización {{ fechaAct }}</h2>
                <div class="flex gap-8 xs:gap-3 sm:gap-3 md:gap-8 xs:flex-wrap md:justify-content-center">
                    <div class="flex flex-column">
                        <div class="flex justify-content-between flex-wrap column-gap-3 row-gap-2">
                            <div class="seguidores flex flex-column">
                                <span class="w-full word-break">Seguidores</span>
                                <span class="font-bold text-lg">{{ parseInt(store.getUsuario().seguidores).toLocaleString() }}</span>
                            </div>
                            <div class="fans flex flex-column">
                                <span class="w-full word-break">Fans nuevos {{ meses[iActual] }}</span>
                                <span :class="'font-bold text-lg ' + (parseInt(store.getUsuario().new_fans_mes_actual) > parseInt(store.getUsuario().new_fans_mes_anterior) ? 'text-green-500' : 'text-red-500')">{{ parseInt(store.getUsuario().new_fans_mes_actual).toLocaleString() }}</span>
                                <span class="text-sm">En {{ meses[iAnterior] }}: <span class="font-bold text-sm">{{ parseInt(store.getUsuario().new_fans_mes_anterior).toLocaleString() }}</span>
                                    <img :src="subioBajo(store.getUsuario().new_fans_mes_actual, store.getUsuario().new_fans_mes_anterior)" class="svg" />
                                </span>
                            </div>
                        </div>
                        <div class="flex justify-content-between column-gap-3 row-gap-2 mt-4 flex-wrap">
                            <div class="diamante-actual flex flex-column">
                                <span class="w-full word-break">Diamantes en {{ meses[iActual] }} 💎</span>
                                <span class="font-bold text-lg">{{ parseInt(store.getUsuario().diamantes_mes_actual).toLocaleString() }}
                                    <span :class="'ml-1 text-sm ' + porcentaje(store.getUsuario().porcentaje_achieved)">{{ store.getUsuario().porcentaje_achieved }}
                                        <img :src="subioBajo(store.getUsuario().diamantes_mes_actual, store.getUsuario().diamantes_mes_anterior)" class="svg" />
                                    </span>
                                </span>
                            </div>
                            <div class="diamante-anterior flex flex-column">
                                <span class="w-full word-break">Diamantes en {{ meses[iAnterior] }} 💎</span>
                                <span class="font-bold text-lg">{{ parseInt(store.getUsuario().diamantes_mes_anterior).toLocaleString() }}</span>
                            </div>
                        </div>
                        <div class="flex justify-content-between column-gap-3 row-gap-2 mt-3 flex-wrap">
                            <div class="live flex flex-column">
                                <span class="w-full word-break flex gap-2 flex-wrap">Duración LIVE en {{ meses[iActual] }} <img src="../assets/img/live.png" alt="live" srcset="../assets/img/live.png"></span>
                                <span class="font-bold text-lg">{{ formatHoras(store.getUsuario().last_live_duration_mes_actual) }}</span>
                                <span>En {{ meses[iAnterior] }}: <span class="font-bold"> {{ formatHoras(store.getUsuario().last_live_duration_mes_anterior) }}</span>
                                    <span :class="'ml-1 text-sm font-bold ' + porcentaje(store.getUsuario().porcentaje_achieved_2)">{{ store.getUsuario().porcentaje_achieved_2 }}
                                        <img :src="subioBajo(store.getUsuario().last_live_duration_mes_actual, store.getUsuario().last_live_duration_mes_anterior)" class="svg" />
                                    </span>
                                </span>
                            </div>
                            <div class="last_live flex flex-column">
                                <span class="w-full word-break flex gap-2 align-items-center">Último LIVE <img src="../assets/img/last_hour.svg" srcset="../assets/img/last_hour.svg"></span>
                                <span class="font-bold text-lg">{{ store.getUsuario().last_live.slice(0, 19) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="row flex align-items-center flex-column  gap-3 flex-wrap">
                        <div class="incorporacion flex flex-column">
                            <span class="w-full word-break">Días de incorporación</span>
                            <span class="font-bold text-lg">{{ store.getUsuario().dias_since_joining_agency.slice(0, (store.getUsuario().dias_since_joining_agency.length) - 1) + (parseInt(store.getUsuario().dias_since_joining_agency.slice(0, (store.getUsuario().dias_since_joining_agency.length) - 1)) == 1 ? ' día' : ' días') }}</span>
                        </div>
                        <div class="fecha_incorporacion flex flex-column md:mt-2 xl:mt-5">
                            <span class="w-full word-break">Fecha de incorporación</span>
                            <span class="font-bold text-lg">{{ store.getUsuario().joined_time.slice(0, 10) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <dialogEditarPerfil :mostrarEditar="mostrarEditar" @dialogEditarOculto="mostrarEditar = false"
            @perfilActualizado="getNewDatos" />
    </Panel>
</template>
<script>
import axios from 'axios';
import { useStoreEvento } from '../store'
import dialogEditarPerfil from './EditarPerfil.vue';
export default {
    name: 'PerfilUsuario',
    components: {
        dialogEditarPerfil,
    },
    data: () => ({
        store: null,
        API: import.meta.env.VITE_APP_API,
        mostrarEditar: false,
        isTop: false,
        infoTop: {
            top: null,
            tipo: 'Cobre'
        },
        cinta: 'cobre',
        fechaAct: null,
        meses: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        iActual: 0,
        iAnterior: 11
    }),
    methods: {
        async getTop() {
            axios.get(`${this.API}/usuario/top`).then(response => {
                response.data.forEach((top, index) => {
                    const i = top.usuarios.findIndex(usuario => usuario._id == this.store.getId());
                    if (i != -1) {
                        top.usuarios.sort((us1, us2) => us2.diamantes_mes_anterior - us1.diamantes_mes_anterior);
                        //Top 1 - Oro

                        if (top.usuarios[0]._id == this.store.getId()) {
                            this.infoTop.tipo = 'Oro';
                            this.infoTop.top = '1';
                            this.cinta = 'oro';
                        } else if (top.usuarios[1]._id == this.store.getId()) {
                            //Top 2 - Platino
                            this.infoTop.tipo = 'Platino';
                            this.infoTop.top = '2';
                            this.cinta = 'platino';
                        } else {
                            //Top 3 - Cobre
                            this.infoTop.tipo = 'Cobre';
                            this.infoTop.top = '3';
                            this.cinta = 'cobre';
                        }
                        this.isTop = true;
                        return;
                    }
                });

            });
        },
        porcentaje(porc) {
            const c = porc.slice(0, porc.length - 1);
            const nFloat = parseFloat(c);
            return nFloat > 100 ? 'text-green-500' : 'text-red-500';
        },
        formatHoras(tiempo) {
            const regex = /(\d+)h(\d+)m(\d+)s/;

            const format = tiempo.replace(regex, (match, horas, minutos, segundos) => {
                horas = horas === '0' ? '' : horas + 'h';
                minutos = minutos === '0' ? '' : minutos + 'min';
                segundos = segundos === '0' ? '' : segundos + 's';

                return `${horas} ${minutos} ${segundos}`;
            });

            return format;
        },
        getSegundos(tiempo) {
            const regex = /(\d+)h(\d+)m(\d+)s/;
            const segundos = tiempo.replace(regex, (match, horas, minutos, segundos) => {
                return `${(parseInt(horas) * 60 * 60) + (parseInt(minutos) * 60) + (parseInt(segundos))}`;
            });
            return segundos;
        },
        mayorTiempo(actual, anterior) {
            return this.subioBajo(this.getSegundos(actual), this.getSegundos(anterior));
        },
        subioBajo(actual, anterior) {
            return parseInt(actual) > parseInt(anterior) ? '/src/assets/img/up_arrow.svg' : '/src/assets/img/down_arrow.svg';
        },
        async getNewDatos() {
            await axios.get(`${this.API}/usuario/${this.store.getId()}`, {
                headers: {
                    Authorization: `Bearer ${this.store.getToken()}`,
                }
            }).then(response => {
                this.store.newDatos(response.data);
            });
        },
    },
    created() {
        this.store = useStoreEvento();
        const f = new Date(this.store.getUsuario().fecha_actualizacion);
        this.fechaAct = `${(f.getDate() < 10 ? '0' : '') + f.getDate()} ${this.meses[f.getMonth()]} ${this.store.getUsuario().fecha_actualizacion.slice(11, 16)}`;

        this.iActual = new Date().getMonth();
        this.iAnterior = this.iActual == 0 ? 11 : (this.iActual - 1);
        this.getTop();
    }
}
</script>
<style scoped>
.cinta {
    height: 100px !important;
}

.info-grupo {
    transform: translateY(-80px);
}

.clasificacion {
    transform: translateY(-100px);
}

.svg {
    width: 24px !important;
    height: 14px !important;
}

.bajo {
    color: red !important;
}
</style>
<style>
@media screen and (min-width:576px) and (max-width: 768px) {

    .clasificacion,
    .top {
        height: 270px !important;
    }
}

@media screen and (min-width: 768px) {

    .clasificacion,
    .top {
        height: 270px !important;
    }
}

@media screen and (max-width: 575px) {

    .clasificacion,
    .top {
        height: 270px !important;
    }

    .xs\:flex-column {
        flex-direction: column !important;
    }

    .xs\:flex-wrap {
        flex-wrap: wrap !important;
    }

    .xs\:text-center {
        text-align: center !important;
    }

    .xs\:justify-content-center {
        justify-content: center !important;
    }

    .xs\:gap-3 {
        gap: 3rem !important;
    }
}
</style>