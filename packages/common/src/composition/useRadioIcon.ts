export function useRadioIcon() {
  return {
    getRadioIcon(isSelected: boolean): string {
      return isSelected
        ? 'M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z'
        : 'M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z';
    },
    getRadioIconClass(isSelected: boolean): Record<string, boolean> {
      return {
        'as-fill-secondary as-opacity-100 !important': isSelected,
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
