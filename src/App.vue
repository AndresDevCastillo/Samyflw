<template>
  <router-view></router-view>
</template>
<style>
@font-face {
  font-family: 'planet-gamers';
  src: url('/assets/fonts/Planet-Gamers/Planet-Gamers.otf');
  src: url('/assets/fonts/Planet-Gamers/Planet-Gamers.woff');
}

.font-gamers {
  font-family: 'planet-gamers' !important;
}

.color-blue {
  color: #69C9D0 !important;
}

.color-rojo {
  color: #EE1D52 !important;
}

.color-verde {
  color: #25E007 !important;
}

.text-shadow-green {
  color: #25E007 !important;
  text-shadow: -1px 2px 9px #25E007;
}

.text-shadow-red {
  color: #EE1D52 !important;
  text-shadow: -1px 2px 9px #EE1D52;
}

html,
body,
* {
  scroll-behavior: smooth;
}

.evento .text-inline-evento .p-inline-message-text {
  font-size: 3rem;
}

.app {
  background-color: #000000 !important;
}
</style>
