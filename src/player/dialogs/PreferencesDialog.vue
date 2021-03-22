<template>
  <BasicDialog
    name="PreferencesDialog"
    gravity-x="flex-end"
    gravity-y="flex-end"
    @show="loadPlayerOptions"
  >
    <template v-if="!hasActivePlayerGroup">
      <GeneralSettings small>
        <RaisedContainer
          v-for="optionGroup of playerOptions"
          :key="optionGroup.title"
          dark
          @click="setActiveOptionGroup(optionGroup)"
        >
          <div class="h-10 px-4 flex flex-row items-center text-left w-full space-x-4">
            <WebExtImg v-if="optionGroup.icon != null" :src="optionGroup.icon" class="left" />
            <p class="flex-1">{{ optionGroup.title }}</p>
            <p class="text-on-surface text-opacity-medium">
              {{ getSelectedOption(optionGroup) }}
            </p>
            <WebExtImg src="ic_chevron_right.svg" class="opacity-medium" />
          </div>
        </RaisedContainer>
        <RaisedButton dark @click="openExtensionOptions">
          <div class="flex justify-between w-full">
            <p class="remove-text body-1">All Settings</p>
          </div>
        </RaisedButton>
      </GeneralSettings>
      <SkippedSections two-columns />
    </template>
    <template v-else>
      <div
        class="flex flex-row items-center space-x-4 border-b border-on-surface border-opacity-divider"
      >
        <WebExtImg
          class="w-6 h-6"
          src="ic_chevron_left.svg"
          :draggable="false"
          @click="setActiveOptionGroup(undefined)"
        />
        <h6>{{ activePlayerGroup?.title }}</h6>
      </div>
      <div class="min-w-32 max-w-sm max-h-64 flex-1 flex flex-col">
        <ul
          v-for="option of activeOptions"
          :key="option.title"
          class="cursor-pointer"
          @click="onClickOption(option)"
        >
          <li class="flex flex-row items-center space-x-4 py-2">
            <Icon
              :path="getRadioIcon(option.isSelected)"
              :class="getRadioIconClass(option.isSelected)"
            />
            <p class="text-on-surface" :class="getLabelClass(option.isSelected)">
              {{ option.title }}
            </p>
          </li>
        </ul>
      </div>
    </template>
  </BasicDialog>
</template>

<script lang="ts">
import GeneralSettings from '@/common/components/GeneralSettings.vue';
import SkippedSections from '@/common/components/SkippedSections.vue';
import WebExtImg from '@/common/components/WebExtImg.vue';
import Messenger from '@/common/utils/Messenger';
import { computed, defineComponent, onMounted, ref } from 'vue';
import BasicDialog from './BasicDialog.vue';
import useRadioIcon from '@/common/composition/useRadioIcon';
import { useStore } from 'vuex';
import { ActionTypes } from '@/common/store/actionTypes';

export default defineComponent({
  components: {
    BasicDialog,
    GeneralSettings,
    SkippedSections,
    WebExtImg,
  },
  setup() {
    const store = useStore();

    const openExtensionOptions = () => {
      new Messenger<RuntimeMessageTypes>('General Settings').send(
        '@anime-skip/open-options',
        undefined
      );
    };
    const activePlayerGroup = ref<PlayerOptionGroup | undefined>();
    const hasActivePlayerGroup = computed(() => activePlayerGroup.value != null);
    const setActiveOptionGroup = (optionGroup: PlayerOptionGroup | undefined): void => {
      activePlayerGroup.value = optionGroup;
    };
    onMounted(() => setActiveOptionGroup(undefined));
    const getSelectedOption = (optionGroup: PlayerOptionGroup) => {
      const selected = optionGroup.options.filter(option => option.isSelected);
      if (selected.length === 0) return '';
      return selected[0].title;
    };
    const playerOptions = ref<PlayerOptionGroup[]>([]);
    const loadPlayerOptions = async () => {
      playerOptions.value =
        (await global.getPlayerOptions?.())?.filter(group => group.options.length > 1) ?? [];
    };

    const activeOptions = computed(() => activePlayerGroup.value?.options ?? []);
    const { getRadioIcon, getRadioIconClass, getLabelClass } = useRadioIcon();
    const onClickOption = (option: PlayerOption) => {
      option.node.click();
      store.dispatch(ActionTypes.SHOW_DIALOG, undefined);
      setActiveOptionGroup(undefined);
    };

    return {
      openExtensionOptions,

      loadPlayerOptions,
      activePlayerGroup,
      hasActivePlayerGroup,
      setActiveOptionGroup,
      getSelectedOption,
      playerOptions,

      activeOptions,
      getRadioIcon,
      getRadioIconClass,
      getLabelClass,
      onClickOption,
    };
  },
});
</script>

<style lang="scss">
@import '../../common/css/constants.scss';

#PreferencesDialog {
  padding-right: 16px;
  padding-bottom: $toolbarHeight + 4px + 8px;

  .dialog-root-container {
    max-height: 300px;
    max-width: 400px;
    & > * {
      padding: 14px 16px;
    }
  }
}

.opacity-100 {
  opacity: 1 !important;
}

.py-2 {
  padding: 0.5rem !important;
}

.min-w-32 {
  min-width: 16rem;
}
</style>
