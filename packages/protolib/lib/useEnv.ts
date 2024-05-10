import { useRouter } from 'next/router';
import { useWorkspaceRoot } from './useWorkspaceRoot';

export const useEnv = () => {
    const router = useRouter();
    const path = router.pathname;  
    const env = path.split('/')[2];
    return env
}