<template>
  <div class="game">
    <div class="form-container" v-show="form">
      <p class="title">SAMYFLW</p>
      <div class="form">
        <div class="input-group">
          <label for="username">Usuario</label>
          <input name="TikTok" placeholder="Ingrese su TikTok" v-model="usuario" />
        </div>
        <div class="input-group">
          <select v-model="tiempo">
            <option selected disabled>Seleccione una opción</option>
            <option value="10000">10 segundos</option>
            <option value="30000">30 segundos</option>
            <option value="60000">1 Minuto</option>
            <option value="120000">2 Minutos</option>
            <option value="300000">5 Minutos</option>
            <option value="600000">10 Minutos</option>
            <option value="1200000">20 Minutos</option>
            <option value="1800000">30 Minutos</option>
          </select>
        </div>
        <button class="sign" type="button" @click="startGame()">
          Ingresar
        </button>
      </div>
    </div>

    <button v-show="!form" @click="reiniciar()" class="reiniciar">
      Volver
    </button>
    <button v-show="!form" class="reiniciar patosB">Patos: {{ patos }}</button>
    <button v-show="buttonStart" @click="iniciarJuego()" class="reiniciar btnEmpezar">
      Empezar
    </button>
    <button v-show="!form" :class="classSonido" @click="toggleMute()">
      {{ btnSonido }}
    </button>
    <Button v-show="!form" class="puntos" label="Puntos" @click="dialogVisible = true" />
    <Dialog v-model:visible="dialogVisible" :header="'Jugadores: ' + players.length" :style="{ width: '75vw' }"
      maximizable modal :contentStyle="{ height: '300px' }">
      <DataTable :value="players" sortField="point" :sortOrder="-1" stripedRows scrollable scrollHeight="flex"
        tableStyle="min-width: 1rem">
        <Column field="name" header="Nombres"></Column>
        <Column field="point" header="Puntos"></Column>
        <Column field="skin" header="Skin"></Column>
      </DataTable>
      <template #footer>
        <Button label="Ok" @click="dialogVisible = false" />
      </template>
    </Dialog>
    <div class="gameContainer">
      <button v-show="timerShow" class="count">
        <vue-countdown v-if="timerShow" :time="tiempo" v-slot="{ days, hours, minutes, seconds }">
          {{ minutes < 10 ? "0" + minutes : minutes }}:{{ seconds < 10 ? "0" + seconds : seconds }} </vue-countdown>
      </button>
      <canvas id="gameCanvas" v-show="!form"></canvas>
    </div>
  </div>
</template>
<script>
import Phaser from "phaser";
import VueCountdown from "@chenfengyuan/vue-countdown";
import { io } from "socket.io-client";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
export default {
  components: {
    VueCountdown,
    DataTable,
    Column,
    Button,
    Dialog,
  },
  data: () => ({
    game: null,
    usuario: null,
    tiempo: null,
    apitiktok: null,
    form: true,
    patitoImg: null,
    patos: 0,
    buttonStart: false,
    timerShow: false,
    socket: null,
    btnSonido: "Mute",
    classSonido: "btnRojo",
    dialogVisible: false,
    players: [],
  }),
  methods: {
    startGame() {
      this.form = false;
      this.buttonStart = true;
      if (this.usuario == null || this.usuario == "" || this.tiempo == null) {
        return;
      }
      const vueDataInstance = this;
      const urlSocket = "https://patosgame.fly.dev";
      //const urlSocket = "ws://localhost:3000";
      const usuario = this.usuario;
      const tiempo = parseInt(this.tiempo);
      this.socket = io(urlSocket, {
        query: {
          name: usuario,
          time: tiempo,
        },
      });

      const gameCanvas = document.getElementById("gameCanvas");

      // Tamaño de la pantalla
      const size = {
        width: 1000,
        height: 556,
      };

      // Clase para el pato
      class Duck extends Phaser.GameObjects.Container {
        constructor(scene, x, y, nombre, skin, id) {
          super(scene, x, y);
          this.ID = id;
          // Agregar la imagen del pato al contenedor
          this.duckImage = scene.add.sprite(0, 0, skin).setOrigin(0.5, 0.5);
          this.duckImage.setScale(0.2);
          this.add(this.duckImage);

          // Crear un gráfico para el fondo con esquinas redondeadas
          const labelBackground = scene.add.graphics();
          labelBackground.fillStyle(0xffffff, 1); // Color oro, opacidad 1
          labelBackground.fillRoundedRect(-30, -40, 60, 20, 10); // x, y, width, height, radius
          this.add(labelBackground);

          // Crear la etiqueta con el nombre
          const label = scene.add.text(0, -40, nombre, {
            fontFamily: "Arial",
            fontSize: "16px",
            color: "#000000",
          });
          label.setOrigin(0.5, 0.5);
          this.add(label);

          // Ajustar el ancho del fondo al ancho del texto
          this.labelWidth = label.width + 20; // Puedes ajustar el valor del padding según tus necesidades
          labelBackground
            .clear()
            .fillStyle(0xffffff, 1)
            .fillRoundedRect(
              -this.labelWidth / 2,
              -48,
              this.labelWidth,
              20,
              10
            );

          // Configuración de la animación yoyo
          const tweenConfig = {
            targets: this,
            y: y - 10,
            duration: 2000,
            ease: "Linear",
            yoyo: true,
            repeat: -1,
          };

          scene.tweens.add(tweenConfig);

          // Agregar el contenedor al escenario
          scene.add.existing(this);
        }

        move(mov) {
          if (mov <= size.width - 100) {
            this.scene.tweens.add({
              targets: this,
              x: mov,
              duration: 5000,
              ease: "Linear",
            });
          }
        }

        alinear(ducksWin) {
          const movimientosX = [800, 700, 600, 500, 400, 300];
          ducksWin.forEach((duck, index) => {
            if (duck.id == this.ID) {
              this.scene.tweens.add({
                targets: this,
                x: movimientosX[index],
                duration: 1000,
                ease: "Linear",
              });
            }
          });
        }

        cisne(id, skin) {
          if (id == this.ID) {
            // Cambiar la imagen del pato
            this.getAt(0).setTexture("cisne").setScale(0.3);

            // Cambiar el color del fondo del labelBackground
            const labelBackground = this.getAt(1); // Asegúrate de que el índice sea el correcto
            labelBackground.clear();
            labelBackground.fillStyle(0xd4af37, 1); // Color y opacidad
            labelBackground.fillRoundedRect(
              -this.labelWidth / 2,
              -48,
              this.labelWidth,
              20,
              10
            );

            // Crear un temporizador para revertir la apariencia después de un tiempo
            this.scene.time.delayedCall(
              60000,
              () => {
                // Restaurar la imagen original del pato
                this.getAt(0).setTexture(skin).setScale(0.2);
                // Restaurar el color original del fondo del labelBackground
                labelBackground.clear();
                labelBackground.fillStyle(0xffffff, 1); // Color y opacidad originales
                labelBackground.fillRoundedRect(
                  -this.labelWidth / 2,
                  -48,
                  this.labelWidth,
                  20,
                  10
                );
              },
              [],
              this
            );
          }
        }

        destruir(ducks) {
          const ducksWin = ducks.some((duck) => duck.id === this.ID);
          if (ducksWin) {
            this.cisne(this.ID, "cisne");
          } else {
            this.destroy();
          }
        }

        update() {
          // Lógica de actualización del pato si es necesario
        }
      }

      // Aqui creo la escena de fondo en el juego
      class GameScene extends Phaser.Scene {
        constructor() {
          super("scene-game");
        }

        preload() {
          // this.load.image("bg", "/assets/img/fondoPato.jpg");
          this.load.image("cisne", "/assets/img/cisne.png");
          this.load.image("patitoceleste", "/assets/img/patitoceleste.png");
          this.load.image("patitomorado", "/assets/img/patitomorado.png");
          this.load.image("patitorojo", "/assets/img/patitorojo.png");
          this.load.image("patitoblanco", "/assets/img/patitoblanco.png");
          this.load.image("patitochicle", "/assets/img/patitochicle.png");
          this.load.image("patitonegro", "/assets/img/patitonegro.png");
          this.load.image("patitorosa", "/assets/img/patitorosa.png");
          this.load.image("patitoblue", "/assets/img/patitoblue.png");
          this.load.image("patitogris", "/assets/img/patitogris.png");
          this.load.image("patito", "/assets/img/patito.png");
          this.load.image("patitoverde", "/assets/img/patitoverde.png");
          this.load.image("patitoturbo", "/assets/img/patito.gif");
          this.load.audio("quack", "/assets/audio/quack.mp3");
          this.load.audio("pop", "/assets/audio/pop.mp3");
          this.load.audio("win", "/assets/audio/win.mp3");
          this.load.audio("backgroundMusic", "/assets/audio/bg.mp3");
          this.load.video("bg", "/assets/video/fondo.mp4", true);
        }

        async create() {
          this.muteNot = true;
          let video = this.add.video(500, 277, "bg");
          video.play(true);
          this.backgroundMusic = this.sound.add("backgroundMusic", {
            loop: true,
          });

          const popMusic = this.sound.add("pop");
          this.winMusic = this.sound.add("win", { loop: true });
          this.backgroundMusic.play();
          this.ducks = [];

          let posicionY = 1;

          vueDataInstance.$data.socket.on("newPlayer", (duckApi) => {
            vueDataInstance.$data.players = duckApi;
            vueDataInstance.$data.patos += 1;
            const duck = new Duck(
              this,
              200,
              size.height - posicionY * 30,
              duckApi[duckApi.length - 1].name,
              duckApi[duckApi.length - 1].skin,
              duckApi[duckApi.length - 1].id
            );
            if (this.muteNot) {
              this.sound.play("quack");
            }
            this.ducks.push(duck);
            if (posicionY == 10) {
              posicionY = 0;
            }
            posicionY++;
            this.ducks.forEach((duck, index) => {
              duck.move(duckApi[index].x);
            });
          });

          vueDataInstance.$data.socket.on("cisne", (OneduckApi) => {
            this.ducks.forEach((duck) => {
              duck.cisne(OneduckApi.id, OneduckApi.skin);
            });
          });

          vueDataInstance.$data.socket.on("move", (duckApi) => {
            vueDataInstance.$data.players = duckApi;
            this.ducks.forEach((duck, index) => {
              duck.move(duckApi[index].x);
            });
          });

          vueDataInstance.$data.socket.on("ganadores", (ducksWins) => {
            vueDataInstance.$data.socket.disconnect();
            this.ducks.forEach((duck) => {
              duck.destruir(ducksWins);
            });
            this.ducks.forEach((duck) => {
              duck.alinear(ducksWins);
            });

            popMusic.play();
            this.backgroundMusic.stop();
            setTimeout(this.winMusic.play(), 1000);
          });

          // const background = this.add.image(size.width / 2, size.height / 2, "bg").setOrigin(0.5, 0.5);
          // background.setScale(size.width / background.width, size.height / background.height);
        }

        update() { }

        mutear() {
          this.muteNot = !this.muteNot;
          if (this.muteNot) {
            this.backgroundMusic.play();
          } else {
            this.backgroundMusic.stop();
            this.winMusic.stop();
          }
        }
      }

      // configuracion del canva-game
      const config = {
        type: Phaser.WEBGL,
        width: size.width,
        height: size.height,
        canvas: gameCanvas,
        scene: [GameScene],
        physics: {
          default: "arcade",
        },
        autoFocus: false,
      };

      //constructor del juego
      this.game = new Phaser.Game(config);
    },
    reiniciar() {
      this.game.destroy(true);
      location.reload(true);
    },
    toggleMute() {
      if (this.classSonido == "btnRojo") {
        this.classSonido = "btnVerde";
        this.btnSonido = "Escuchar";
      } else {
        this.classSonido = "btnRojo";
        this.btnSonido = "Mute";
      }
      let instanciaPhaser = this.game.scene.getScene("scene-game");
      instanciaPhaser.mutear();
    },
    iniciarJuego() {
      this.tiempo = parseInt(this.tiempo);
      this.buttonStart = false;
      this.timerShow = true;
      this.socket.emit("empezar");
    },
  },
};
</script>
<style scoped>
.game {
  margin: 0;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.form-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  border-radius: 0.75rem;
  background-color: rgba(17, 24, 39, 1);
  padding: 2rem;
  color: rgba(243, 244, 246, 1);
}

.title {
  text-align: center;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
}

.form {
  margin-top: 1.5rem;
}

.input-group {
  margin-top: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.input-group label {
  display: block;
  color: rgba(156, 163, 175, 1);
  margin-bottom: 4px;
}

.input-group input {
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid rgba(55, 65, 81, 1);
  outline: 0;
  background-color: rgba(17, 24, 39, 1);
  padding: 0.75rem 1rem;
  color: rgba(243, 244, 246, 1);
  margin-top: 20px;
}

.input-group select {
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid rgba(55, 65, 81, 1);
  outline: 0;
  background-color: rgba(17, 24, 39, 1);
  padding: 0.75rem 1rem;
  color: rgba(243, 244, 246, 1);
}

.input-group input:focus {
  border-color: rgba(167, 139, 250);
}

.forgot {
  display: flex;
  justify-content: flex-end;
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgba(156, 163, 175, 1);
  margin: 8px 0 14px 0;
}

.forgot a,
.signup a {
  color: rgba(243, 244, 246, 1);
  text-decoration: none;
  font-size: 14px;
}

.forgot a:hover,
.signup a:hover {
  text-decoration: underline rgba(167, 139, 250, 1);
}

.sign {
  margin-top: 20px;
  display: block;
  width: 100%;
  background-color: rgba(167, 139, 250, 1);
  padding: 0.75rem;
  text-align: center;
  color: rgba(17, 24, 39, 1);
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
}

.gameContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  z-index: 1;
}

.reiniciar {
  left: 40px;
  top: 40px;
  position: absolute;
  background: #fbca1f;
  font-family: inherit;
  padding: 0.6em 1.3em;
  font-weight: 900;
  font-size: 18px;
  border: 3px solid black;
  border-radius: 0.4em;
  box-shadow: 0.1em 0.1em;
  cursor: pointer;
}

.btnRojo {
  right: 40px;
  top: 40px;
  position: absolute;
  background: #fb1f1f;
  font-family: inherit;
  padding: 0.6em 1.3em;
  font-weight: 900;
  font-size: 18px;
  border: 3px solid black;
  border-radius: 0.4em;
  box-shadow: 0.1em 0.1em;
  cursor: pointer;
}

.btnVerde {
  right: 40px;
  top: 40px;
  position: absolute;
  background: #1fc8fb;
  font-family: inherit;
  padding: 0.6em 1.3em;
  font-weight: 900;
  font-size: 18px;
  border: 3px solid black;
  border-radius: 0.4em;
  box-shadow: 0.1em 0.1em;
  cursor: pointer;
}

.puntos {
  left: 40px;
  top: 220px;
  position: absolute;
  background: #fbca1f;
  font-family: inherit;
  padding: 0.6em 1.3em;
  font-weight: 900;
  font-size: 18px;
  border: 3px solid black;
  border-radius: 0.4em;
  box-shadow: 0.1em 0.1em;
  cursor: pointer;
}

.patosB {
  top: 100px;
}

.reiniciar:hover {
  transform: translate(-0.05em, -0.05em);
  box-shadow: 0.15em 0.15em;
}

.reiniciar:active {
  transform: translate(0.05em, 0.05em);
  box-shadow: 0.05em 0.05em;
}

.btnEmpezar {
  background-color: rgb(3, 194, 3);
}

.count {
  position: absolute;
  top: 10%;
  left: 35%;
  transform: translate(-50%, -50%);
  background: #fbca1f;
  font-family: inherit;
  padding: 0.6em 1.3em;
  font-weight: 900;
  font-size: 18px;
  border: 3px solid black;
  border-radius: 0.4em;
  box-shadow: 0.1em 0.1em;
  cursor: pointer;
  z-index: 2;
}
</style>
