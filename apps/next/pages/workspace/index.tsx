import Head from 'next/head'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page(props: any) {
    const { replace } = useRouter();
    useEffect(() => replace('/'), [])
    
    return (
        <>
            <Head>
                <title>Protofy</title>
            </Head>
        </>
    )
}
