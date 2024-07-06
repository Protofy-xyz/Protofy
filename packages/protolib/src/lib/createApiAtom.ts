import { atom } from "jotai";
import { PendingResult, getPendingResult } from "../base/PendingResult";
  
export const createApiAtom = (initialState) => atom<PendingResult>(getPendingResult("pending", initialState))