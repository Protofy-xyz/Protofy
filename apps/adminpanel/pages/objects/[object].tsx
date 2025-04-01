import ObjectsPage from 'protolib/bundles/objects/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'
import { useRouter } from 'next/router';

export default function Page(props: any) {
    const router = useRouter();
    const { board } = router.query;

    return (
        <>
            <Head>
                <title>{board+" Object"}</title>
            </Head>
            <ObjectsPage.objects.component {...props} />
        </>
    )
}

export const getServerSideProps = ObjectsPage.objects.getServerSideProps
