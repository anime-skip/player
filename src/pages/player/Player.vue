<template>
  <div id="AnimeSkipPlayer">
    <Img src="img/logo.png"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Img from '@Shared/components/Img.vue';

@Component({
  components: {
    Img,
  },
})
export default class Player extends Vue {}
</script>

<style lang="scss">
#AnimeSkipPlayer {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
