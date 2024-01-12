<template>
  <div>
    <div class="form-container" v-show="form">
      <div class="logo-container">
        Usuario de TikTok
      </div>

      <form class="form">
        <div class="form-group">
          <input type="text" name="text" placeholder="Ingrese su Nickname" v-model="usuario">
        </div>

        <button class="form-submit-btn" type="button" @click="startGame()">Ingresar</button>
      </form>
    </div>
    <canvas id="gameCanvas" v-show="!form"></canvas>
    <button @click="actualizarPatos()" class="btn">Hola</button>
  </div>
</template>
<script >
import Phaser from 'phaser';
export default {
  data: () => ({
    usuario: null,
    apitiktok: null,
    form: true,
    patitoImg: null,
    game: null
  }),
  methods: {
    startGame() {
      this.form = false;

      const gameCanvas = document.getElementById('gameCanvas');

      // Tamaño de la pantalla
      const size = {
        width: 1000,
        height: 600
      }

      // Clase para el pato
      class Duck extends Phaser.GameObjects.Sprite {
        constructor(scene, x, y) {
          super(scene, x, y, 'duck');
          scene.add.existing(this);
          scene.physics.world.enable(this);
          this.setScale(0.2);
          //this.body.velocity.x = Phaser.Math.Between(50, 100); // Velocidad aleatoria
        }

        moveRightWithAnimation(mov) {
          const distancia = this.x + mov;  // Posición final después de la animación
          // Verificar si la posición final supera el límite de la pared (por ejemplo, 900)
          if (distancia <= (size.width - 100)) {
            // Solo aplica la animación si no supera el límite
            this.scene.tweens.add({
              targets: this,
              x: distancia,
              duration: 1000,
              ease: 'Linear',
            });
          }
        }

        update() {
          // Lógica de actualización del pato si es necesario
        }
      }

      // Aqui creo la escena de fondo en el juego
      class GameScene extends Phaser.Scene {
        constructor() {
          super('scene-game')
        }

        preload() {
          this.load.image("bg", "/assets/img/fondoPato.jpg");
          this.load.image("duck", "/assets/img/patito.png");
        }

        create() {
          const size = {
            width: 1000,
            height: 600
          };

          const background = this.add.image(size.width / 2, size.height / 2, "bg").setOrigin(0.5, 0.5);
          background.setScale(size.width / background.width, size.height / background.height);

          this.ducks = []
          // Crear directamente los patos en la escena
          for (let i = 0; i < 10; i++) {
            const duck = new Duck(this, 0, size.height - (i + 1) * 30);
            this.ducks.push(duck);
          }
        }

        update() {
          // Lógica de actualización de la escena si es necesario
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
          arcade: {
            debug: true
          }
        }
      }

      //constructor del juego
      this.$data.game = new Phaser.Game(config);
    },
    actualizarPatos() {
      // Datos de la api Falsos xd
      let datos = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
      this.$data.game.scene.scenes[0].ducks.map((pato, index) => {
        pato.moveRightWithAnimation(datos[index]);
      })
    }
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
  gap: 2px;
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

.form-container .link {
  color: #1778f2;
  text-decoration: none;
}


.form-container .link:hover {
  text-decoration: underline;
}

.btn {
  border: 1px solid red;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  z-index: 3;
}

#gameCanvas {
  border: 1px solid red;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  z-index: 1;
}
</style>

