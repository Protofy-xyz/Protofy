import { APIContext } from "../../../apiContext"

export const deviceState = async (context: typeof APIContext, deviceName: string, subsystemName: string, monitorName: string, onValue: Function) => {
    const value = await context.deviceMonitor(deviceName, subsystemName, monitorName)
    onValue(value)
    context.deviceSub(context.mqtt, context, deviceName, subsystemName, monitorName, (value) => {
      onValue(value)
    })
}