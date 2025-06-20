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
          <script src="/public/externals/babel.min.js"></script>
          {/* <LoadInter100 /> */}
          <FontsLoader />
          <script dangerouslySetInnerHTML={{
            __html: `
            
              (function() {
                if (typeof window !== 'undefined') {
                  (function shimDrawImage() {
                    const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
                    const drawQueues = new WeakMap(); // Mapea cada contexto a su cola de draws pendientes
                    const drawInProgress = new WeakMap(); // Para evitar bucles infinitos al procesar la cola

                    CanvasRenderingContext2D.prototype.drawImage = function (...args) {
                        try {
                          const img = args[0];

                          if (!img) return;

                          const width = img.width || args[3];
                          const height = img.height || args[4];

                          // Si no tiene dimensiones, lo guardamos para intentar más tarde
                          if (!width || !height) {
                            if (!drawQueues.has(this)) drawQueues.set(this, []);
                            drawQueues.get(this).push(args);
                            return;
                          }

                          // Evitar loops infinitos
                          if (drawInProgress.get(this)) return;

                          // Ejecutar los draws pendientes si hay
                          const queue = drawQueues.get(this);
                          if (queue && queue.length > 0) {
                            drawInProgress.set(this, true);
                            while (queue.length > 0) {
                              const pendingArgs = queue.shift();
                              try {
                                const pendingImg = pendingArgs[0];
                                const w = pendingImg?.width || pendingArgs[3];
                                const h = pendingImg?.height || pendingArgs[4];
                                if (w && h) {
                                  originalDrawImage.apply(this, pendingArgs);
                                } else {
                                  // Si sigue sin estar lista, volver a poner al final
                                  queue.push(pendingArgs);
                                }
                              } catch (e) {
                                console.warn('🛑 Fallo al procesar draw pendiente:', e);
                              }
                            }
                            drawInProgress.set(this, false);
                          }

                          // Dibujar la imagen actual
                          return originalDrawImage.apply(this, args);

                        } catch (err) {
                          console.warn('🛑 drawImage falló silenciosamente:', err);
                          return;
                        }
                      };
                  })();
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
