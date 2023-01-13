import React, { useEffect, useRef, useState } from "react";
import { getBucket } from "@extend-chrome/storage";
import translate from "deepl";
import { Textarea, Button, Text, Spacer } from "@nextui-org/react";
import ReactDOM from "react-dom";

interface MyBucket {
  AUTH_KEY: string;
}

const bucket = getBucket<MyBucket>("my-bucket", "sync");

export const Popup = () => {
  const [text, setText] = useState("こんにちは");
  const [inputKey, setInputKey] = useState("");
  const [authKey, setAuthKey] = useState("");
  const [response, setResponse] = useState("");

  const handleRegister = async () => {
    bucket.set({ AUTH_KEY: inputKey });
    const value = await bucket.get();
    if (value.AUTH_KEY) {
      setAuthKey(value.AUTH_KEY);
    }
  };

  useEffect(() => {
    (async () => {
      const value = await bucket.get();
      if (value.AUTH_KEY) {
        setAuthKey(value.AUTH_KEY);
      }
    })();
  }, []);

  const handleClick = async (): Promise<void> => {
    await translate({
      text: text,
      target_lang: "EN",
      auth_key: authKey,
      free_api: true,
    })
      .then((result) => {
        setResponse(result.data.translations[0].text);
      })
      .catch((error) => {
        setResponse(error);
      });
  };

  return authKey ? (
    <div>
      <Textarea
        initialValue="こんにちは"
        onChange={(e) => setText(e.target.value)}
        width="200px"
      />
      <Button onClick={handleClick} size="xs" css={{ margin: "auto" }}>
        翻訳する
      </Button>
      <Spacer y={1} />
      <Text>{response}</Text>
    </div>
  ) : (
    <div>
      <Text>認証キー：</Text>
      <Textarea onChange={(e) => setInputKey(e.target.value)} width="200px" />
      <Spacer y={1} />
      <Button onClick={handleRegister} size="xs" css={{ margin: "auto" }}>
        登録する
      </Button>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
