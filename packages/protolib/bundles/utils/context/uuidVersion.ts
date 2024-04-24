const UUID = require('uuid')

export function versionUuid(uuid) {
  try {
    return UUID.version(uuid)
  } catch (error) {
    return "Invalid UUID"
  }
}
