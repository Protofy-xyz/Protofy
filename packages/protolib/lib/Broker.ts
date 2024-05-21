export const getBrokerUrl = () => {
    const urlParts = typeof document !== "undefined" ? document.location.pathname.split('/') : []
    const isInWorkspace = typeof document !== "undefined" && document.location.pathname.startsWith('/workspace')
    const workSpaceMode = isInWorkspace ? (urlParts.length > 2 ? urlParts[2] : undefined) : undefined

    const brokerUrl = typeof document !== "undefined" ? (document.location.protocol === "https:" ? "wss" : "ws") + "://" + document.location.host + '/websocket' + (workSpaceMode && workSpaceMode == 'dev' ? '?env=dev' : '') : ''
    return brokerUrl
}