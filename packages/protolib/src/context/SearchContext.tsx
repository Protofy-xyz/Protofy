import { createContext } from "react"

type SearchState = {
    search: string,
    setSearch: any,
    searchName: string,
    setSearchName: any,
    searchStatus?: string | undefined,
    setSearchStatus?: any
}

export const SearchContext = createContext<SearchState>({
    search: '',
    setSearch: () => {},
    searchName: '',
    setSearchName: () => {},
    searchStatus: undefined,
    setSearchStatus: () => {}
});