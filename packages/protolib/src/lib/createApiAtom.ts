import { atom } from "jotai";
import { PendingResult, getPendingResult } from "protobase";
  
export const createApiAtom = (initialState) => atom<PendingResult>(getPendingResult("pending", initialState))