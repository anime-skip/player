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
import {
  useDontShowStoreReviewPromptAgain,
  useStoreReviewPromptDate,
} from '~/common/state/store-review-prompt';
import UsageStats from '~/common/utils/UsageStats';
import Utils from '~utils/GeneralUtils';
import { DAYS, MINUTES, SECOND, SECONDS, today } from '~utils/time';
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
  addNotification({
    id: id1,
    title: 'No buttons',
    message: 'This is the notification body',
    dismissAt: Date.now() + SECONDS(15),
    buttons: [],
  });
  addNotification({
    id: id2,
    title: 'Multiple buttons',
    message: 'Click the add button to add more of these test notifications',
    dismissAt: Date.now() + SECONDS(10),
    buttons: [
      {
        text: 'Add',
        onClick: () =>
          setTimeout(() => {
            addDevNotification();
            addDevNotification();
          }, SECONDS(2)),
        primary: true,
      },
      {
        text: 'Dismiss',
        onClick: () => dismissNotificationById(id2),
      },
    ],
  });
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
          void UsageStats.saveEvent('prompt_store_review_rate');
          setDontShowReviewPromptAgain(true);
          window.open(
            TARGET_BROWSER === 'firefox'
              ? 'https://addons.mozilla.org/en-US/firefox/addon/anime-skip/?utm_source=extension&utm_medium=review-prompt'
              : 'https://chrome.google.com/webstore/detail/mgmdkjcljneegjfajchedjpdhbadklcf/reviews'
          );
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
  // notifications.value = notifications.value.filter(({ dismissAt }) => dismissAt > ms);

  // Add schedule based notifications
  if (promptReviewAt.value && promptReviewAt.value <= ms) addPromptReviewNotifications();
});

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
 * Add it with a delay so if it is loaded on mount, it still gets animated
 */
function addNotification(notificaiton: Notification) {
  setTimeout(() => notifications.value.push(notificaiton), SECOND);
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
