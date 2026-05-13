<script lang="ts" setup>
import AccountMenu from './AccountMenu.vue';
import LoginForm from './LoginForm.vue';
import ProfileImage from './ProfileImage.vue';
import ToolbarModal from './ToolbarModal.vue';

const { state: auth } = useAuth();

const loginCompleted = useViewOperationCompleted('account');
</script>

<template>
  <toolbar-modal view="account">
    <!-- Button -->
    <template #button="{ toggle }">
      <div class="tooltip" data-tip="Account" @click="toggle">
        <profile-image
          class="m-[11px] h-[28px] w-[28px] cursor-pointer text-base-100 ring-0 ring-base-content ring-opacity-30 transition-all hover:ring-4 active:text-opacity-70 active:ring-2"
        />
      </div>
    </template>

    <!-- Modal -->
    <template #modal>
      <account-menu v-if="auth" :account="auth.account" />
      <login-form v-else class="w-80 p-4" @logged-in="loginCompleted" />
    </template>
  </toolbar-modal>
</template>
