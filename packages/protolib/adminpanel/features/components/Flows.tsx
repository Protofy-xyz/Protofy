import dynamic from 'next/dynamic'

const FlowsWidget = dynamic(() => import('protolib/adminpanel/features/components/FlowsWidget'), {
  loading: () => <>
    Loading
  </>,
  ssr: false
})

export default function Flows(props) {
  return <FlowsWidget {...props} />
}