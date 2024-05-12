import { AppConfContext, SiteConfigType, getWorkspaceEnv} from 'protolib';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getEnv } from '../base';

const serviceEnv = getEnv()

export const useRedirectToEnviron = () => {
    const SiteConfig = useContext<SiteConfigType>(AppConfContext);
    const router = useRouter();


    useEffect(() => {
      if(!router.isReady) return;
      const workspaceEnv = getWorkspaceEnv(document.location.pathname)
      if(workspaceEnv == 'prod' && serviceEnv == 'dev') {
        router.replace('/workspace/dev/'+router.asPath.split('/').slice(3).join('/'));
        return
      }
      if(router.asPath.startsWith('/workspace/') && !router.asPath.startsWith('/workspace/dev/') && !router.asPath.startsWith('/workspace/prod/')) {
        router.replace('/workspace/'+(SiteConfig.defaultWorkspace??'dev')+'/'+router.asPath.split('/').slice(2).join('/'));
      }
    }, [router.isReady]);
}