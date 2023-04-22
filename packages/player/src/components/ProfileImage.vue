<script lang="ts" setup>
import IconAccount from '~icons/anime-skip/account';

const { value: auth } = useAuth();
</script>

<template>
  <div class="flex bg-base-content rounded-full">
    <img
      class="w-full h-full rounded-full overflow-hidden"
      v-if="auth?.account"
      :src="auth.account.profileUrl"
    />
    <icon-account v-else class="m-auto" />
  </div>
</template>
