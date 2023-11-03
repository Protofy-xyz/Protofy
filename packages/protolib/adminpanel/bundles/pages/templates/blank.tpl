import {Page, Center, BigTitle, withSession} from 'protolib'
import { DefaultLayout } from 'app/layout/DefaultLayout'
import { Protofy } from 'protolib/base'
import { SSR } from 'app/conf'

Protofy("template", "default")
const isProtected = Protofy("protected", {{protected}})

export default {
    route: Protofy("route", "{{route}}"),
    component: ({}:any) => {
        return <Page>

        </Page>
    },
    getServerSideProps: SSR(async (context) => withSession(context, isProtected?Protofy("permissions", {{permissions}}):undefined))
}