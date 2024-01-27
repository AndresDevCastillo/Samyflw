<template>
    <Panel class="usuarios">
        <template #header>
            <div class="flex items-center gap-2 flex-end w-full justify-content-between">
                <h1 class="m-0">Usuarios</h1>
                <Button label="Usuario" icon="pi pi-plus" @click="modalUsuario = true" />
            </div>
        </template>
        <DataTable :value="usuarios" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 100%">
            <Column field="usuario" header="Usuario" sortable></Column>
            <Column field="correo" header="Correo" sortable></Column>
            <Column field="telefono" header="Teléfono" sortable />
        </DataTable>
        <!-- Modal agregar evento -->
        <Dialog v-model:visible="modalUsuario" header="Nuevo usuario" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">
            <form ref="formEvento">
                <div class="flex flex-column gap-1 mb-2">
                    <label for="usuario" class="font-bold block">Usuario</label>
                    <InputText type="text" id="usuario" v-model="paquete.usuario" />
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <label for="correo" class="font-bold block">Correo</label>
                    <InputText type="email" id="correo" v-model="paquete.correo" />
                </div>
                <div class="flex flex-column gap-1 mb-3">
                    <label for="telefono" class="font-bold block">Teléfono</label>
                    <InputText type="tel" id="telefono" v-model="paquete.telefono" />
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <label for="contrasena">Contraseña</label>
                    <InputText type="text" id="contrasena" v-model="paquete.contrasena" />
                </div>
            </form>
            <template #footer>
                <Button label="Cancelar" @click="modalUsuario = false" text severity="danger" autofocus />
                <Button label="Crear" @click="modalUsuario = false" severity="success" />
            </template>
        </Dialog>
    </Panel>
</template>
<script>
export default {
    name: 'Usuarios',
    data: () => ({
        modalUsuario: false,
        usuarios: [
            {
                usuario: 'Samyflw',
                correo: 'samyflw@gmail.com',
                telefono: '3024225433'
            }
        ],
        paquete: {
            usuario: null,
            correo: null,
            telefono: null,
            contrasena: null,
        }
    })
}
</script>