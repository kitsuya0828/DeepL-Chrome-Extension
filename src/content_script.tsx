import React from "react";
import ReactDOM from "react-dom";
import { getBucket } from "@extend-chrome/storage";
import translate from "deepl";

// console.log(document.querySelectorAll('[class^="FPdoLc"]'))
// document.querySelectorAll('[class^="FPdoLc"]')[0].innerHTML = '<center> <input class="gNO89b" style="color: white; background-color: red;" value="Yahoo! 検索" aria-label="Yahoo! 検索" name="btnK" role="button" tabindex="0" type="submit" data-ved="0ahUKEwiGl9DP0Pj8AhVJk1YBHU57DNIQ4dUDCA8">  <input id="gbqfbb" value="I&#39;m Feeling Lucky" aria-label="I&#39;m Feeling Lucky" name="btnI" role="button" tabindex="0" type="submit" data-ved="0ahUKEwiGl9DP0Pj8AhVJk1YBHU57DNIQnRsIEA"> </center>';

interface MyBucket {
    AUTH_KEY: string;
    X: number;
    Y: number;
}

const bucket = getBucket<MyBucket>("my-bucket", "sync");

// window.addEventListener('load', function(){
//   document.addEventListener('select', (event: MouseEvent) => bucket.set({ START_X: event.clientX, START_Y: event.clientY }));
// });

document.addEventListener("mouseup", handlerFunction, false);

// Mouse up event handler function
function handlerFunction(event: MouseEvent) {
    if (document.getElementById("deepl") !== null) {
        document.getElementById("deepl")?.remove();
    }

    if (document.getSelection()!.toString().length > 0) {
        // // Get selected text and encode it
        // const selection = encodeURIComponent(window.getSelection()!.toString()).replace(/[!'()*]/g, escape);
        // Find out how much (if any) user has scrolled
        // var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        // Get cursor position
        // const posX = event.clientX;
        // const posY = event.clientY ;
        console.log(event.clientX, event.clientY);
        bucket.set({ X: event.clientX, Y: event.clientY });
    }
}

chrome.runtime.onMessage.addListener(async function (
    request,
    sender,
    sendResponse
) {
    if (request.msg === "DeepL") {
        const value = await bucket.get();
        await translate({
            text: request.data.text,
            target_lang: request.data.lang,
            auth_key: value.AUTH_KEY,
            free_api: true,
        })
            .then((result) => {
                // console.log(result.data.translations[0].text);
                // alert(result.data.translations[0].text);

                const app = document.createElement("div");
                console.log(value.X, value.Y, "render");
                app.id = "deepl";
                app.style.position = "absolute";
                app.style.zIndex = "2147483647";
                app.style.left = `${value.X}px`;
                app.style.top = `${value.Y}px`;
                document.body.append(app);
                ReactDOM.render(
                    <Main text={result.data.translations[0].text} />,
                    app
                );
            })
            .catch((error) => {
                console.log(error);
                alert("エラーが発生しました");
            });
    }
});

const Main = (props: any) => {
    return (
        <div
            style={{
                backgroundColor: "blue",
                color: "white",
                textAlign: "center",
            }}
        >
            {props.text}
        </div>
    );
};
