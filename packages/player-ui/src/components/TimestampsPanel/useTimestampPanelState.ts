import { createProvideInject } from 'common/src/utils/createProvideInject';

interface TimestampsPanelState {
  isEditingTemplate: boolean;
}

const {
  provideValue: provideTimestampsPanelState,
  useUpdate,
  useValue,
} = createProvideInject<TimestampsPanelState>('timestamps-panel', {
  isEditingTemplate: false,
});

export { provideTimestampsPanelState };

export function useIsEditingTemplate() {
  const value = useValue();
  return computed(() => value.isEditingTemplate);
}

export function useUpdateIsEditingTemplate() {
  const update = useUpdate();
  return (newIsEditingTemplate: boolean) => {
    update({ isEditingTemplate: newIsEditingTemplate });
  };
}
