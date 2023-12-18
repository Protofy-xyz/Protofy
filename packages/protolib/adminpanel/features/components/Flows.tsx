import dynamic from 'next/dynamic'
import { XStack } from 'tamagui'

const FlowsWidget = dynamic(() => import('protolib/adminpanel/features/components/FlowsWidget'), {
  loading: () => <XStack jc='center' ai='center' height="100%" width="100%">
    Loading
  </XStack>,
  ssr: false
})

export default function Flows(props) {
  return <FlowsWidget {...props} />
}