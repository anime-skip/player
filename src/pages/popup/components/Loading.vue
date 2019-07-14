<template>
  <div class="Loading">
    <h1>Anime Skip</h1>
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
export default class Loading extends Vue {

}
</script>

<style lang="scss" scoped>
.Loading {
  
}
</style>
