<template>
    <Toast />
    <PerfilUsuario v-if="!store.isAdmin()" />
    <Panel class="Bonus" v-if="!admin">
        <template #header>
            <div class="flex items-center gap-2 flex-end w-full justify-content-between">
                <h1 class="m-0">Bonus</h1>

            </div>
        </template>
        <DataTable :value="tablaBonus" tableStyle="min-width: 100%">
            <Column field="nivel" header="Nivel 👑"></Column>
            <Column field="dias" header="Dias">
                <template #body="slotProps">
                    <Knob :valueColor="validarCompletoColor(estadisticas.dias, slotProps.data.dias)"
                        v-model="estadisticas.dias" :valueTemplate="slotProps.data.dias.toString()" readonly
                        :max="validarKnob(estadisticas.dias, slotProps.data.dias)" :size="70" />
                </template>
            </Column>
            <Column field="horas" header="Horas">
                <template #body="slotProps">
                    <Knob :valueColor="validarCompletoColor(estadisticas.horas, slotProps.data.horas)"
                        v-model="estadisticas.horas" :valueTemplate="slotProps.data.horas.toString()" readonly
                        :max="validarKnob(estadisticas.horas, slotProps.data.horas)" :size="70" />
                </template>
            </Column>
            <Column field="meta" header="Diamantes">
                <template #body="slotProps">
                    {{ slotProps.data.meta.toLocaleString() }}
                    <ProgressBar :pt="validarCompletoColorBar(slotProps.data.meta, estadisticas.diamantes)"
                        :value="calcularProgresoDiamantes(slotProps.data.meta, estadisticas.diamantes)">
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
    <Panel class="Bonus" v-else>
        <template #header>
            <div class="flex items-center gap-2 flex-end w-full justify-content-between">
                <h1 class="m-0">Bonus</h1>
                <Button icon="pi pi-plus" label="Añadir" @click="modalBonus = true"></Button>
            </div>
        </template>
        <DataTable :value="tablaBonus" tableStyle="min-width: 100%" sortField="nivel" :sortOrder="1">
            <Column field="nivel" header="Nivel 👑"></Column>
            <Column field="dias" header="Dias"></Column>
            <Column field="horas" header="Horas"> </Column>
            <Column field="meta" header="Diamantes"></Column>
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
            <div class="flex flex-column gap-1 mb-2">
                <label for="nivel" class="font-bold block">Nivel</label>
                <InputText v-model="paqueteBonus.nivel" type="number" id="nivel" />
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
    <Dialog v-model:visible="deleteBonusDialog" :style="{ width: '450px' }" :header="headerBonusDelete" :modal="true"
        class="p-fluid ">
        <div class="d-flex">
            <Button label="Cancelar" severity="info" icon="pi pi-times" text @click="deleteBonusDialog = false" />
            <Button label="Eliminar" severity="danger" icon="pi pi-check" text @click="deleteBonusBd()" />
        </div>
    </Dialog>
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
            paqueteBonus: {
                nivel: null,
                dias: null,
                horas: null,
                meta: null,
                ganancia: null,
                bonificacion: null,
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
            if (progreso >= 100) {
                return 100;
            }
            return progreso;
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
                return '#ff3d32';
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
            const valid = this.formValid();
            if (valid) {
                this.btnBonus = true;
                this.paqueteBonus.nivel = parseInt(this.paqueteBonus.nivel);
                this.paqueteBonus.horas = parseInt(this.paqueteBonus.horas);
                this.paqueteBonus.meta = parseInt(this.paqueteBonus.meta);
                this.paqueteBonus.dias = parseInt(this.paqueteBonus.dias);
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
                    this.$toast.add({ severity: 'error', summary: 'Nuevo Bonus', detail: 'Ocurrio un problema inesperado!', life: 1600 });
                })
                this.btnBonus = false;
            }
        },
        async obtenerBonus() {
            axios.get(`${this.API}/bonus`).then((bonus) => {
                this.tablaBonus = bonus.data;
            }).catch((error) => {
                this.$toast.add({ severity: 'error', summary: 'Nuevo Bonus', detail: 'Ocurrio un problema inesperado!', life: 1600 });
            });
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
                this.toast.add({ severity: 'error', summary: 'Autorización', detail: "ocurrio un error!", life: 3000 });
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
    }
}
</script>
<style>
.nocompleto {
    background-color: #ff3d32;
}
</style>