<template>
  <div>
    <div class="form-container">
      <div class="logo-container">
        Usuario de TikTok
      </div>

      <form class="form">
        <div class="form-group">
          <input type="text" name="text" placeholder="Ingrese su Nickname" v-model="usuario">
        </div>

        <button class="form-submit-btn" type="button" @click="DataApi">Ingresar</button>
      </form>
    </div>
    <p>{{ apitiktok }}</p>
  </div>
</template>
<script >
import { WebcastPushConnection } from 'tiktok-live-connector';
export default {
  data: () => ({
    usuario: null,
    apitiktok: null
  }),
  methods: {
    DataApi() {

      console.log(this.usuario);
      let tiktokUsername = this.usuario;
      // Create a new wrapper object and pass the username
      let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

      // Connect to the chat (await can be used as well)
      tiktokLiveConnection.connect().then(state => {
        console.info(`Connected to roomId ${state.roomId}`);
      }).catch(err => {
        console.error('Failed to connect', err);
      })

      // Define the events that you want to handle
      // In this case we listen to chat messages (comments)
      tiktokLiveConnection.on('chat', data => {
        console.log(`${data.uniqueId} (userId:${data.userId}) writes: ${data.comment}`);
      })

      // And here we receive gifts sent to the streamer
      tiktokLiveConnection.on('gift', data => {
        console.log(`${data.uniqueId} (userId:${data.userId}) sends ${data.giftId}`);
      })
    }
  }
}
</script>

<style>
.form-container {
  max-width: 400px;
  background-color: #fff;
  padding: 32px 24px;
  font-size: 14px;
  font-family: inherit;
  color: #212121;
  display: flex;
  flex-direction: column;
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
</style>

