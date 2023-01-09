import React, { useEffect, useState } from 'react';
// import browser from 'webextension-polyfill';
import { getBucket } from '@extend-chrome/storage';
import translate from 'deepl';

interface MyBucket {
  AUTH_KEY: string;
}

const bucket = getBucket<MyBucket>('my-bucket');

export const Popup: React.FC = () => {
  const [text, setText] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [authKey, setAuthKey] = useState('');
  const [response, setResponse] = useState('');

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
      target_lang: 'EN',
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
    <>
      <input value={text} onChange={(event) => setText(event.target.value)} />
      <button onClick={handleClick}>Translate</button>
      <p>{response}</p>
    </>
  ) : (
    <>
      <p>Auth Key</p>
      <input
        value={inputKey}
        onChange={(event) => setInputKey(event.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </>
  );
};
