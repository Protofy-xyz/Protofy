import { useRouter } from 'next/router';

export const useWorkspaceRoot = () => {
    const router = useRouter();
    const path = router.pathname;  
    return path.split('/')[1];
}