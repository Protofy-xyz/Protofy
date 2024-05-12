import { useRouter } from 'next/router';
import { useWorkspaceRoot } from './useWorkspaceRoot';
import { useEvent } from 'tamagui';

export const useWorkspaceEnv = () => {
    const router = useRouter();
    const path = router.pathname;  
    const env = getWorkspaceEnv(path)
    return env
}

export const getWorkspaceEnv = (path) => {
    const env = path.split('/')[2];
    return env
}

export const useWorkspaceApiUrl = (url) => {
    const env = useWorkspaceEnv();
    return (url.startsWith('/api/') && env == 'dev' ? '/_dev': '') + url;
}

export const getWorkspaceApiUrl = (path, url) => {
    const env = getWorkspaceEnv(path);
    const result = (url.startsWith('/api/') && env == 'dev' ? '/_dev': '') + url;
    return result
}