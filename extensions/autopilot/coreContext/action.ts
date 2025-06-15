import { getLogger } from 'protobase';
import { automation } from '@extensions/automations/coreContext/automation';

const logger = getLogger();

export const action = async (options: {
    name: string,
    path: string,
    automationParams?: any,
    displayName?: string,
    description?: string,
    app: any,
    onRun?: (params, res) => void
    onError?: (err) => void
}) => {
    const name = options.name + options.path
    const app = options.app

    const onRun = options.onRun || (() => {})
    const onError = options.onError

    return automation({
        name: name,
        responseMode: 'wait',
        automationParams: options.automationParams ?? {},
        displayName: options.displayName ?? name,
        description: options.description ?? "",
        tags: [options.name],
        app: app,
        onRun,
        onError
    })
}