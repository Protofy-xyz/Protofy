import {IntentType} from 'protolib/dist/lib/Intent'
import {processFilesIntent} from 'protolib/dist/bundles/files/intents'
import { useMemo } from 'react';

export const useIntent = (intent: IntentType) => {
    //add your intents here
    return processFilesIntent(intent)
}