chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "EN",
    title: "英語に翻訳",
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "JA",
    title: "日本語に翻訳",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (tab !== undefined) {
    switch (info.menuItemId) {
      case "EN":
        chrome.tabs.sendMessage(tab.id as number, {
          msg: "DeepL",
          data: {
            lang: "EN",
            text: info.selectionText,
          },
        });
        break;
      case "JA":
        chrome.tabs.sendMessage(tab.id as number, {
          msg: "DeepL",
          data: {
            lang: "JA",
            text: info.selectionText,
          },
        });
        break;
    }
  }
});
