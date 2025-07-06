import { useEffect } from 'react';
import Head from 'next/head';
import { SiteConfig } from 'app/conf';

export default function Page(props: any) {
  const projectName = SiteConfig.projectName;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'rpc') {
        const { method, asset } = event.data;
        if (method === 'download-asset') {
          if (!asset?.url || !asset?.name) {
            console.log("bad asset download request from iframe");
            return;
          }
          console.log(`${asset.name} received: ${asset.url}`);
          // @ts-ignore
          window.electronAPI?.downloadAsset(asset.url, asset.name);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{projectName + ' - Store'}</title>
      </Head>
      <iframe
        src="https://store.protofy.xyz"
        style={{ height: '100vh', width: '100vw', border: 'none' }}
      />
    </>
  );
}
