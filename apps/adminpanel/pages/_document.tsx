import NextDocument, { Head, Html, Main, NextScript } from 'next/document'
import { StyleSheet } from 'react-native'
import Tamagui from '../tamagui.config'
import { FontsLoader } from 'app/components/FontsLoader'

export default class Document extends NextDocument {
  static async getInitialProps({ renderPage }) {
    const page = await renderPage()

    // @ts-ignore RN doesn't have this type
    const rnwStyle = StyleSheet.getSheet()

    return {
      ...page,
      styles: (
        <>
          <style
            id={rnwStyle.id}
            dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: Tamagui.getCSS({
                // if you are using "outputCSS" option, you should use this "exclude"
                // if not, then you can leave the option out
                exclude: process.env.NODE_ENV === 'production' ? 'design-system' : null,
              }),
            }}
          />
        </>
      ),
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.png" />
          {/* <link rel="icon" href="/favicon.svg" type="image/svg+xml" /> */}

          <meta name="docsearch:language" content="en" />
          <meta name="docsearch:version" content="1.0.0,latest" />
          {/* <LoadInter100 /> */}
          <FontsLoader />
          <script dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  var OriginalWebSocket = window.WebSocket;

                  window.WebSocket = function(url, protocols) {
                    if(url.endsWith('/_next/webpack-hmr') && window.location.search.includes('_visualui_edit_')) {
                      url = url.substr(0, url.length - '/_next/webpack-hmr'.length) + '/websocket';
                    }
                    var instance = new OriginalWebSocket(url, protocols);
                    return instance;
                  };

                  window.WebSocket.prototype = OriginalWebSocket.prototype;
                }
              })();
            `,
          }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
