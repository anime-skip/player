import { defineStore } from 'pinia';

export const HIDE_SERVICE_UI_CLASS = 'hide-for-anime-skip';

export const usePlayerVisibilityStore = defineStore('player-visibility', () => {
  const animeSkipUi = ref(true);
  const serviceUi = ref(false);

  // Actually show and hide the service's UI by toggling a class
  watch(serviceUi, isVisible => {
    if (isVisible) document.body.classList.remove(HIDE_SERVICE_UI_CLASS);
    else document.body.classList.add(HIDE_SERVICE_UI_CLASS);
  });

  // The Player UI is toggled from the root `Player.vue` component, nothing here

  return {
    animeSkipUi,
    serviceUi,
  };
});
