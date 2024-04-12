import {useRouter } from 'next/router';

export const actionNavigate = (path) => {
    const router = useRouter();
    return () => router.push(path)
}

export const navigate = (path, router) => {
    router.push(path)
}