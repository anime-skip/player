<script lang="ts" setup>
import IconMdiOpenInNew from '~icons/mdi/open-in-new';

import { MyAccountFragment } from '../utils/api';
import ProfileImage from './ProfileImage.vue';

const props = defineProps<{
  account: MyAccountFragment;
}>();
const joinedAgo = useTimeAgo(computed(() => props.account.createdAt));

const { state: auth } = useAuth();
</script>

<template>
  <div class="w-64">
    <div class="flex flex-col gap-4 p-4">
      <div class="flex items-center gap-4" :title="`Joined ${joinedAgo}`">
        <profile-image class="h-12 w-12" />
        <div>
          <p
            class="-mb-1 text-xs font-bold uppercase text-base-content text-opacity-30"
          >
            Anime Skip
          </p>
          <p class="truncate text-lg font-bold">{{ account.username }}</p>
        </div>
      </div>

      <!-- <p
        class="bg-neutral text-center p-2 text-sm text-neutral-content text-opacity-70 rounded"
      >
        Stats coming soon!
      </p> -->
    </div>

    <div class="h-px bg-base-content bg-opacity-20" />

    <ul class="menu rounded-box menu-compact w-full bg-base-100 p-2">
      <li>
        <a href="https://anime-skip.com/account" target="_blank">
          <span class="flex-1">Account Settings</span>
          <icon-mdi-open-in-new class="h-4 w-4 opacity-50" />
        </a>
      </li>
      <li>
        <button @click="auth = null">Logout</button>
      </li>
    </ul>
  </div>
</template>
