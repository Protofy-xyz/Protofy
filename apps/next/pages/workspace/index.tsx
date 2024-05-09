import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { SiteConfig } from 'app/conf';

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
      router.replace('/workspace/'+SiteConfig.defaultWorkspace+'/'+SiteConfig.defaultWorkspacePage);
  }, [router]);

  return null;
};

export default Home;