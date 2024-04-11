import { getLogger } from 'protolib/base/logger';

const logger = getLogger()

type operationType = 'equals' | 'strict equals' | 'greater' | 'greater or equals' | 'lesser' | 'lesser or equals'

export const operations = ['equals', 'greater', 'greater or equals', 'lesser', 'lesser or equals', 'strict equals']
export async function flowSwitch(operator1, operator2, operation:operationType, thenCb, elseCb, errorCb) {
    const _thenCb = thenCb ? thenCb : () => {}
    const _elseCb = elseCb ? elseCb : () => {}
    const _errorCb = errorCb ? errorCb : () => {}

    try {
        switch(operation) {
            case 'equals':
                if(operator1 == operator2) {
                    return _thenCb()
                } else {
                    return _elseCb()
                }

            case 'strict equals':
                if(operator1 === operator2) {
                    return _thenCb()
                } else {
                    return _elseCb()
                }

            case 'greater':
                if(operator1 > operator2) {
                    return _thenCb()
                } else {
                    return _elseCb()
                }
    
            case 'greater or equals':
                if(operator1 >= operator2) {
                    return _thenCb()
                } else {
                    return _elseCb()
                }

            case 'lesser':
                if(operator1 < operator2) {
                    return _thenCb()
                } else {
                    return _elseCb()
                }
    
            case 'lesser or equals':
                if(operator1 <= operator2) {
                    return _thenCb()
                } else {
                    return _elseCb()
                }
            default:
                return _errorCb()
        }
    } catch(e) {
        return _errorCb()
    }
}