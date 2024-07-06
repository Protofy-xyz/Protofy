import { useEffectOnce } from "usehooks-ts";
import { PendingResult } from "./createApiAtom";

export const usePendingEffect = (fn: Function, seter: Function, data: PendingResult) => useEffectOnce(() => {!data || data.status == 'pending' ? fn(seter) : seter(data)})
