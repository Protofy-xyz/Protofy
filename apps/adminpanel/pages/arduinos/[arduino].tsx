import Head from 'next/head'
import { SiteConfig } from 'app/conf'
import { useRouter } from 'next/router';
// import ArduinoPage from 'protolib/bundles/arduino/adminPages'


export default function Page(props: any) {
    const router = useRouter();
    const { arduino } = router.query;

    return (
        <>
            <Head>
                <title>{arduino+" Board"}</title>
            </Head>
            {/* <ArduinoPage.view.component {...props} /> */}
        </>
    )
}

// Uncomment the following line if you want to recover SSR
// export const getServerSideProps = ArduinoPage.view.getServerSideProps
