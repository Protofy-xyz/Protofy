import { getLogger } from 'protobase';

const logger = getLogger()

type operationType = 'equals' | 'strict equals' | 'greater' | 'greater or equals' | 'lesser' | 'lesser or equals' | 'includes'

export const operations = ['equals', 'greater', 'greater or equals', 'lesser', 'lesser or equals', 'strict equals', 'includes']
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
            case 'includes':
                if(operator1.includes && operator1.includes(operator2)) {
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