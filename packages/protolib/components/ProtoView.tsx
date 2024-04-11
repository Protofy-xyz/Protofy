export const ProtoView = ({ viewId, currentView, children }) => {
    return currentView == viewId ? children : null
}