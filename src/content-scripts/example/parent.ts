import setupParent from '../setupParent';

setupParent('example', {
  getEpisodeInfo() {
    return {
      name: (document.getElementById('episode') as HTMLSpanElement | undefined)?.innerText,
      number: (document.getElementById('number') as HTMLSpanElement | undefined)?.innerText,
      absoluteNumber: (document.getElementById('absolute-number') as HTMLSpanElement | undefined)
        ?.innerText,
      season: (document.getElementById('season') as HTMLSpanElement | undefined)?.innerText,
      show: (document.getElementById('show') as HTMLSpanElement | undefined)?.innerText,
    };
  },
});
