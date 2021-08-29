<template>
  <div class="p-4 space-y-4">
    <AutocompleteTextInput
      ref="showName"
      class="horizontal-margin"
      placeholder="Show name"
      v-model:value="show"
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
      <TextInput label="Season" v-model:value="season" @submit="onClickCreate" />
      <TextInput label="Number in Season" v-model:value="number" @submit="onClickCreate" />
      <TextInput label="Watch Order" v-model:value="absoluteNumber" @submit="onClickCreate" />
    </div>
    <div class="flex flex-row-reverse justify-between pt-2">
      <RaisedButton :disabled="isCreateDisabled" @click.stop.prevent="onClickCreate">
        {{ createButtonText }}
      </RaisedButton>
      <FlatButton transparent @click.stop.prevent="hideDialog">Cancel</FlatButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CreateEpisodePrefill } from '~/@types';
import { useShowAutocomplete } from '../../hooks/useShowAutocomplete';
import { useHideDialog } from '../../state/useDialogState';

export default defineComponent({
  props: {
    prefill: { type: Object as PropType<CreateEpisodePrefill>, default: undefined },
  },
  setup() {
    const showAutocomplete = useShowAutocomplete(ref());
    const hideDialog = useHideDialog();
    return {
      ...showAutocomplete,
      hideDialog,
    };
  },
  data() {
    return {
      show: this.prefill?.show || {
        title: '',
      },
      name: this.prefill?.episode?.title ?? '',
      number: this.prefill?.number ?? '',
      absoluteNumber: this.prefill?.absoluteNumber ?? '',
      season: this.prefill?.season ?? '',
    };
  },
  mounted(): void {
    (this.$refs.showName as TextInputRef | null)?.focus();
  },
  computed: {
    createButtonText(): string {
      if (this.show.data == null) {
        return 'Create Show & Episode';
      }
      return 'Create Episode';
    },
    isCreateDisabled(): boolean {
      return this.show.title.trim() === '' || this.name.trim() === '';
    },
  },
  methods: {
    async onClickCreate(): Promise<void> {
      // TODO-REQ
      // const url = this.$store.state.tabUrl;
      // if (url == null) {
      //   throw new Error("Cannot create an episode without it's URL");
      // }
      // const duration = this.$store.state.playerState.duration;
      // const episode: Api.InputEpisode = {
      //   name: this.name.trim() || undefined,
      //   season: this.season.trim() || undefined,
      //   number: this.number.trim() || undefined,
      //   absoluteNumber: this.absoluteNumber.trim() || undefined,
      //   baseDuration: duration,
      // };
      // const episodeUrl: Api.InputEpisodeUrl = {
      //   url,
      //   duration,
      //   timestampsOffset: 0,
      // };
      //
      // const payload: CreateEpisodeDataPayload = {
      //   show:
      //     this.show.data == null
      //       ? {
      //           create: true,
      //           name: this.show.title,
      //         }
      //       : {
      //           create: false,
      //           showId: this.show.data.id,
      //         },
      //   episode: {
      //     create: true,
      //     data: episode,
      //   },
      //   episodeUrl: {
      //     create: true,
      //     data: episodeUrl,
      //   },
      // };
      // await this.$store.dispatch(ActionTypes.CREATE_EPISODE_DATA, payload);
      //
      // await this.hideDialog();
    },
  },
});
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
