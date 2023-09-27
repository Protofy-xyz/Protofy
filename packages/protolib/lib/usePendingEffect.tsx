import { useEffectOnce } from "usehooks-ts";
import { PendingAtomResult } from "./createApiAtom";

export const usePendingEffect = (fn: Function, seter: Function, data: PendingAtomResult) => useEffectOnce(() => {!data || data.status == 'pending' ? fn(seter) : seter(data)})
