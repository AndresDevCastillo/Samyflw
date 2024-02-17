<template>
  <Panel class="creadores">
    <Toast />
    <template #header>
      <div class="flex items-center gap-2 flex-end w-full justify-content-between">
        <h1 class="m-0">Creadores</h1>
        <div class="botones flex gap-2">
          <Button label="Insignias" icon="pi pi-plus" @click="modalInsignias = true" />
          <Button label="Excel" icon="pi pi-plus" @click="modalExcel = true" />
        </div>
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
      <Column header="⭐">
        <template #body="slotProps">
          <Button icon="pi pi-star" severity="warning" @click="
            abrirModalInsigniasActualizar(
              slotProps.data.insignias,
              slotProps.data._id
            )
            " />
        </template>
      </Column>
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
    <!-- Modal de las insignias -->
    <Dialog v-model:visible="modalInsignias" header="Subir Insignias" :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">
      <form ref="formInsignias" enctype="multipart/form-data">
        <div class="flex flex-column gap-1 mb-2">
          <label for="excel" class="font-bold block">Insignias</label>
          <InputText type="file" id="insignia" accept="image/*" @change="asignarInsignia" required
            aria-describedby="excel-help" />
          <small id="excel-help">El archivo debe ser .extensiones de imagenes</small>
          <label for="descripcion" class="font-bold block">Descripción</label>
          <InputText v-model="descripcionInsignia" type="text" id="descripcion" required />
        </div>
      </form>
      <template #footer>
        <Button label="Cancelar" @click="modalInsignias = false" text severity="danger" autofocus />
        <Button label="Subir" @click="subirInsignia" :disabled="btnSubirInsignia" severity="success" />
      </template>
    </Dialog>
    <Dialog v-model:visible="modalInsigniasUser" header="Actualizar Insignias" :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">
      <div class="flex gap-6 flex-wrap justify-content-center">
        <div style="width: 120px; height: 200px" v-for="insignia in insignias" :key="insignia.secure_url">
          <div class="relative flex justify-content-center" style="margin-bottom: 10px">
            <img width="120px" height="120px" :src="insignia.secure_url" alt="Insignia"
              class="border-round imgInsignias" />
          </div>
          <div class="flex justify-content-center align-items-center">
            <Checkbox v-model="paqueteActualizarInsigniasUsuario.selectedInsignias" :inputId="insignia.secure_url"
              :value="insignia.secure_url" />
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" @click="modalInsigniasUser = false" text severity="danger" autofocus />
        <Button label="Actualizar" @click="actualizarInsigniasUser()" :disabled="btnActualizarInsignia"
          severity="success" />
      </template>
    </Dialog>
  </Panel>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";
export default {
  data: () => ({
    API: import.meta.env.VITE_APP_API,
    store: null,
    modalExcel: false,
    insignias: [],
    paqueteActualizarInsigniasUsuario: {
      selectedInsignias: [],
      id: null,
    },
    descripcionInsignia: null,
    modalInsignias: false,
    modalInsigniasUser: false,
    btnSubirExcel: false,
    btnSubirInsignia: false,
    btnActualizarInsignia: false,
    creadores: [],
    paquete: {
      excel: null,
    },
    paqueteInsignias: {
      insignia: null,
    },
  }),
  methods: {
    asignarExcel(event) {
      this.paquete.excel = event.target.files[0];
    },
    asignarInsignia(event) {
      this.paqueteInsignias.insignia = event.target.files[0];
    },
    abrirModalInsigniasActualizar(insignias, id) {
      this.paqueteActualizarInsigniasUsuario.selectedInsignias = insignias;
      this.paqueteActualizarInsigniasUsuario.id = id;
      this.modalInsigniasUser = true;
    },
    async actualizarInsigniasUser() {
      this.btnActualizarInsignia = true;
      await axios
        .post(
          `${this.API}/usuario/actualizarInsignias`,
          {
            id: this.paqueteActualizarInsigniasUsuario.id,
            insignias: this.paqueteActualizarInsigniasUsuario.selectedInsignias,
          },
          {
            headers: {
              Authorization: `Bearer ${this.store.getToken()}`,
            },
          }
        )
        .then((response) => {
          if (response.data) {
            this.$toast.add({
              severity: "success",
              summary: "Actualizar insignias",
              detail: "Se actualizo correctamente",
              life: 1500,
            });
          } else {
            this.$toast.add({
              severity: "error",
              summary: "Actualizar insignias",
              detail: "Comuniquese con soporte",
              life: 1500,
            });
          }
          this.getCreadores();
        })
        .catch((error) => {
          switch (error.response.data.statusCode) {
            case 401:
              //Se le termino la sesión
              this.store.clearUser();
              this.$router.push("/login");
              break;
            default:
              this.$toast.add({
                severity: "error",
                summary: "Actualizar insignias",
                detail: "Sucedió un error, Comuniquese con soporte",
                life: 1500,
              });
              console.log("Error: ", error);
              break;
          }
        });
      this.btnActualizarInsignia = false;
      this.modalInsigniasUser = false;
    },
    async subirExcel() {
      this.btnSubirExcel = true;
      if (this.paquete.excel != null) {
        await axios
          .post(`${this.API}/usuario/subirExcel`, this.paquete, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${this.store.getToken()}`,
            },
          })
          .then((response) => {
            if (response.data.procesado) {
              this.getCreadores();
              this.modalExcel = false;
              this.$refs.formExcel.reset();
              this.$toast.add({
                severity: "success",
                summary: "Subir excel",
                detail: response.data.message,
                life: 1500,
              });
            } else {
              this.$toast.add({
                severity: "error",
                summary: "Subir excel",
                detail: response.data.message,
                life: 1500,
              });
            }
          })
          .catch((error) => {
            switch (error.response.data.statusCode) {
              case 401:
                //Se le termino la sesión
                this.store.clearUser();
                this.$router.push("/login");
                break;
              default:
                this.$toast.add({
                  severity: "error",
                  summary: "Subir excel",
                  detail: "Sucedió un error, no se pudo procesar el archivo",
                  life: 1500,
                });
                console.log("Error: ", error);
                break;
            }
          });
      } else {
        this.$toast.add({
          severity: "info",
          summary: "Subir excel",
          detail: "Debes escoger un archivo",
          life: 1500,
        });
      }

      this.btnSubirExcel = false;
      console.log("valido");
    },
    async subirInsignia() {
      this.btnSubirInsignia = true;
      if (this.paqueteInsignias.insignia) {
        await axios
          .post(`${this.API}/usuario/subirInsignia/${this.descripcionInsignia ? this.descripcionInsignia : ''}`, this.paqueteInsignias, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${this.store.getToken()}`,
            },
          })
          .then(async (response) => {
            if (response.data) {
              await this.getInsignias();
              this.modalInsignias = false;
              this.$refs.formInsignias.reset();
              this.descripcionInsignia = null;
              this.$toast.add({
                severity: "success",
                summary: "Subir insignias",
                detail: response.data.message,
                life: 1500,
              });
            } else {
              this.$toast.add({
                severity: "error",
                summary: "Subir insignias",
                detail: response.data.message,
                life: 1500,
              });
            }
          })
          .catch((error) => {
            switch (error.response.data.statusCode) {
              case 401:
                //Se le termino la sesión
                this.store.clearUser();
                this.$router.push("/login");
                break;
              default:
                this.$toast.add({
                  severity: "error",
                  summary: "Subir insignias",
                  detail: "Sucedió un error, no se pudo procesar el archivo",
                  life: 1500,
                });
                console.log("Error: ", error);
                break;
            }
          });
      } else {
        this.$toast.add({
          severity: "info",
          summary: "Subir insignias",
          detail: "Debes escoger un archivo",
          life: 1500,
        });
      }

      this.btnSubirInsignia = false;
      console.log("valido");
    },
    async getCreadores() {
      await axios
        .get(`${this.API}/usuario`, {
          headers: {
            Authorization: `Bearer ${this.store.getToken()}`,
          },
        })
        .then((response) => {
          this.creadores = response.data;
        })
        .catch((error) => {
          switch (error.response.data.statusCode) {
            case 401:
              //Se le termino la sesión
              this.store.clearUser();
              this.$router.push("/login");
              break;
            default:
              console.log("Error: ", error);
              break;
          }
        });
    },
    async getInsignias() {
      axios
        .get(`${this.API}/usuario/insigniasCloud`, {
          headers: {
            Authorization: `Bearer ${this.store.getToken()}`,
          },
        })
        .then((resp) => {
          this.insignias = resp.data;
        });
    },
  },
  async created() {
    this.store = useStoreEvento();
    if (!this.store.isActive()) {
      this.$router.push("/login");
    }
    await this.getCreadores();
    await this.getInsignias();
  },
};
</script>
