<template>
    <Panel class="evento">
        <template #header>
            <div class="flex items-center gap-2 flex-end w-full justify-content-between">
                <h1 class="m-0">Eventos</h1>
                <Button label="Evento" icon="pi pi-plus" @click="modalEvento = true" />
            </div>
        </template>
        <DataTable :value="eventos" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 100%">
            <Column field="titulo" header="Título" sortable></Column>
            <Column field="descripcion" header="Descripción" sortable></Column>
            <Column field="reglas" header="Regla" sortable />
            <Column field="fecha_inicio" header="Fecha inicio" sortable></Column>
            <Column field="fecha_fin" header="Fecha fin" sortable></Column>
            <Column field="top1_premio" header="Top 1" sortable />
            <Column field="top2_premio" header="Top 2" sortable />
            <Column field="top3_premio" header="Top 3" sortable />
        </DataTable>
        <!-- Modal agregar evento -->
        <Dialog v-model:visible="modalEvento" header="Nuevo evento" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">
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
                    <Textarea id="reglas" v-model="paquete.regla" rows="3" cols="30" />
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <label for="fecha_inicio">Fecha de inicio</label>
                    <Calendar id="fecha_inicio" v-model="paquete.fecha_inicio" :minDate="new Date()" :manualInput="false" dateFormat="yy-mm-dd" />
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <label for="fecha_fin">Fecha fin</label>
                    <Calendar id="fecha_fin" v-model="paquete.fecha_fin" :minDate="new Date()" :manualInput="false" dateFormat="yy-mm-dd" />
                </div>
                <Divider />
                <h1 class="mb-3">Premios</h1>
                <div class="flex flex-column gap-1 mb-2">
                    <h3>Top 1</h3>
                    <div class="flex flex-column gap-2 mb-2">
                        <label for="descripcion_top1">Descripción</label>
                        <InputText type="text" id="descripcion_top1" v-model="paquete.top1.descripcion" />
                    </div>
                    <div class="flex flex-column gap-2">
                        <label for="imagen_top1">Imagen</label>
                        <InputText type="file" id="imagen_top1" accept="image/*" v-model="paquete.top1.imagen" />
                    </div>
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <h3>Top 2</h3>
                    <div class="flex flex-column gap-2 mb-2">
                        <label for="descripcion_top2">Descripción</label>
                        <InputText type="text" id="descripcion_top2" v-model="paquete.top2.descripcion" />
                    </div>
                    <div class="flex flex-column gap-2">
                        <label for="imagen_top2">Imagen</label>
                        <InputText type="file" id="imagen_top2" accept="image/*" v-model="paquete.top2.imagen" />
                    </div>
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <h3>Top 3</h3>
                    <div class="flex flex-column gap-2 mb-2">
                        <label for="descripcion_top3">Descripción</label>
                        <InputText type="text" id="descripcion_top3" v-model="paquete.top3.descripcion" />
                    </div>
                    <div class="flex flex-column gap-2">
                        <label for="imagen_top3">Imagen</label>
                        <InputText type="file" id="imagen_top1" accept="image/*" v-model="paquete.top3.imagen" />
                    </div>
                </div>
            </form>
            <template #footer>
                <Button label="Cancelar" @click="modalEvento = false" text severity="danger" autofocus />
                <Button label="Crear" @click="modalEvento = false" severity="success" />
            </template>
        </Dialog>
    </Panel>
</template>
<script>
export default {
    name: 'Evento',
    data: () => ({
        modalEvento: false,
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
            regla: null,
            fecha_inicio: new Date(),
            fecha_fin: null,
            top1: {
                descripcion: null,
                imagen: null
            },
            top2: {
                descripcion: null,
                imagen: null
            },
            top3: {
                descripcion: null,
                imagen: null
            }
        }
    })

}
</script>