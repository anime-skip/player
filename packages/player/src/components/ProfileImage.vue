<script lang="ts" setup>
import IconAccount from '~icons/anime-skip/account';

const { state: auth } = useAuth();

const defaultUrl =
  'https://assets.aws.anime-skip.com/images/simple-profile/128.png';
</script>

<template>
  <div
    class="flex rounded-full overflow-hidden"
    :class="{
      'bg-base-content': !auth,
    }"
  >
    <img
      class="w-full h-full"
      v-if="auth?.account"
      :src="auth.account.profileUrl || defaultUrl"
    />
    <icon-account v-else class="m-auto" />
  </div>
</template>
