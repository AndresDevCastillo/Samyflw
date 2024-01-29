<template>
    <Panel class="creadores">
        <Toast />
        <template #header>
            <div class="flex items-center gap-2 flex-end w-full justify-content-between">
                <h1 class="m-0">Creadores</h1>
                <Button label="Excel" icon="pi pi-plus" @click="modalExcel = true" />
            </div>
        </template>
        <DataTable :value="creadores" sortField="diamantes_mes_actual" :sortOrder="-1" paginator :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 100%">
            <Column field="usuario" header="Usuario" sortable></Column>
            <Column field="grupo" header="Grupo" sortable>
                <template #body="slotProps">
                    <Badge v-if="slotProps.data.grupo == 'A'" :value="slotProps.data.grupo" severity="success"></Badge>
                    <Badge v-if="slotProps.data.grupo == 'B'" :value="slotProps.data.grupo" severity="info"></Badge>
                    <Badge v-if="slotProps.data.grupo == 'C'" :value="slotProps.data.grupo" severity="danger"></Badge>
                </template>
            </Column>
            <Column field="diamantes_mes_actual" header="Diamantes en el mes" sortable />
            <Column field="diamantes_mes_anterior" header="Diamantes del mes anterior" sortable />
        </DataTable>
        <!-- Modal agregar evento -->
        <Dialog v-model:visible="modalExcel" header="Subir excel" :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">

            <form ref="formExcel" enctype="multipart/form-data">
                <div class="flex flex-column gap-1 mb-2">
                    <label for="excel" class="font-bold block">Excel</label>
                    <InputText type="file" id="excel"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        @change="asignarExcel" required aria-describedby="excel-help" />
                    <small id="excel-help">El archivo debe ser .xlsx, .xls.</small>
                </div>
            </form>
            <template #footer>
                <Button label="Cancelar" @click="modalExcel = false" text severity="danger" autofocus />
                <Button label="Subir" @click="subirExcel" :disabled="btnSubirExcel" severity="success" />
            </template>
        </Dialog>
    </Panel>
</template>
<script>
import axios from 'axios';
export default {
    data: () => ({
        API: 'https://samyflw.fly.dev',
        modalExcel: false,
        btnSubirExcel: false,
        creadores: [],
        paquete: {
            excel: null
        }
    }),
    methods: {
        asignarExcel(event) {
            this.paquete.excel = event.target.files[0];
        },
        async subirExcel() {
            this.btnSubirExcel = true;
            if (this.paquete.excel != null) {
                await axios.post(`${this.API}/creador/subirExcel`, this.paquete, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }).then(response => {
                    if (response.data) {
                        this.getCreadores();
                        this.modalExcel = false;
                        this.$refs.formExcel.reset();
                        this.$toast.add({ severity: 'success', summary: 'Subir excel', detail: 'Creadores creados correctamente', life: 1500 });

                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Subir excel', detail: 'No se pudieron crear los creadores', life: 1500 });

                    }
                }).catch(error => {
                    this.$toast.add({ severity: 'error', summary: 'Subir excel', detail: 'Sucedió un error, no se pudo procesar el archivo', life: 1500 });

                    console.log('Error: ', error);
                });
            } else {
                this.$toast.add({ severity: 'info', summary: 'Subir excel', detail: 'Debes escoger un archivo', life: 1500 });
            }

            this.btnSubirExcel = false;
            console.log('valido');

        },
        async getCreadores() {
            await axios.get(`${this.API}/creador`).then(response => {
                this.creadores = response.data;
            }).catch(error => {
                console.log(error);
            });
        }
    },
    created() {
        this.getCreadores();
    }
}
</script>