import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { SiteConfig } from 'app/conf';

const Home: React.FC = () => {
  const router = useRouter();
  const page = router.query.page
  useEffect(() => {
    if(!page) return
    if(page[1] != 'dev' && page[1] != 'prod') {
      router.replace('/workspace/'+(SiteConfig.defaultWorkspace??'dev')+'/'+(page?.join('/')??''));
    } else {
      router.replace('/workspace/'+page[1]+'/'+SiteConfig.defaultWorkspacePage);
    }
  }, [router, page]);

  return null;
};

export default Home;