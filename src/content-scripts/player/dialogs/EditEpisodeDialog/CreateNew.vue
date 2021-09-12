<template>
  <div class="p-4 space-y-4">
    <AutocompleteTextInput
      ref="showNameInput"
      class="horizontal-margin"
      placeholder="Show name"
      v-model:value="showItem"
      :options="showOptions"
      @select="onSelectShow"
      @search="searchShows"
    />
    <TextInput
      class="row"
      placeholder="Episode name"
      v-model:value="name"
      @submit="onClickCreate"
    />
    <div class="flex flex-row space-x-4">
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
    <div class="flex flex-row-reverse justify-between pt-2">
      <RaisedButton :disabled="isCreateDisabled" @click.stop.prevent="onClickCreate">
        {{ createButtonText }}
      </RaisedButton>
      <FlatButton transparent @click.stop.prevent="hideDialog">Cancel</FlatButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CreateEpisodePrefill } from '~/@types';
import * as Api from '~api';
import { useCreateEpisodeData } from '../../hooks/useCreateEpisodeData';
import { useShowAutocomplete } from '../../hooks/useShowAutocomplete';
import { useTabUrl } from '../../hooks/useTabUrl';
import { useHideDialog } from '../../state/useDialogState';
import { useDuration } from '../../state/useVideoState';

const props = defineProps<{
  prefill: CreateEpisodePrefill;
}>();

console.log('Prefill', JSON.parse(JSON.stringify(props.prefill)));

const {
  showItem,
  show: selectedShow,
  showOptions,
  onSelectShow,
  searchShows,
} = useShowAutocomplete(props.prefill.show, ref());

const hideDialog = useHideDialog();

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

const tabUrl = useTabUrl();
const createEpisodeData = useCreateEpisodeData();
const durationRef = useDuration();
async function onClickCreate(): Promise<void> {
  const url = tabUrl.value;
  if (url == null) {
    throw new Error("Cannot create an episode without it's URL");
  }
  const duration = durationRef.value;
  const episode: Api.InputEpisode = {
    name: name.value.trim() || undefined,
    season: season.value.trim() || undefined,
    number: number.value.trim() || undefined,
    absoluteNumber: absoluteNumber.value.trim() || undefined,
    baseDuration: duration,
  };
  const episodeUrl: Api.InputEpisodeUrl = {
    url,
    duration,
    timestampsOffset: 0,
  };

  await createEpisodeData({
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
  });

  hideDialog();
}
</script>

<style lang="scss" scoped>
.CreateNew {
  padding: 16px;

  .row {
    margin-top: 12px;
  }

  .input-row {
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

  .buttons {
    display: flex;
    flex-direction: row-reverse;

    button {
      margin-left: 16px;
    }
  }
}
</style>
