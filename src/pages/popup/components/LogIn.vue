<template>
  <form class="LogIn">
    <div class="title-row">
      <h1 class="title">Log In&ensp;<span class="subtitle">&bull;&ensp;Anime Skip<span></h1>
    </div>
    <TextInput class="flex row" leftIcon="img/ic-account.svg" hint="Username" autocomplete="username" />
    <TextInput class="flex row" leftIcon="img/ic-password.svg" hint="Password" autocomplete="current-password" type="password" />
    <p class="error-message row" v-if="isError">Username or password was incorrect</p>
    <div class="bottom-row">
      <input type="submit" value="Log In" class="clickable focus button">
      <a href="https://www.anime-skip.com/sign-up">Sign Up</a>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TextInput from '@Shared/components/TextInput.vue';

@Component({
  components: { TextInput },
})
export default class LogIn extends Vue {
  public isError: boolean = false;
}
</script>

<style lang="scss" scoped>
.LogIn {
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  .flex {
    flex: 1;
  }
  .title {
    color: $textPrimary;
    font-size: 22px;
    font-weight: 600;
  }
  .subtitle {
    color: $textSecondary;
    font-size: 22px;
    font-weight: 400;
  }
  .title-row {
    margin-bottom: 24px;
  }
  .bottom-row {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    padding-left: 12px;
  }
  .error-message {
    color: #EB5757;
  }
  .row {
    margin-bottom: 18px;
  }
  a {
    color: $textSecondary;
  }
}
</style>
