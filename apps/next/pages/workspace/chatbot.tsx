import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/lib/useRedirectToEnviron'
import { SiteConfig } from 'app/conf'
import dynamic from 'next/dynamic';

export default function Page(props: any) {
    //@ts-ignore
    const Chatbot = dynamic(() => import('protolib/src/components/chatbot'), { ssr: false })
    useRedirectToEnviron()
    const projectName = SiteConfig.projectName

    return (
        <>
            <Head>
                <title>{projectName + " - Chatbot"}</title>
            </Head>
            <Chatbot />
        </>
    )
}