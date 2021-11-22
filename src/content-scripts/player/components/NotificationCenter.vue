<template>
  <div id="notification-center" class="w-72 p-4 overflow-y-visible">
    <transition-group name="slide-left" tag="div" class="mb-4" :duration="500">
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
import {
  useDontShowStoreReviewPromptAgain,
  useStoreReviewPromptDate,
} from '~/common/state/store-review-prompt';
import { DAYS, MINUTES, SECOND, SECONDS, today } from '~/common/utils/time';
import UsageStats from '~/common/utils/UsageStats';
import Utils from '~/common/utils/Utils';
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

// Dev only stuff

const isDev = EXTENSION_MODE === 'dev' || EXTENSION_MODE === 'test';

const notifications = ref<Notification[]>([]);

function addDevNotification() {
  const id1 = randomStringId();
  const id2 = randomStringId();
  notifications.value.push(
    {
      id: id1,
      title: 'No buttons',
      message: 'This is the notification body',
      dismissAt: Date.now() + SECONDS(15),
      buttons: [],
    },
    {
      id: id2,
      title: 'Multiple buttons',
      message: 'Click the add button to add more of these test notifications',
      dismissAt: Date.now() + SECONDS(10),
      buttons: [
        {
          text: 'Add',
          onClick: () => {
            addDevNotification();
            addDevNotification();
          },
          primary: true,
        },
        {
          text: 'Dismiss',
          onClick: () => dismissNotificationById(id2),
        },
      ],
    }
  );
}

if (isDev) addDevNotification();

// Prompting for review

const { value: promptReviewAt, setValue: setPromptReviewAt } = useStoreReviewPromptDate();
const { value: dontshowReviewPromptAgain, setValue: setDontShowReviewPromptAgain } =
  useDontShowStoreReviewPromptAgain();

function addPromptReviewNotifications() {
  if (dontshowReviewPromptAgain.value) return;

  void UsageStats.saveEvent('prompt_store_review');
  // Setup the next notification if ignored
  setPromptReviewAt(today() + DAYS(3));
  notifications.value.push({
    id: randomStringId(),
    title: 'Enjoying Anime Skip?',
    message: 'Leave a rating! A higher rating means more users and more timestamps to skip 😊',
    dismissAt: Date.now() + MINUTES(20),
    buttons: [
      {
        text: 'Rate',
        primary: true,
        onClick() {
          void UsageStats.saveEvent('prompt_store_review_rate');
          // Links shorted by https://apk.rip
          window.open(TARGET_BROWSER === 'firefox' ? 'https://apk.rip/17' : 'https://apk.rip/1s');
          setDontShowReviewPromptAgain(true);
        },
      },
      {
        text: "Don't ask again",
        onClick() {
          void UsageStats.saveEvent('prompt_store_review_dont_ask_again');
          setDontShowReviewPromptAgain(true);
        },
      },
    ],
  });
}

// Managing Notifications

const now = useNow({ interval: SECOND });
watch(now, nextNow => {
  const ms = nextNow.getTime();

  // Remove notifications that should be dismissed
  notifications.value = notifications.value.filter(({ dismissAt }) => dismissAt > ms);

  // Add schedule based notifications
  if (promptReviewAt.value && promptReviewAt.value <= ms) addPromptReviewNotifications();
});

function dismissNotificationById(dismissedId: string) {
  notifications.value = notifications.value.filter(({ id }) => id !== dismissedId);
}
</script>

<style>
.slide-left-enter-active,
.slide-left-leave-active {
  @apply transform transition-transform duration-500;
}
.slide-left-enter,
.slide-left-leave-to {
  --tw-translate-x: 120%;
}
.slide-left-enter-to,
.slide-left-leave {
  @apply translate-x-0;
}
</style>
