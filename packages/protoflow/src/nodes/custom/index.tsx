
const getCustomComponent = (node, nodeData, customComponents) => {
  if (!node) return null
  const customComponent = customComponents?.find(c => c.check(node, nodeData))
  if (customComponent) {
    return customComponent
  }
  return null
}

export default getCustomComponent;