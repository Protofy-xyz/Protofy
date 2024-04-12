import { getLogger } from 'protolib/base/logger'

const logger = getLogger()

export async function flowInRange(
  value,
  desiredValue,
  threshold,
  aboveAction,
  belowAction,
  onRangeAction,
  errorAction
) {
  let desired = Number.parseFloat(desiredValue)
  let thresh = Number.parseFloat(threshold)

  let valueInNumber = Number.parseFloat(value)
  if (Number.isNaN(desired) || Number.isNaN(thresh) || Number.isNaN(valueInNumber)) {
    if (errorAction) await errorAction()
    logger.error(
      {
        desiredIsNaN: Number.isNaN(desired),
        threshIsNaN: Number.isNaN(thresh),
        valueInNumberIsNaN: Number.isNaN(valueInNumber),
      },
      'Flow in range error: there is a NaN'
    )
    return
  }
  let delta = Math.abs(valueInNumber - desired)
  if (valueInNumber > desired + thresh) {
    if (aboveAction) await aboveAction(delta)
  } else if (valueInNumber < desired - thresh) {
    if (belowAction) await belowAction(delta)
  } else {
    if (onRangeAction) await onRangeAction(delta)
  }
}
