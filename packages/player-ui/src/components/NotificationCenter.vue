<template>
  <div id="notification-center" class="as-w-72 as-p-4 as-overflow-y-visible">
    <transition-group name="as-slide-left" tag="div" class="as-mb-4" :duration="500">
      <notification
        v-for="notification in notifications"
        :key="notification.id"
        :title="notification.title"
        :message="notification.message"
        :buttons="notification.buttons"
        @dismiss-self="dismissNotificationById(notification.id)"
      />
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import { useNow } from '@vueuse/core';
import Utils from 'common/src/utils/GeneralUtils';
import { DAYS, MINUTES, SECOND, today } from 'common/src/utils/time';
import { usePlayerConfig } from '../composables/usePlayerConfig';
import { useReviewPromptStore } from '../stores/useReviewPromptStore';
import { NotificationButton } from './Notification.vue';

interface Notification {
  id: string;
  title: string;
  message: string;
  dismissAt: number;
  buttons: NotificationButton[];
}

function randomStringId(): string {
  return `${Utils.randomId()}`;
}

const notifications = ref<Notification[]>([]);

// Prompting for review

function isFirefox(): boolean {
  return navigator.userAgent.includes('Firefox');
}

const { usageClient } = usePlayerConfig();

const reviewPrompt = useReviewPromptStore();

watch(
  () => reviewPrompt.shouldShow,
  shouldShow => {
    if (shouldShow) addPromptReviewNotifications();
  }
);

function addPromptReviewNotifications() {
  if (!reviewPrompt.shouldShow) return;

  void usageClient.saveEvent('prompt_store_review');
  addNotification({
    id: randomStringId(),
    title: 'Enjoying Anime Skip?',
    message: 'Leave a rating! A higher rating means more users and more timestamps to skip 😊',
    dismissAt: Date.now() + MINUTES(20),
    buttons: [
      {
        text: 'Rate',
        primary: true,
        onClick() {
          void usageClient.saveEvent('prompt_store_review_rate');
          reviewPrompt.neverShowAgain = true;
          window.open(
            isFirefox()
              ? 'https://addons.mozilla.org/en-US/firefox/addon/anime-skip/?utm_source=extension&utm_medium=review-prompt'
              : 'https://chrome.google.com/webstore/detail/mgmdkjcljneegjfajchedjpdhbadklcf/reviews'
          );
        },
      },
      {
        text: "Don't ask again",
        onClick() {
          void usageClient.saveEvent('prompt_store_review_dont_ask_again');
          reviewPrompt.neverShowAgain = true;
        },
      },
    ],
  });

  reviewPrompt.showAgainInFuture();
}

// Managing Notifications

function dismissNotificationById(dismissedId: string) {
  notifications.value = notifications.value.filter(({ id }) => id !== dismissedId);
}

const mounted = ref(false);
onMounted(() => {
  mounted.value = true;
});
onUnmounted(() => {
  mounted.value = false;
});

/**
 * Add the notification with a delay so if it is loaded on mount, it still gets animated in
 */
function addNotification(notification: Notification) {
  setTimeout(() => notifications.value.push(notification), SECOND);
}
</script>

<style scoped>
.as-slide-left-enter-active,
.as-slide-left-leave-active {
  transition: transform ease-out 500ms;
}

.as-slide-left-enter-from,
.as-slide-left-leave-to {
  transform: translateX(120%);
}

.as-slide-left-enter-to,
.as-slide-left-leave-from {
  transform: translateX(0%);
}
</style>
