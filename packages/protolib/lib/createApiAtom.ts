import { atom } from "jotai";
import { PendingResult, getPendingResult } from "../base";
  
export const createApiAtom = (initialState) => atom<PendingResult>(getPendingResult("pending", initialState))