<template>
    <Panel class="evento">
        <Toast />
        <template #header>
            <div class="flex items-center gap-2 flex-end w-full justify-content-between">
                <h1 class="m-0">Eventos</h1>
                <Button label="Evento" icon="pi pi-plus" @click="modalEvento = true" />
            </div>
        </template>
        <DataTable :value="eventos" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 90rem">
            <Column field="titulo" header="Título" sortable></Column>
            <Column field="descripcion" header="Descripción" sortable></Column>
            <Column field="reglas" header="Regla" sortable />
            <Column field="fecha_inicio" header="Fecha inicio" sortable></Column>
            <Column field="fecha_fin" header="Fecha fin" sortable></Column>
            <Column field="premios.top1.descripcion" header="Top 1" sortable />
            <Column field="premios.top2.descripcion" header="Top 2" sortable />
            <Column field="premios.top3.descripcion" header="Top 3" sortable />
        </DataTable>
        <!-- Modal agregar evento -->
        <Dialog v-model:visible="modalEvento" header="Nuevo evento" :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">
            <form ref="formEvento">
                <div class="flex flex-column gap-1 mb-2">
                    <label for="titulo" class="font-bold block">Título</label>
                    <InputText type="text" id="titulo" v-model="paquete.titulo" />
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <label for="descripcion" class="font-bold block">Descripción</label>
                    <Textarea id="descripcion" v-model="paquete.descripcion" rows="3" cols="30" />
                </div>
                <div class="flex flex-column gap-1 mb-3">
                    <label for="reglas" class="font-bold block">Reglas</label>
                    <Textarea id="reglas" v-model="paquete.reglas" rows="3" cols="30" />
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <label for="fecha_inicio">Fecha de inicio</label>
                    <Calendar id="fecha_inicio" v-model="paquete.fecha_inicio" :minDate="new Date()" :manualInput="false"
                        dateFormat="yy-mm-dd" />
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <label for="fecha_fin">Fecha fin</label>
                    <Calendar id="fecha_fin" v-model="paquete.fecha_fin" :minDate="new Date()" :manualInput="false"
                        dateFormat="yy-mm-dd" />
                </div>
                <Divider />
                <h1 class="mb-3">Premios</h1>
                <div class="flex flex-column gap-1 mb-2">
                    <h3>Top 1</h3>
                    <div class="flex flex-column gap-2 mb-2">
                        <label for="descripcion_top1">Descripción</label>
                        <InputText type="text" id="descripcion_top1" v-model="paquete.premios.top1.descripcion" />
                    </div>
                    <div class="flex flex-column gap-2">
                        <label for="imagen_top1">Imagen</label>
                        <InputText type="file" id="imagen_top1" accept="image/*" @change="asignarImagen($event, 'top1')" />
                    </div>
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <h3>Top 2</h3>
                    <div class="flex flex-column gap-2 mb-2">
                        <label for="descripcion_top2">Descripción</label>
                        <InputText type="text" id="descripcion_top2" v-model="paquete.premios.top2.descripcion" />
                    </div>
                    <div class="flex flex-column gap-2">
                        <label for="imagen_top2">Imagen</label>
                        <InputText type="file" id="imagen_top2" accept="image/*" @change="asignarImagen($event, 'top2')" />
                    </div>
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <h3>Top 3</h3>
                    <div class="flex flex-column gap-2 mb-2">
                        <label for="descripcion_top3">Descripción</label>
                        <InputText type="text" id="descripcion_top3" v-model="paquete.premios.top3.descripcion" />
                    </div>
                    <div class="flex flex-column gap-2">
                        <label for="imagen_top3">Imagen</label>
                        <InputText type="file" id="imagen_top1" accept="image/*" @change="asignarImagen($event, 'top3')" />
                    </div>
                </div>
            </form>
            <template #footer>
                <Button label="Cancelar" @click="modalEvento = false" text severity="danger" autofocus />
                <Button label="Crear" @click="crearEvento" :disabled="btnEvento" severity="success" />
            </template>
        </Dialog>
    </Panel>
</template>
<script>
import axios from 'axios'
export default {
    name: 'Evento',
    data: () => ({
        API: import.meta.env.VITE_APP_API,
        modalEvento: false,
        btnEvento: false,
        eventos: [
            {
                titulo: "Evento 1",
                descripcion: "Es un evento",
                fecha_inicio: "2024-01-01",
                fecha_fin: "2024-01-30",
                reglas: "Reglas 1",
                top1_premio: "Silla gamer",
                top2_premio: "Aro de luz",
                top3_premio: "Celular"
            }
        ],
        paquete: {
            titulo: null,
            descripcion: null,
            reglas: null,
            fecha_inicio: new Date(),
            fecha_fin: null,
            premios: {
                top1: {
                    descripcion: null,
                    imagen: ''
                },
                top2: {
                    descripcion: null,
                    imagen: ''
                },
                top3: {
                    descripcion: null,
                    imagen: ''
                }
            },
            imagen_top1: null,
            imagen_top2: null,
            imagen_top3: null

        }
    }),
    methods: {
        asignarImagen(event, top) {
            switch (top) {
                case 'top1':
                    this.paquete.imagen_top1 = event.target.files[0]
                    break;

                case 'top2':
                    this.paquete.imagen_top2 = event.target.files[0]
                    break;

                case 'top3':
                    this.paquete.imagen_top3 = event.target.files[0]
                    break;
            }
        },
        async getEventos() {
            await axios.get(`${this.API}/evento`).then(response => {
                this.eventos = response.data;
            });
        },
        async getEventoActivo() {
            await axios.get(`${this.API}/evento/activo`).then(response => {
                console.log(response.data);
            });
        },
        async crearEvento() {
            const validF = await this.formValid();
            if (validF) {
                this.btnEvento = true;
                await axios.post(`${this.API}/evento/crear`, this.paquete, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }).then(response => {
                    if (response.data.creado) {
                        this.getEventos();
                        this.modalEvento = false;
                        this.$refs.formEvento.reset();
                        this.$toast.add({ severity: 'success', summary: 'Nuevo evento', detail: 'Evento creado correctamente', life: 1500 });
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Nuevo evento', detail: 'No se pudo crear el evento', life: 1500 });
                    }
                }).catch(error => {
                    this.$toast.add({ severity: 'error', summary: 'Nuevo evento', detail: 'Sucedió un error, no se pudo crear el evento', life: 1500 });
                    console.log('Error: ', error);
                });
                this.btnEvento = false;
            }
        },
        async formValid() {
            const key = Object.keys(this.paquete);
            let valid = false;
            for (const k of key) {
                valid = true;
                if (k == "premio") {
                    if (this.paquete[k].top1.descripcion == null || !/^(?!\s*$).+/.test(this.paquete[k].top1.descripcion) || !/^(?!\s*$).+/.test(this.paquete[k].top2.descripcion) || this.paquete[k].top2.descripcion != null || !/^(?!\s*$).+/.test(this.paquete[k].top3.descripcion) || this.paquete[k].top3.descripcion == null) {
                        valid = false;
                        break;
                    }
                } else if (this.paquete[k] == null) {
                    valid = false;
                    break;
                } else if (!/^(?!\s*$).+/.test(this.paquete[k])) {
                    valid = false;
                    break;
                }
            }
            if (!valid) {
                this.$toast.add({ severity: 'error', summary: 'Nuevo evento', detail: 'Debes llenar todos los campos', life: 1600 });
            }
            return valid;
        }
    },
    created() {
        this.getEventos();
    }

}
</script>