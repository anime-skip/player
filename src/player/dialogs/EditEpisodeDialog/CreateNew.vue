<template>
  <div class="CreateNew">
    <AutocompleteTextInput
      class="horizontal-margin"
      label="Show Name"
      v-model="show"
      :options="showOptions"
      @select="onSelectShow"
      @search="searchShows"
    />
    <TextInput class="row" label="Episode Name" v-model="name" @submit="onClickCreate" />
    <div class="row input-row">
      <TextInput label="Season" v-model="season" @submit="onClickCreate" />
      <TextInput label="Number in Season" v-model="number" @submit="onClickCreate" />
      <TextInput label="Overall Number" v-model="absoluteNumber" @submit="onClickCreate" />
    </div>
    <div class="row buttons">
      <button
        class="button clickable"
        :class="{ disabled: isCreateDisabled }"
        :disabled="isCreateDisabled"
        @click.stop.prevent="onClickCreate"
      >
        {{ createButtonText }}
      </button>
      <button class="button clickable dark" @click.stop.prevent="hideDialog">Cancel</button>
    </div>
  </div>
</template>

<script lang="ts">
import vueMixins from 'vue-typed-mixins';
import ShowAutocompleteMixin from '@/common/mixins/ShowAutocomplete';
import AutocompleteTextInput from '@/common/components/AutocompleteTextInput.vue';
import TextInput from '@/common/components/TextInput.vue';
import { PropOptions } from 'vue';
import actionTypes from '@/common/store/actionTypes';

export default vueMixins(ShowAutocompleteMixin).extend({
  components: { AutocompleteTextInput, TextInput },
  props: {
    prefill: { type: Object, required: false } as PropOptions<CreateEpisodePrefill | undefined>,
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
    hideDialog(): void {
      this.$store.dispatch(actionTypes.showDialog, undefined);
    },
    async onClickCreate(): Promise<void> {
      const duration = this.$store.state.duration;
      const episode: Api.InputEpisode = {
        name: this.name.trim() || undefined,
        season: this.season.trim() || undefined,
        number: this.number.trim() || undefined,
        absoluteNumber: this.absoluteNumber.trim() || undefined,
        baseDuration: duration,
      };
      const episodeUrl: Api.InputEpisodeUrl = {
        url: this.$store.state.tabUrl,
        duration,
        timestampsOffset: 0,
      };

      const payload: CreateEpisodeDataPayload = {
        show:
          this.show.data == null
            ? {
                create: true,
                name: this.show.title,
              }
            : {
                create: false,
                showId: this.show.data.id,
              },
        episode: {
          create: true,
          data: episode,
        },
        episodeUrl: {
          create: true,
          data: episodeUrl,
        },
      };
      await this.$store.dispatch(actionTypes.createEpisodeData, payload);

      this.hideDialog();
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
