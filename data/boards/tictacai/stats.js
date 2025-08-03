if (params.action === 'reset' || params.action === 'clear') {
  return {};
} else if (params.action === 'delete') {
  const newObj = { ...(board?.[name] ?? {}) }
  delete newObj[params.key]
  return newObj
} else if (params.action === 'rename') {
  const oldKey = params.oldKey
  const newKey = params.newKey
  const obj = { ...(board?.[name] ?? {}) }
  if (oldKey !== newKey && obj[oldKey] !== undefined && obj[newKey] === undefined) {
    obj[newKey] = obj[oldKey]
    delete obj[oldKey]
  }
  return obj
} else {
  const key = params.key
  const value = params.value
  return { ...(board?.[name] ?? {}), [key]: value }
}