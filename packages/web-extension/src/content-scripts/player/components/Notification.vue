<template>
  <div class="as-pb-4">
    <card :elevation="8" @click.stop>
      <div class="as-p-4 as-space-y-4 as-flex as-flex-col">
        <div class="as-flex as-flex-row as-items-start">
          <div class="as-flex-1 as-space-y-4">
            <p v-if="title" class="as-subtitle-1 as-text-on-surface as-font-semibold as-text-left">
              {{ title }}
            </p>
            <p class="as-body-2 as-text-on-surface as-text-opacity-high as-text-left">
              {{ message }}
            </p>
          </div>
          <div
            class="as-p-2 as-rounded-full as-select-none as-bg-on-surface as-bg-opacity-0 hover:as-bg-opacity-hover as-cursor-pointer as--mt-2 as--mr-2"
            title="Hide notification"
            @click="emit('dismiss-self')"
          >
            <WebExtImg class="as-w-6 as-h-6" src="ic_close.svg" :draggable="false" />
          </div>
        </div>
        <div v-if="buttons.length > 0" class="as-flex as-flex-row as-space-x-2 as-flex-wrap">
          <template v-for="button of buttons" :key="button.text">
            <raised-button
              v-if="button.primary"
              primary
              :transparent="!button.primary"
              @click="clickButton(button)"
            >
              {{ button.text }}
            </raised-button>
            <flat-button v-else transparent @click="clickButton(button)">
              {{ button.text }}
            </flat-button>
          </template>
        </div>
      </div>
    </card>
  </div>
</template>

<script lang="ts" setup>
export interface NotificationButton {
  text: string;
  onClick: () => void;
  primary?: boolean;
}

defineProps<{
  title?: string;
  message: string;
  buttons: NotificationButton[];
}>();

const emit = defineEmits<{
  (event: 'dismiss-self'): void;
}>();

function clickButton(button: NotificationButton) {
  emit('dismiss-self');
  button.onClick();
}
</script>
