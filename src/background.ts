import translate from "deepl";
import { getBucket } from "@extend-chrome/storage";

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
                // await chrome.scripting.executeScript({
                //     target: { tabId: tab.id as number },
                //     func: translateText,
                //     args: [info.selectionText ?? ""],
                // });
                chrome.tabs.sendMessage(tab.id as number, {
                  msg: "deepl",
                  data: {
                    text: info.selectionText,
                  }});
                chrome.runtime.sendMessage({
              msg: "deepl",
              data: {
                text: info.selectionText,
              },
            });
                break;
        }
    }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if (request.msg === "translation") {
          console.log(request.text)
      }
  }
);