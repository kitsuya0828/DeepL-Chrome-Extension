chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'deepl',
    title: 'DeepL',
    contexts: ['all'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'deepl':
      chrome.scripting.executeScript({
        target: { tabId: tab?.id as number },
        func: translate,
      });
      break;
    default:
      console.log('Default');
  }
});

export const translate = () => {
  console.log('Hello World');
}
