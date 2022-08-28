<template>
  <div class="as-p-4 as-space-y-4">
    <AutocompleteTextInput
      ref="showNameInput"
      class="as-horizontal-margin"
      placeholder="Show name"
      v-model:value="showItem"
      :options="showOptions"
      @select="onSelectShow"
      @search="searchShows"
    />
    <TextInput
      class="as-row"
      placeholder="Episode name"
      v-model:value="name"
      @submit="onClickCreate"
    />
    <div class="as-flex as-flex-row as-space-x-4">
      <TextInput label="Season" placeholder="" v-model:value="season" @submit="onClickCreate" />
      <TextInput
        label="Number in Season"
        placeholder=""
        v-model:value="number"
        @submit="onClickCreate"
      />
      <TextInput
        label="Watch Order"
        placeholder=""
        v-model:value="absoluteNumber"
        @submit="onClickCreate"
      />
    </div>
    <div class="as-flex as-flex-row-reverse as-justify-between as-pt-2">
      <RaisedButton :disabled="isCreateDisabled" @click.stop.prevent="onClickCreate">
        {{ createButtonText }}
      </RaisedButton>
      <FlatButton transparent @click.stop.prevent="dialogs.hideDialog()">Cancel</FlatButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CreateEpisodePrefill } from '../../@types';
import { useConnectEpisodeAggregateMutation } from '../../composables/useConnectEpisodeAggregateMutation';
import { useShowAutocomplete } from '../../composables/useShowAutocomplete';
import * as Api from 'common/src/api';
import { TextInputRef } from 'common/src/types';
import { useDialogStore } from '../../state/stores/useDialogStore';
import { useTabUrlStore } from '../../state/stores/useTabUrlStore';
import { storeToRefs } from 'pinia';
import { useVideoStateStore } from '../../state/stores/useVideoStateStore';

const props = defineProps<{
  prefill: CreateEpisodePrefill;
}>();

const dialogs = useDialogStore();
const { url } = storeToRefs(useTabUrlStore());
const videoState = useVideoStateStore();

const {
  showItem,
  show: selectedShow,
  showOptions,
  onSelectShow,
  searchShows,
} = useShowAutocomplete(props.prefill.show, ref());

const showNameInput = ref<TextInputRef>();

const name = ref(props.prefill.episode?.title ?? '');
const number = ref(props.prefill.number ?? '');
const absoluteNumber = ref(props.prefill.absoluteNumber ?? '');
const season = ref(props.prefill.season ?? '');

onMounted(() => {
  showNameInput.value?.focus();
});

const createButtonText = computed(() =>
  selectedShow.value == null ? 'Create Show & Episode' : 'Create Episode'
);
const isCreateDisabled = computed<boolean>(() => {
  return showItem.value.title.trim() === '' || name.value.trim() === '';
});

const connectEpisode = useConnectEpisodeAggregateMutation();
async function onClickCreate(): Promise<void> {
  if (url.value == null) {
    throw new Error("Cannot create an episode without it's URL");
  }
  const episode: Api.InputEpisode = {
    name: name.value.trim() || undefined,
    season: season.value.trim() || undefined,
    number: number.value.trim() || undefined,
    absoluteNumber: absoluteNumber.value.trim() || undefined,
    baseDuration: videoState.duration,
  };
  const episodeUrl: Api.InputEpisodeUrl = {
    url: url.value,
    duration: videoState.duration,
    timestampsOffset: 0,
  };

  await connectEpisode.mutateAsync({
    show:
      showItem.value.data == null
        ? {
            create: true,
            name: showItem.value.title,
          }
        : {
            create: false,
            showId: showItem.value.data.id,
          },
    episode: {
      create: true,
      data: episode,
    },
    episodeUrl: {
      create: true,
      data: episodeUrl,
    },
    // TODO[state]: Still pass the initialTimestamps based on the matching template timestamps
  });

  dialogs.hideDialog();
}
</script>

<style lang="scss" scoped>
// TODO: Tailwindify

.CreateNew {
  padding: 16px;

  .as-row {
    margin-top: 12px;
  }

  .as-input-row {
    display: flex;
    flex-direction: row;
    & > * {
      flex: 1;
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    }
  }

  .as-buttons {
    display: flex;
    flex-direction: row-reverse;

    button {
      margin-left: 16px;
    }
  }
}
</style>
