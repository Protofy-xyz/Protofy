import dinamyc from 'next/dynamic'

const FlowsFactory = dinamyc(() => import('protoflow').then((mod) => mod.FlowFactory), {
    loading: () => <div>Loading...</div>,
    ssr: false
})

export default (props) => {
    return <FlowsFactory {...props} />
}