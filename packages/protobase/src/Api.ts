import { PendingResult, getPendingResult } from "./PendingResult";
import {devMode} from './env'
import { isElectron } from "./lib/isElectron";
import { getLogger } from "./logger"

const logger = getLogger()
let APIURL = devMode?'http://localhost:8000':'http://localhost:8080'
export const setApiUrl = (apiurl) => APIURL = apiurl 
export const getApiUrl = () => process?.env?.PROXY_API_URL ?? APIURL

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const _fetch = async (urlOrData, data?, update?, plain?, retryNum=0):Promise<PendingResult | undefined> => {
    const SERVER = getApiUrl()
    let realUrl;

    if (typeof urlOrData === 'string') {
      realUrl = typeof window === 'undefined' || isElectron() ? (!urlOrData.startsWith('https://') && !urlOrData.startsWith('http://') ? SERVER : '') + urlOrData : urlOrData;
    } else if (typeof urlOrData === 'object' && urlOrData.url) {
      const baseUrl = typeof window === 'undefined' || isElectron() ? (!urlOrData.url.startsWith('https://') && !urlOrData.url.startsWith('http://') ? SERVER : '') + urlOrData.url : urlOrData.url;
      const params = new URLSearchParams();
  
      for (let key in urlOrData) {
        if (key !== 'url') {
          params.append(key, urlOrData[key]);
        }
      }
  
      realUrl = baseUrl+(baseUrl.includes('?') ? '&' : '?')+params.toString();
    } else {
      throw new Error("Invalid params for API");
    }
    const fn = async () => {
        update ? update(getPendingResult('loading')) : null
        try {
            const res = await fetch(realUrl, data? {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) 
            }:undefined);

            let resData
            try {
                resData = await res.text()
                if(!plain) resData = JSON.parse(resData)
            } catch(e) {
                console.error("Error decoding JSON response from API: ", realUrl, e)
            }

            if (!res.ok) {

                if(retryNum < 10 && (res.status < 400 || res.status > 499) && res.status !== 500) {
                    console.error('API retry: ', res.status, realUrl)
                    await wait(1000);
                    return _fetch(urlOrData, data, update, plain, retryNum + 1)
                }
                
                const err = getPendingResult('error', null, resData)
                if (update) {
                    update(err)
                } else {
                    return err
                }
                return;
            }
            const response = getPendingResult('loaded', resData);
            if (update) {
                update(response)
            } else {
                return response
            }
        } catch (e: any) {
            logger.trace('API retry: ', {realUrl, urlOrData, data, update, plain,retryNum})
            if(retryNum < 6) {
                await wait(2000);
                return _fetch(urlOrData, data, update, plain, retryNum + 1)
            }
            let errStr = e.apiError ?? e.toString()
            if (e instanceof SyntaxError) {
                logger.error({ error: e }, "Fetch error")
                errStr = 'Server error. Check configuration and network connection.'
            }
            const err = getPendingResult('error', null, errStr)
            if (update) {
                update(err)
            } else {
                return err
            }
        }
    }
    if (update) {
        fn()
    } else {
        return fn()
    }

}
export const API = {
    //@ts-ignore
    actionFetch: (...arg) => () => _fetch(...arg),
    fetch: _fetch,
    //@ts-ignore
    get: (url, update?, plain?):Promise<PendingResult> => _fetch(url, null, update, plain),
    //@ts-ignore
    post: (url, data, update?, plain?):Promise<PendingResult> => _fetch(url, data, update, plain)
}