chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "deepl",
    title: "DeepL",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (tab !== undefined) {
    switch (info.menuItemId) {
      case "deepl":
        chrome.tabs.sendMessage(tab.id as number, {
          msg: "deepl",
          data: {
            text: info.selectionText,
          },
        });
        break;
    }
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === "translation") {
    console.log(request.text);
  }
});
