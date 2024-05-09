import { AppConfContext, SiteConfigType } from 'protolib';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useRedirectToEnviron = () => {
    const SiteConfig = useContext<SiteConfigType>(AppConfContext);
    const router = useRouter();
  
    useEffect(() => {
      if(!router.isReady) return;
      if(router.asPath.startsWith('/workspace/') && !router.asPath.startsWith('/workspace/dev/') && !router.asPath.startsWith('/workspace/prod/')) {
        router.replace('/workspace/'+(SiteConfig.defaultWorkspace??'dev')+'/'+router.asPath.split('/').slice(2).join('/'));
      }
    }, [router.isReady]);
}