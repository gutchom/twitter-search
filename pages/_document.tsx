import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#eeaa66" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
