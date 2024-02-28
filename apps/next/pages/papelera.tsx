import Feature from 'app/bundles/custom/pages/papelera'
import { useSession } from 'protolib'

export default function PapeleraPage(props:any) {
  useSession(props.pageSession)
  return <Feature.component {...props} />
}

export const getServerSideProps = Feature.getServerSideProps