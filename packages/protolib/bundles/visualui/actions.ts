import { API } from 'protolib/base'
import {useRouter } from 'next/router';

const navigation = (path) => {
    const router = useRouter();
    return () => router.push(path)
}


export const actions = {
    fetch: API.actionFetch,
    navigate:  navigation
}