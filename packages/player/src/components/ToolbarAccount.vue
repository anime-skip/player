<script lang="ts" setup>
import ToolbarModal from './ToolbarModal.vue';
import LoginForm from './LoginForm.vue';
import ProfileImage from './ProfileImage.vue';
import AccountMenu from './AccountMenu.vue';

const { state: auth } = useAuth();

const loginCompleted = useViewOperationCompleted('account');
</script>

<template>
  <toolbar-modal view="account">
    <!-- Button -->
    <template #button="{ toggle }">
      <div class="tooltip" data-tip="Account" @click="toggle">
        <profile-image
          class="w-[28px] h-[28px] m-[11px] cursor-pointer transition-all ring-base-content text-base-100 active:text-opacity-70 ring-opacity-30 ring-0 hover:ring-4 active:ring-2"
        />
      </div>
    </template>

    <!-- Modal -->
    <template #modal>
      <account-menu v-if="auth" :account="auth.account" />
      <login-form v-else class="p-4 w-80" @logged-in="loginCompleted" />
    </template>
  </toolbar-modal>
</template>
