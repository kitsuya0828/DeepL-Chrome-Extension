import { getBucket } from "@extend-chrome/storage";
import translate from "deepl";

interface MyBucket {
  AUTH_KEY: string;
}

const bucket = getBucket<MyBucket>("my-bucket", "sync");

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.msg === "deepl") {
    const value = await bucket.get();
    await translate({
      text: request.data.text,
      target_lang: "EN",
      auth_key: value.AUTH_KEY,
      free_api: true,
    })
      .then((result) => {
        console.log(result.data.translations[0].text);
        alert(result.data.translations[0].text);
      })
      .catch((error) => {
        alert(error);
      });
  }
});
