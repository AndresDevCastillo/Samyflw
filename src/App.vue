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

      // Aqui creo la escena de fondo en el juego
      class GameScene extends Phaser.Scene {
        constructor() {
          super('scene-game')
        }

        preload() {
          this.load.image("bg", "/assets/img/fondoPato.jpg");
        }
        create() {
          const background = this.add.image(size.width / 2, size.height / 2, "bg").setOrigin(0.5, 0.5);
          background.setScale(size.width / background.width, size.height / background.height);
        }
        update() { }
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
      const game = new Phaser.Game(config);
    }
  },
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

