<template>
    <div>
        <Toast />
        <div class="usuario" v-if="!admin">
            <PerfilUsuario />
            <Panel class="Bonus">
                <template #header>
                    <div class="flex items-center gap-2 flex-end w-full justify-content-center">
                        <img src="/assets/img/perfil/iconos/bonus.png" height="170px" alt="Bonus">
                        <!-- <h1 class="m-0">Bonus</h1> -->
                    </div>
                </template>
                <DataTable class="bonus-usuario" :value="tablaBonus" tableStyle="min-width: 100%">
                    <Column field="nivel" header="Nivel 👑" class="font-gamers">
                        <template #body="slotProps">
                            {{ slotProps.data.exclusivo ? 'Exclusivo' : slotProps.data.nivel }}
                        </template>
                    </Column>
                    <Column field="dias" header="Dias" class="font-gamers">
                        <template #body="slotProps">
                            <Knob :valueColor="validarCompletoColor(estadisticas.dias, slotProps.data.dias)"
                                v-model="estadisticas.dias" :valueTemplate="slotProps.data.dias.toString()" readonly
                                :max="validarKnob(estadisticas.dias, slotProps.data.dias)" :size="70" />
                        </template>
                    </Column>
                    <Column field="horas" header="Horas" class="font-gamers">
                        <template #body="props">
                            <Knob :valueColor="validarCompletoColor(estadisticas.horas, props.data.horas)"
                                v-model="estadisticas.horas" :valueTemplate="props.data.horas.toString()" readonly
                                :max="validarKnob(estadisticas.horas, props.data.horas)" :size="70" />
                        </template>
                    </Column>
                    <Column field="meta" header="Diamantes" headerStyle="width: 19rem;" class="font-gamers">
                        <template #body="props">
                            {{ props.data.meta == 0 ? '' : props.data.meta.toLocaleString() }}
                            <!--<ProgressBar v-if="props.data.meta > 0" :pt="validarCompletoColorBar(props.data.meta, estadisticas.diamantes)"
                                :value="calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0]">
                            </ProgressBar>
                            <ProgressBar v-else :pt="validarCompletoColorBar(props.data.meta, estadisticas.diamantes)"
                                :value="100">
                            </ProgressBar>-->
                            <div class="container flex flex-column gap-2">
                                <div class="barra-progreso-horas text-center">
                                    <div class="diamante" v-if="calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] == 100" />
                                    <div :class="'progreso static ' + calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[1]" :style="{ 'width': calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] + '%' }" />
                                    <p class="m-0 w-full">{{ calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] }}%</p>
                                </div>
                            </div>
                        </template>
                    </Column>
                    <Column field="ganancia" header="Ganancia" class="font-gamers" />
                    <Column field="bonificacion" header="Bonificacion" class="font-gamers" />
                    <Column header="Estado" class="font-gamers">
                        <template #body="slotProps">
                            <!--<Badge
                                v-if="estadisticas.dias >= slotProps.data.dias && estadisticas.horas >= slotProps.data.horas && estadisticas.diamantes >= slotProps.data.meta"
                                value="Aplica" />
                            <Badge v-else value="No Aplica" severity="danger" />-->
                            <div class="aplica color-verde" v-if="estadisticas.dias >= slotProps.data.dias && estadisticas.horas >= slotProps.data.horas && estadisticas.diamantes >= slotProps.data.meta">Aplica</div>
                            <div class="aplica color-rojo" v-else>No aplica</div>
                        </template>
                    </Column>

                </DataTable>
            </Panel>
        </div>
        <Panel class="Bonus" v-else>
            <template #header>
                <div class="flex items-center gap-2 flex-end w-full justify-content-between">
                    <h1 class="m-0">Bonus</h1>
                    <div class="flex gap-4">
                        <Button icon="pi pi-percentage" :label="'Multiplicador x' + multiplicador"
                            @click="modalMultiplicador = true" />
                        <Button icon="pi pi-plus" label="Añadir" @click="modalBonus = true"></Button>
                    </div>
                </div>
            </template>
            <DataTable :value="tablaBonus" tableStyle="min-width: 100%" sortField="nivel" :sortOrder="1">
                <Column field="nivel" header="Nivel 👑">
                    <template #body="slotProps">
                        {{ slotProps.data.exclusivo ? 'Exclusivo' : slotProps.data.nivel }}
                    </template>
                </Column>
                <Column field="dias" header="Dias"></Column>
                <Column field="horas" header="Horas"> </Column>
                <Column field="meta" header="Diamantes">
                    <template #body="slotProps">
                        {{ slotProps.data.meta == 0 ? 'X' : slotProps.data.meta }}
                    </template>
                </Column>
                <Column field="ganancia" header="Ganancia"></Column>
                <Column field="bonificacion" header="Bonificacion"></Column>
                <Column style="max-width:5rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="comfirmDelete(slotProps.data._id, slotProps.data.nivel)" />
                    </template>
                </Column>

            </DataTable>
        </Panel>
        <Dialog v-model:visible="modalBonus" header="Crear Bonus" :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">
            <form ref="formBonus">
                <div class="flex gap-1 mb-2">
                    <Checkbox v-model="paqueteBonus.exclusivo" inputId="exclusivo" name="exclusivo" value="exclusivo" :binary="true" />
                    <label for="exclusivo">Exclusivo</label>
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <label for="nivel" class="font-bold block">Nivel</label>
                    <InputText v-model="paqueteBonus.nivel" type="text" id="nivel" />
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <label for="dias" class="font-bold block">Días</label>
                    <InputText v-model="paqueteBonus.dias" type="number" id="dias" />
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <label for="horas" class="font-bold block">Horas</label>
                    <InputText v-model="paqueteBonus.horas" type="number" id="horas" />
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <label for="meta" class="font-bold block">Diamantes - Meta</label>
                    <InputText v-model="paqueteBonus.meta" type="number" id="meta" />
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <label for="ganancia" class="font-bold block">Ganancia</label>
                    <InputText v-model="paqueteBonus.ganancia" type="text" id="ganancia" />
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <label for="bonificacion" class="font-bold block">Bonificación</label>
                    <InputText v-model="paqueteBonus.bonificacion" type="text" id="bonificacion" />
                </div>
            </form>
            <template #footer>
                <Button label="Cancelar" @click="modalBonus = false" severity="danger" />
                <Button label="Crear" @click="crearBonus()" :disabled="btnBonus" severity="success" />
            </template>
        </Dialog>
        <Dialog v-model:visible="modalMultiplicador" header="Multiplicador" :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">
            <form ref="formBonus">
                <div class="flex flex-column gap-1 mb-2">
                    <label for="nivel" class="font-bold block">Multiplicador</label>
                    <InputText v-model="multiplicador" type="number" id="nivel" />
                </div>

            </form>
            <template #footer>
                <Button label="Cancelar" @click="modalMultiplicador = false" severity="danger" />
                <Button label="Actualizar" :disabled="btnMultiplicador" @click="actualizarMultiplicador()" severity="success" />
            </template>
        </Dialog>
        <Dialog v-model:visible="deleteBonusDialog" :style="{ width: '450px' }" :header="headerBonusDelete" :modal="true"
            class="p-fluid ">
            <div class="d-flex">
                <Button label="Cancelar" severity="info" icon="pi pi-times" text @click="deleteBonusDialog = false" />
                <Button label="Eliminar" severity="danger" icon="pi pi-check" text @click="deleteBonusBd()" />
            </div>
        </Dialog>
    </div>
</template>
<script>
import axios from 'axios';
import { useStoreEvento } from '../store';
import PerfilUsuario from './Perfil.vue';
export default {
    components: {
        PerfilUsuario
    },
    data() {
        return {
            admin: false,
            API: import.meta.env.VITE_APP_API,
            store: null,
            token: null,
            multiplicador: 1,
            btnMultiplicador: false,
            modalMultiplicador: false,
            paqueteBonus: {
                nivel: null,
                dias: null,
                horas: null,
                meta: null,
                ganancia: null,
                bonificacion: null,
                exclusivo: false
            },
            btnBonus: false,
            headerBonusDelete: null,
            deleteBonusDialog: false,
            deleteBonusID: null,
            tablaBonus: [],
            usuario: null,
            estadisticas: {
                dias: null,
                diamantes: null,
                horas: null
            },
            modalBonus: false,
        }
    },
    methods: {
        calcularProgresoDiamantes(meta, diamantes) {
            const progreso = Math.floor(((100 / meta) * diamantes));
            //0 - Porcentaje, 1 - animacion barra
            if (progreso >= 100) {
                return [100, "verde"];
            } else if (progreso >= 50 && progreso < 99) {
                return [progreso, "casi"];
            }
            return [progreso, "rojo"];
        },
        validarKnob(horas, horasMeta) {
            if (horas >= horasMeta) {
                return horas;
            }
            return horasMeta;
        },
        validarCompletoColor(horas, horasMeta) {
            const progreso = Math.floor(((100 / horasMeta) * horas));
            if (progreso < 50) {
                return '#EE1D52';
            }
            if (progreso >= 50 && progreso < 99) {
                return '#f97316'
            }
            return 'var(--primary-color)';
        },
        validarCompletoColorBar(meta, diamantes) {
            const progreso = Math.floor(((100 / meta) * diamantes));
            if (progreso < 50) {
                return {
                    value: { style: { background: '#ff3d32' } }
                }
            }
            if (progreso >= 50 && progreso < 99) {
                return {
                    value: { style: { background: '#f97316' } }
                }
            }

            return {};

        },
        formValid() {
            let valid = true;
            const key = Object.keys(this.paqueteBonus);
            for (const k of key) {
                if (this.paqueteBonus[k] == null) {
                    valid = false;
                    break;
                }
            }
            if (!valid) {
                this.$toast.add({ severity: 'error', summary: 'Nuevo evento', detail: 'Debes llenar todos los campos', life: 1600 });
            }

            return valid;
        },
        async crearBonus() {
            if (this.paqueteBonus.exclusivo) {
                this.paqueteBonus.nivel = 0;
                if (this.paqueteBonus.meta == null) {
                    this.paqueteBonus.meta = 0;
                }
            } else {
                delete this.paqueteBonus.exclusivo;
            }
            const valid = this.formValid();
            if (valid) {
                this.btnBonus = true;
                this.paqueteBonus.nivel = parseInt(this.paqueteBonus.nivel);
                this.paqueteBonus.horas = parseInt(this.paqueteBonus.horas);
                this.paqueteBonus.meta = parseInt(this.paqueteBonus.meta);
                this.paqueteBonus.dias = parseInt(this.paqueteBonus.dias);
                console.log('PAso');
                await axios.post(`${this.API}/bonus/crear`, this.paqueteBonus, this.token).then(resp => {
                    this.obtenerBonus();
                    this.paqueteBonus = {
                        nivel: null,
                        dias: null,
                        horas: null,
                        meta: null,
                        ganancia: null,
                        bonificacion: null,
                    };
                    this.$toast.add({ severity: 'success', summary: 'Nuevo Bonus', detail: 'Creado correctamente!', life: 1600 });
                }).catch(error => {
                    switch (error.response.data.statusCode) {
                        case 401:
                            //Se le termino la sesión
                            this.store.clearUser();
                            this.$router.push('/login');
                            break;
                        default:
                            this.$toast.add({ severity: 'error', summary: 'Nuevo Bonus', detail: 'Ocurrio un problema inesperado!', life: 1600 });
                            console.log('Error: ', error);
                            break;
                    }
                });
                this.btnBonus = false;
            }
        },
        async obtenerBonus() {
            axios.get(`${this.API}/bonus`).then((bonus) => {
                this.tablaBonus = bonus.data;
            }).catch((error) => {
                switch (error.response.data.statusCode) {
                    case 401:
                        //Se le termino la sesión
                        this.store.clearUser();
                        this.$router.push('/login');
                        break;
                    default:
                        this.$toast.add({ severity: 'error', summary: 'Nuevo Bonus', detail: 'Ocurrio un problema inesperado!', life: 1600 });
                        console.log('Error: ', error);
                        break;
                }
            });
        },
        async actualizarMultiplicador() {
            this.btnMultiplicador = true;
            await axios.post(`${this.API}/bonus/multiplicador/${this.multiplicador}`).then(() => {
                this.modalMultiplicador = false;
                this.$toast.add({ severity: 'success', summary: 'Multiplicador', detail: 'Actualizado correctamente!', life: 1600 });
            }).catch((error) => {
                switch (error.response.data.statusCode) {
                    case 401:
                        //Se le termino la sesión
                        this.store.clearUser();
                        this.$router.push('/login');
                        break;
                    default:
                        this.$toast.add({ severity: 'error', summary: 'Multiplicador', detail: 'Ocurrio un problema inesperado!', life: 1600 });
                        console.log('Error: ', error);
                        break;
                }
            });
            this.btnMultiplicador = false;
        },
        comfirmDelete(id, nivel) {
            this.deleteBonusID = id;
            this.headerBonusDelete = 'Desea eliminar el nivel: ' + nivel;
            this.deleteBonusDialog = true;
        },
        deleteBonusBd() {
            this.deleteBonusDialog = false;
            axios.delete(`${this.API}/bonus/${this.deleteBonusID}`, this.token).then(async (resp) => {
                await this.obtenerBonus();
                this.$toast.add({ severity: 'success', summary: 'Información', detail: 'Eliminado correctamente', life: 3000 });
                this.deleteBonusID = null;
                this.headerBonusDelete = ``;
            }).catch(error => {
                switch (error.response.data.statusCode) {
                    case 401:
                        //Se le termino la sesión
                        this.store.clearUser();
                        this.$router.push('/login');
                        break;
                    default:
                        this.toast.add({ severity: 'error', summary: 'Autorización', detail: "ocurrio un error!", life: 3000 });
                        console.log('Error: ', error);
                        break;
                }
            });
        },
        async getMultiplicador() {
            axios.get(`${this.API}/bonus/multiplicador`).then(resp => {
                this.multiplicador = resp.data.multiplicador;
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
        if (!this.store.isActive()) {
            this.$router.push('/login');
        }
        this.admin = this.store.isAdmin();
        if (!this.admin) {
            this.usuario = this.store.getUsuario();
            this.estadisticas.dias = parseInt(this.usuario.dias_validos_mes_actual);
            this.estadisticas.horas = parseInt(this.usuario.last_live_duration_mes_actual.split('h')[0]);
            this.estadisticas.diamantes = parseInt(this.usuario.diamantes_mes_actual);
        }
        await this.obtenerBonus();
        await this.getMultiplicador();
    }
}
</script>
<style>
.nocompleto {
    background-color: #ff3d32;
}

.usuario {
    background-image: url('/assets/img/perfil/fondo.png') !important;
    background-repeat: no-repeat;
    background-size: cover;
}

.bonus-usuario>.p-datatable-wrapper>.p-datatable-table>.p-datatable-thead>tr>th {
    color: #69C9D0;
}

.bonus-usuario>.p-datatable-wrapper>.p-datatable-table>.p-datatable-tbody>tr>td {
    color: white;
}

.usuario>.Bonus>.p-panel-header,
.usuario>.Bonus>.p-toggleable-content>.p-panel-content,
.bonus-usuario>.p-datatable-wrapper>.p-datatable-table>.p-datatable-tbody>tr>td,
.bonus-usuario>.p-datatable-wrapper>.p-datatable-table>.p-datatable-thead>tr>th {
    background-color: transparent;
    border: none;
}

.bonus-usuario>.p-datatable-wrapper>.p-datatable-table>.p-datatable-tbody>tr {
    background-image: url('/assets/img/eventos/divisor-fila.png') !important;
    background-repeat: repeat-x !important;
    background-size: contain !important;
    background-color: transparent !important;
}

.usuario>.Bonus>.p-toggleable-content>.p-panel-content>.bonus-usuario {
    max-width: 1100px !important;
    margin: auto !important;
}

.usuario>.Bonus>.p-toggleable-content>.p-panel-content>.bonus-usuario>.p-datatable-wrapper {
    height: 650px;
}

.usuario>.Bonus>.p-toggleable-content>.p-panel-content {
    background-image: url('/assets/img/eventos/marco-tabla.png') !important;
    background-repeat: no-repeat;
    background-size: 100% 99%;
    padding: 46px;
}

.barra-progreso-horas {
    background-image: url('/assets/img/perfil/barra-horas.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 30px;
    padding: 2px;
}

.barra-progreso-horas>* {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 26px;
    position: relative;
    top: -23px;
}


.barra-progreso-horas>.diamante {
    background-image: url('/assets/img/perfil/iconos/terminado.png');
    width: 100px;
    height: 100px;
    top: -37px;
    z-index: 2;
    left: -44px;
}

.barra-progreso-horas>.rojo {
    background-image: url('/assets/img/perfil/iconos/rojo.png');
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
}

.barra-progreso-horas>.verde {
    background-image: url('/assets/img/perfil/iconos/verde.png');
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    top: -100px;
    z-index: 1;
    position: relative !important;
}

.barra-progreso-horas>.verde+p {
    top: -123px;
    z-index: 1;
    position: relative !important;
}

.barra-progreso-horas>.casi {
    background-image: url('/assets/img/perfil/iconos/casi.png');
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
}

.aplica {
    background-image: url('/assets/img/perfil/iconos/aplica.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    text-align: center;
    padding: 12px 22px;
}
</style>