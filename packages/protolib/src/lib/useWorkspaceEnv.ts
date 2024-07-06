import { usePathname } from 'solito/navigation';

export const useWorkspaceEnv = () => {
    const pathname = usePathname();  
    const env = getWorkspaceEnv(pathname);
    return env;
}

export const getWorkspaceEnv = (path) => {
    const env = path.split('/')[2];
    return env
}

export const useWorkspaceApiUrl = (url) => {
    const fn = useWorkspaceUrl()
    return fn(url)
}

export const getWorkspaceApiUrl = (path, url) => {
    const env = getWorkspaceEnv(path);
    const result = (url.startsWith('/api/') && env == 'dev' ? '/_dev': '') + url;
    return result
}

export const useWorkspaceUrl = () => {
    const env = useWorkspaceEnv();
    return (url) => (url.startsWith('/api/') && env == 'dev' ? '/_dev': '') + url;
}