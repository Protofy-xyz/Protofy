import BoardsPage from 'protolib/bundles/boards/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'
import { useRouter } from 'next/router';

export default function Page(props: any) {
    const router = useRouter();
    const { board } = router.query;

    return (
        <>
            <Head>
                <title>{board+" Board"}</title>
            </Head>
            <BoardsPage.view.component {...props} />
        </>
    )
}

export const getServerSideProps = BoardsPage.view.getServerSideProps
