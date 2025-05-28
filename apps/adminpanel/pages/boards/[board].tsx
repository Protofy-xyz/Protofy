import BoardsPage from 'protolib/bundles/boards/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'
import { useRouter } from 'next/router';

export default function Page(props: any) {
    return (
        <>
            <BoardsPage.view.component {...props} />
        </>
    )
}
