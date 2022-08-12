export default function useRadioIcon() {
  return {
    getRadioIconClass(isSelected: boolean): Record<string, boolean> {
      return {
        'as-fill-secondary as-opacity-100 !important': isSelected,
        'as-opacity-medium !important': !isSelected,
      };
    },
    getLabelClass(isSelected: boolean): Record<string, boolean> {
      return {
        'as-text-opacity-100': isSelected,
        'as-text-opacity-medium': !isSelected,
      };
    },
  };
}
