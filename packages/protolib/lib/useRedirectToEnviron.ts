import { AppConfContext } from 'protolib/providers/AppConf';
import { getWorkspaceEnv } from './useWorkspaceEnv';
import { useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'solito/navigation';
import { getEnv } from '../base';

const serviceEnv = getEnv();

export const useRedirectToEnviron = () => {
  const SiteConfig = useContext(AppConfContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const workspaceEnv = getWorkspaceEnv(document.location.pathname);

    if (workspaceEnv === 'prod' && serviceEnv === 'dev') {
      router.replace('/workspace/dev/' + pathname.split('/').slice(3).join('/'));
      return;
    }

    if (pathname.startsWith('/workspace/') &&
        !pathname.startsWith('/workspace/dev/') &&
        !pathname.startsWith('/workspace/prod/')) {
      const defaultWorkspace = SiteConfig.defaultWorkspace ? SiteConfig.defaultWorkspace : 'dev';
      router.replace('/workspace/' + defaultWorkspace + '/' + pathname.split('/').slice(2).join('/'));
    }
  }, [pathname]);
};