import ObjectsPage from 'protolib/bundles/objects/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'
import { useRouter } from 'next/router';

export default function Page(props: any) {
    const router = useRouter();
    const { object } = router.query;

    return (
        <>
            <Head>
                <title>{object+" Object"}</title>
            </Head>
            <ObjectsPage.view.component {...props} />
        </>
    )
}

// export const getServerSideProps = ObjectsPage.view.getServerSideProps
