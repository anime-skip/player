<script lang="ts" setup>
import { MyAccountFragment } from '../utils/api';
import ProfileImage from './ProfileImage.vue';
import IconMdiOpenInNew from '~icons/mdi/open-in-new';

const props = defineProps<{
  account: MyAccountFragment;
}>();
const joinedAgo = useTimeAgo(computed(() => props.account.createdAt));

const { value: auth } = useAuth();
</script>

<template>
  <div class="w-64">
    <div class="flex flex-col p-4 gap-4">
      <div class="flex gap-4 items-center" :title="`Joined ${joinedAgo}`">
        <profile-image class="w-12 h-12" />
        <div>
          <p
            class="text-base-content text-opacity-30 text-xs uppercase font-bold"
          >
            Anime Skip
          </p>
          <p class="text-lg truncate font-bold">{{ account.username }}</p>
        </div>
      </div>

      <p
        class="bg-neutral text-center p-2 text-sm text-neutral-content text-opacity-70 rounded"
      >
        Stats coming soon!
      </p>
    </div>

    <div class="h-px bg-base-content bg-opacity-20" />

    <ul class="menu menu-compact bg-base-100 w-full p-2 rounded-box">
      <li>
        <a href="https://anime-skip.com/account" target="_blank">
          <span class="flex-1">Account Settings</span>
          <icon-mdi-open-in-new class="w-4 h-4 opacity-50" />
        </a>
      </li>
      <li>
        <button @click="auth = null">Logout</button>
      </li>
    </ul>
  </div>
</template>
