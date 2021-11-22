<template>
  <div class="pb-4">
    <card :elevation="8" @click.stop>
      <div class="p-4 space-y-4 flex flex-col">
        <div class="flex flex-row items-start">
          <div class="flex-1 space-y-4">
            <p v-if="title" class="subtitle-1 text-on-surface font-semibold text-left">
              {{ title }}
            </p>
            <p class="body-2 text-on-surface text-opacity-high text-left">{{ message }}</p>
          </div>
          <div
            class="
              p-2
              rounded-full
              select-none
              bg-on-surface bg-opacity-0
              hover:bg-opacity-hover
              cursor-pointer
              -mt-2
              -mr-2
            "
            title="Hide notification"
            @click="emit('dismiss-self')"
          >
            <WebExtImg class="w-6 h-6" src="ic_close.svg" :draggable="false" />
          </div>
        </div>
        <div v-if="buttons.length > 0" class="flex flex-row space-x-2 flex-wrap">
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
