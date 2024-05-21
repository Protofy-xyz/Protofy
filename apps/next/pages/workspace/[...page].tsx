import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { SiteConfig } from 'app/conf';
import { getWorkspaceEnv } from 'protolib';
import { getEnv } from 'protolib/base';

const serviceEnv = getEnv()

const Home: React.FC = () => {
  const router = useRouter();
  const page = router.query.page


  useEffect(() => {
    const workspaceEnv = getWorkspaceEnv(document.location.pathname)
    const defaultWorkspace = workspaceEnv == 'dev'? 'dev' : (SiteConfig.defaultWorkspace??'dev')

    if(!page) return
    if(workspaceEnv == 'dev' || workspaceEnv == 'prod') {
      router.replace('/workspace/'+workspaceEnv+'/'+SiteConfig.defaultWorkspacePage)
    } else {
      router.replace('/workspace/'+defaultWorkspace+'/'+SiteConfig.defaultWorkspacePage);
    }
  }, [router, page]);

  return null;
};

export default Home;