import { useRouter } from 'next/router';
import { useWorkspaceRoot } from './useWorkspaceRoot';

export const useEnv = () => {
    const workspaceRoot = useWorkspaceRoot();
    return workspaceRoot === 'workspace' ? 'development' : 'admin';
}