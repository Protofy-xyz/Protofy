const UUID = require('uuid')

export function validateUuid(uuid) {
  return UUID.validate(uuid)
}
