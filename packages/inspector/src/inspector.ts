import Browser from 'webextension-polyfill';
import debounce from 'lodash.debounce';

Browser.storage.onChanged.addListener(() => loadList());

const loadList = debounce(
  async () => {
    const list = document.getElementById('list')!;

    const stored = await Browser.storage.local.get();
    const items: HTMLButtonElement[] = [];
    for (const [url, html] of Object.entries(stored)) {
      const button = document.createElement('button');
      items.push(button);

      button.style.display = 'block';
      button.style.overflowX = 'hidden';
      button.innerText = url.substring(0, 100);
      button.onclick = () => {
        navigator.clipboard.writeText(html).catch(console.error);
      };
    }

    while (list.firstChild != null) list.removeChild(list.firstChild);
    for (const item of items) {
      list.appendChild(item);
    }
  },
  100,
  { trailing: true }
);

document.getElementById('clear')?.addEventListener('click', async () => {
  await Browser.storage.local.clear();
  setTimeout(loadList);
});
