import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import ky from 'ky';

reloadOnUpdate('pages/background');

type ApiResponse = {
  from: string;
  to: string;
  rate: string;
  bid: string;
  ask: string;
  currentDate: string;
};

// Get exchange rates.
const updateCurrentRate = async () => {
  try {
    console.log('update currentRate');
    const res = await ky
      .get(import.meta.env.VITE_API_ENDPOINT)
      .json<ApiResponse>();
    const currentRate = parseFloat(res.rate);
    await chrome.storage.local.set({ currentRate });
    console.log('currentRate:', currentRate);
  } catch (e) {
    console.log(e);
  }
};

chrome.webNavigation.onDOMContentLoaded.addListener(async () => {
  const item = await chrome.storage.local.get('updateTime');
  const diff = new Date().getTime() - (item.updateTime ?? 0);
  // Once every 30 minutes
  // console.debug(diff / 1000);
  if (diff / 1000 >= 1800) {
    await updateCurrentRate();
    await chrome.storage.local.set({ updateTime: new Date().getTime() });
  }
});

console.log('background script initialized.');
