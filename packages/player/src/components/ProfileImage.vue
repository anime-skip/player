<script lang="ts" setup>
import IconAccount from '~icons/anime-skip/account';

const { state: auth } = useAuth();

const defaultUrl =
  'https://assets.aws.anime-skip.com/images/simple-profile/128.png';
</script>

<template>
  <div
    class="flex overflow-hidden rounded-full"
    :class="{
      'bg-base-content': !auth,
    }"
  >
    <img
      class="h-full w-full"
      v-if="auth?.account"
      :src="auth.account.profileUrl || defaultUrl"
    />
    <icon-account v-else class="m-auto" />
  </div>
</template>
