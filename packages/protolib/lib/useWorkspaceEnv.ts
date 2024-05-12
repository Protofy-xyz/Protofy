import { useRouter } from 'next/router';
import { useWorkspaceRoot } from './useWorkspaceRoot';
import { useEvent } from 'tamagui';

export const useWorkspaceEnv = () => {
    const router = useRouter();
    const path = router.pathname;  
    const env = path.split('/')[2];
    return env
}