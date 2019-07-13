const autoSkipEnabledCheckbox = document.getElementById('auto-skip-enabled') as HTMLInputElement;
const skipBrandCheckbox = document.getElementById('skip-brand') as HTMLInputElement;
const skipIntroCheckbox = document.getElementById('skip-intro') as HTMLInputElement;
const skipRecapCheckbox = document.getElementById('skip-recap') as HTMLInputElement;
const skipFillerCheckbox = document.getElementById('skip-filler') as HTMLInputElement;
const skipOutroCheckbox = document.getElementById('skip-outro') as HTMLInputElement;

var settings: any|undefined;

chrome.storage.sync.get('vrvSkip', (data: any) => {
  console.log(data);
  updateState(data['vrvSkip']);
});

function saveState() {
  const input: any = {};
  input['vrvSkip'] = settings;
  chrome.storage.sync.set(input, () => updateState(settings));
}

function updateState(newSettings: any) {
  console.log(settings);
  settings = newSettings;
  autoSkipEnabledCheckbox.checked = settings!.autoSkipEnabled;
  skipBrandCheckbox.checked = settings!.autoSkip.branding;
  skipIntroCheckbox.checked = settings!.autoSkip.intro;
  skipRecapCheckbox.checked = settings!.autoSkip.recap;
  skipFillerCheckbox.checked = settings!.autoSkip.filler;
  skipOutroCheckbox.checked = settings!.autoSkip.outro;
  
  skipBrandCheckbox.disabled = !settings!.autoSkipEnabled;
  skipIntroCheckbox.disabled = !settings!.autoSkipEnabled;
  skipRecapCheckbox.disabled = !settings!.autoSkipEnabled;
  skipFillerCheckbox.disabled = !settings!.autoSkipEnabled;
  skipOutroCheckbox.disabled = !settings!.autoSkipEnabled;
}

autoSkipEnabledCheckbox.addEventListener('click', () => {
  settings.autoSkipEnabled = autoSkipEnabledCheckbox.checked;
  saveState();
});

skipBrandCheckbox.addEventListener('click', () => {
  settings.autoSkip.branding = skipBrandCheckbox.checked;
  saveState();
});

skipIntroCheckbox.addEventListener('click', () => {
  settings.autoSkip.intro = skipIntroCheckbox.checked;
  saveState();
});

skipRecapCheckbox.addEventListener('click', () => {
  settings.autoSkip.recap = skipRecapCheckbox.checked;
  saveState();
});

skipFillerCheckbox.addEventListener('click', () => {
  settings.autoSkip.filler = skipFillerCheckbox.checked;
  saveState();
});

skipOutroCheckbox.addEventListener('click', () => {
  settings.autoSkip.outro = skipOutroCheckbox.checked;
  saveState();
});
