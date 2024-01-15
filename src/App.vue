<template>
  <div>
    <div class="form-container" v-show="form">
      <div class="logo-container">
        Usuario de TikTok
      </div>

      <form class="form">
        <div class="form-group">
          <input type="text" name="text" placeholder="Ingrese su Nickname" v-model="usuario">
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


        <button class="form-submit-btn" type="button" @click="startGame()">Ingresar</button>
      </form>
    </div>
    <canvas id="gameCanvas" v-show="!form"></canvas>
  </div>
</template>
<script >
import Phaser from 'phaser';
import { io } from 'socket.io-client'
export default {
  data: () => ({
    usuario: null,
    tiempo: null,
    apitiktok: null,
    form: true,
    patitoImg: null,
  }),
  methods: {
    startGame() {
      const usuario = this.usuario;
      const tiempo = parseInt(this.tiempo);
      const urlSocket = "https://patosgame.fly.dev";
      this.form = false;

      const gameCanvas = document.getElementById('gameCanvas');

      // Tamaño de la pantalla
      const size = {
        width: 1000,
        height: 600
      }

      // Clase para el pato
      class Duck extends Phaser.GameObjects.Container {
        constructor(scene, x, y, nombre, skin, id) {
          super(scene, x, y);
          this.ID = id;
          // Agregar la imagen del pato al contenedor
          const duckImage = scene.add.sprite(0, 0, skin).setOrigin(0.5, 0.5);
          duckImage.setScale(0.2);
          this.add(duckImage);

          // Crear un gráfico para el fondo con esquinas redondeadas
          const labelBackground = scene.add.graphics();
          labelBackground.fillStyle(0xFFFFFF, 1); // Color oro, opacidad 1
          labelBackground.fillRoundedRect(-30, -40, 60, 20, 10); // x, y, width, height, radius
          this.add(labelBackground);

          // Crear la etiqueta con el nombre
          const label = scene.add.text(0, -40, nombre, {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#000000',
          });
          label.setOrigin(0.5, 0.5);
          this.add(label);

          // Ajustar el ancho del fondo al ancho del texto
          this.labelWidth = label.width + 20; // Puedes ajustar el valor del padding según tus necesidades
          labelBackground.clear().fillStyle(0xffffff, 1).fillRoundedRect(-this.labelWidth / 2, -48, this.labelWidth, 20, 10);

          // Configuración de la animación yoyo
          const tweenConfig = {
            targets: this,
            y: y - 10,
            duration: 2000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1,
          };

          scene.tweens.add(tweenConfig);

          // Agregar el contenedor al escenario
          scene.add.existing(this);
        }

        move(mov) {
          if (mov <= (size.width - 100)) {
            this.scene.tweens.add({
              targets: this,
              x: mov,
              duration: 1000,
              ease: 'Linear',
            });
          }
        }

        cisne(id, skin) {
          if (id == this.ID) {
            // Cambiar la imagen del pato
            this.getAt(0).setTexture('cisne');

            // Cambiar el color del fondo del labelBackground
            const labelBackground = this.getAt(1); // Asegúrate de que el índice sea el correcto
            labelBackground.clear();
            labelBackground.fillStyle(0xD4AF37, 1); // Color y opacidad
            console.log(this.labelWidth);
            labelBackground.fillRoundedRect(-this.labelWidth / 2, -48, this.labelWidth, 20, 10);

            // Crear un temporizador para revertir la apariencia después de un tiempo
            this.scene.time.delayedCall(60000, () => {
              // Restaurar la imagen original del pato
              this.getAt(0).setTexture(skin);
              // Restaurar el color original del fondo del labelBackground
              labelBackground.clear();
              labelBackground.fillStyle(0xFFFFFF, 1); // Color y opacidad originales
              labelBackground.fillRoundedRect(-this.labelWidth / 2, -48, this.labelWidth, 20, 10);
            }, [], this);
          }
        }



        update() {
          // Lógica de actualización del pato si es necesario
        }
      }

      class WinScena extends Phaser.Scene {
        constructor() {
          super('WinScena'); // Asegúrate de que el nombre coincida con el que usaste en scene.start
        }

        preload() {

          this.load.image("bg", "/assets/img/fondoPato.jpg");
          this.load.audio('win', "/assets/audio/win.mp3")

        }

        create() {
          const backgroundMusic = this.sound.add('win');
          backgroundMusic.play();
          this.ducks = [];
          // Configuración inicial de la otra escena
          const texto = this.add.text(200, 200, '¡Escena del ganador!', { fontSize: '32px', fill: '#fff' });

          // Aquí puedes agregar más elementos o lógica específica de la otra escena
        }

        update() {
          // Lógica de actualización de la otra escena (si es necesario)
        }
      }

      // Aqui creo la escena de fondo en el juego
      class GameScene extends Phaser.Scene {
        constructor() {
          super('scene-game')
        }

        preload() {
          this.load.image("bg", "/assets/img/fondoPato.jpg");
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
          this.load.audio('backgroundMusic', "/assets/audio/bg.mp3");
          this.scene.add('WinScena', WinScena);
        }

        async create() {
          const backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
          backgroundMusic.play();
          this.ducks = [];
          this.socket = io(urlSocket, {
            query: {
              name: usuario,
            },
          });
          const size = {
            width: 1000,
            height: 600
          };
          let posicionY = 1;

          this.socket.on('newPlayer', (duckApi) => {
            const duck = new Duck(this, 200, size.height - (posicionY) * 30, duckApi[duckApi.length - 1].name, duckApi[duckApi.length - 1].skin, duckApi[duckApi.length - 1].id);
            this.sound.play("quack");
            this.ducks.push(duck);
            if (posicionY == 10) {
              posicionY = 0;
            }
            posicionY++;
            this.ducks.forEach((duck, index) => {
              duck.move(duckApi[index].x);
            })
          });

          this.socket.on('cisne', (OneduckApi) => {
            this.ducks.forEach((duck, index) => {
              duck.cisne(OneduckApi.id, OneduckApi.skin);
            })
          });

          this.socket.on('move', (duckApi) => {
            const duck = new Duck(this, 0, size.height - (posicionY) * 30);
            this.ducks.forEach((duck, index) => {
              duck.move(duckApi[index].x);
            })
          });



          const background = this.add.image(size.width / 2, size.height / 2, "bg").setOrigin(0.5, 0.5);
          background.setScale(size.width / background.width, size.height / background.height);

          setTimeout(() => {
            backgroundMusic.stop();
            this.socket.emit('final', "hola");
            this.scene.start('WinScena'); // Reemplaza 'otra-escena' con el nombre de la escena siguiente
          }, tiempo);
        }

        update() {
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
          default: 'arcade',
        },
        autoFocus: false,
      }

      //constructor del juego
      const GAME = new Phaser.Game(config);
    },
  }
}
</script>

<style>
body {
  margin: 0;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

}

.form-container {
  max-width: 400px;
  background-color: #fff;
  padding: 32px 24px;
  font-size: 14px;
  font-family: inherit;
  color: #212121;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  gap: 20px;
  box-sizing: border-box;
  border-radius: 10px;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.084), 0px 2px 3px rgba(0, 0, 0, 0.168);
}

.form-container button:active {
  scale: 0.95;
}

.form-container .logo-container {
  text-align: center;
  font-weight: 600;
  font-size: 18px;
}

.form-container .form {
  display: flex;
  flex-direction: column;
}

.form-container .form-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-container .form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-container .form-group input {
  padding: 12px 16px;
  border-radius: 6px;
  font-family: inherit;
  border: 1px solid #ccc;
}

.form-container .form-group select {
  padding: 12px 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: #fff;
}



.form-container .form-group input::placeholder {
  opacity: 0.5;
}

.form-container .form-group input:focus {
  outline: none;
  border-color: #1778f2;
}

.form-container .form-submit-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: inherit;
  color: #fff;
  background-color: #212121;
  border: none;
  width: 100%;
  padding: 12px 16px;
  font-size: inherit;
  gap: 8px;
  margin: 12px 0;
  cursor: pointer;
  border-radius: 6px;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.084), 0px 2px 3px rgba(0, 0, 0, 0.168);
}

.form-container .form-submit-btn:hover {
  background-color: #313131;
}




#gameCanvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  z-index: 1;
}
</style>

