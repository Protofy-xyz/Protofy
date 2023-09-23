import { useEffectOnce } from "usehooks-ts";
import { PendingAtomResult } from "./createApiAtom";

export const usePendingEffect = (fn: Function, data: PendingAtomResult) => useEffectOnce(() => data.status == 'pending' ? () => {fn()} : undefined)
