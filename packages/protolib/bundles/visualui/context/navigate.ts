import {useRouter } from 'next/router';

export const navigate = (path) => {
    const router = useRouter();
    return () => router.push(path)
}