<template>
    <div class="clasificacion">
        <img class="imgFondo" :src="`/assets/img/fondo${tipo}.png`" alt="">
        <img :src="foto" class="imgProfile" alt="" />
        <div class="labelTag">
            <Tag :class="tipo" :value="nombre">
            </Tag>
        </div>
        <div class="badgeDiv">
            <Badge :value="top" size="large" :class="tipo" />
        </div>
    </div>
</template>
<script>
export default {
    props: {
        tipo: String,
        foto: String,
        nombre: String,
        top: String,
    },

}
</script>
<style scoped>
.clasificacion {
    width: 270px;
    height: 300px;
}

.clasificacion>.imgEtiqueta {
    position: relative;
    z-index: 3;
}

.clasificacion>.imgProfile {
    position: relative;
    left: 50%;
    transform: translateX(-51%);
    top: 109px;
    width: 95px;
    height: 95px;
    border-radius: 200px;
    z-index: 2;
}



.clasificacion>.imgFondo {
    position: absolute;
}

.Oro {
    background-color: #FBD05B;
}

.Platino {
    background-color: #B4D0F8;
}

.Cobre {
    background-color: #9B5E13;
}

.clasificacion>.labelTag {
    top: 135px;
    position: relative;
    z-index: 5;
    display: flex;
    justify-content: center;
}

.badgeDiv {
    position: relative;
    top: 66px;
    z-index: 5;
    display: flex;
    justify-content: center;
}
</style>
