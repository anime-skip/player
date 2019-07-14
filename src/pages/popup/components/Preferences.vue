<template>
  <div class="Preferences">
    <h1>Preferences</h1>
    <h2>Anime Skip</h2>
    <TextInput label="Username" />
    <TextInput label="Password" />
    <div>
        <button>Sign Up</button>
        <button>Log In</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TextInput from '@Shared/components/TextInput.vue';

@Component({
    components: { TextInput },
})
export default class Preferences extends Vue {

}
</script>

<style lang="scss" scoped>
.Preferences {
  
}
</style>
