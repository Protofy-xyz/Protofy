import { useRouter } from 'solito/navigation';

export const actionNavigate = (path) => {
    const router = useRouter();
    return () => router.push(path)
}

export const navigate = (path, router) => {
    router.push(path)
}