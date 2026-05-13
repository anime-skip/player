<script lang="ts" setup>
const { showName, episodeName, season, number, absoluteNumber } =
  useEditEpisodeForm();

const episodeUrl = useApiEpisodeUrl();

const expanded = ref(false);
</script>

<template>
  <form class="flex flex-col gap-2 p-4" @submit.prevent.stop>
    <label
      v-if="!episodeUrl"
      class="input-group"
      title="The name of the show the episode belongs to."
    >
      <span class="w-32 justify-center">Show</span>
      <input
        class="input input-bordered input-sm w-full focus:input-primary"
        :class="{ 'input-error focus:input-error': !showName.trim() }"
        v-model="showName"
        @keydown.stop
      />
    </label>
    <label class="input-group" title="The name of the episode.">
      <span class="w-32 justify-center">Episode</span>
      <input
        class="input input-bordered input-sm w-full focus:input-primary"
        :class="{ 'input-error focus:input-error': !episodeName.trim() }"
        v-model="episodeName"
        @keydown.stop
      />
    </label>
    <label
      v-if="expanded"
      class="input-group"
      title="Optional. The season the episode belongs to."
    >
      <span class="w-32 justify-center">Season</span>
      <input
        class="input input-bordered input-sm w-full focus:input-primary"
        v-model="season"
        @keydown.stop
      />
    </label>

    <label
      v-if="expanded"
      class="input-group"
      title="Optional. The episode number into this season. Ex: 'Tokyo Ghoul, Season 3, episode 7'"
    >
      <span class="w-32 justify-center">#</span>
      <input
        class="input input-bordered input-sm w-full focus:input-primary"
        v-model="number"
        @keydown.stop
      />
    </label>
    <label
      v-if="expanded"
      class="input-group"
      title="Optional. The episode number from the start of the entire show, ignoring the season. Ex: 'Naruto, episode 598'."
    >
      <span class="w-32 justify-center">ABS #</span>
      <input
        class="input input-bordered input-sm w-full focus:input-primary"
        v-model="absoluteNumber"
        @keydown.stop
      />
    </label>

    <button
      class="link link-hover flex gap-2 self-end text-xs hover:link-primary"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'Less...' : 'More...' }}
    </button>
  </form>
</template>
