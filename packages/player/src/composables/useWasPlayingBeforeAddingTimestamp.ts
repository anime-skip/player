/**
 * Global boolean for remember if the video was playing before adding a timestamp, so it can be
 * resumed after saving the timestamp.
 */
export default createGlobalState(() => ref(false));
