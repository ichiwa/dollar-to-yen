/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */
import('./components/App');

const initialize = () => {
  // chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  //   if (message.type === 'translate') {
  //     console.log(message);
  //     sendResponse('ok');
  //   }
  // });

  try {
    // console.log('content script loaded');
  } catch (e) {
    console.error(e);
  }
};

initialize();
