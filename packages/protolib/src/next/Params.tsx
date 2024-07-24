import { useRouter, useSearchParams, usePathname } from 'solito/navigation';
import { useUpdateEffect } from 'usehooks-ts';

const omitProp = (obj, prop) => {
    const { [prop]: _, ...rest } = obj;
    return rest;
};

export const useQueryState = (setState) => {
    const searchParams = useSearchParams();
    const query = Object.fromEntries(searchParams.entries());

    useUpdateEffect(() => {
        setState(query);
    }, [searchParams]);
};

const navigate = (router, pathname, query, method) => {
    const newSearchParams = new URLSearchParams(query).toString();
    const newUrl = pathname + '?' + newSearchParams;
    if (method === 'push') {
        router.push(newUrl);
    } else if (method === 'replace') {
        router.replace(newUrl);
    }
};

export const usePageParams = (state) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const query = Object.fromEntries(searchParams.entries());

    const cleanState = () => Object.keys(state ?? {}).reduce((total, current) => {
        if (state[current] !== '') {
            return {
                ...total,
                [current]: state[current]
            };
        }
        return total;
    }, {});

    return {
        query,

        push: (key, value) => {
            const newQuery = {
                ...query,
                ...cleanState(),
                [key]: value
            };
            navigate(router, pathname, newQuery, 'push');
        },

        mergePush: (obj) => {
            const newQuery = {
                ...query,
                ...cleanState(),
                ...obj
            };
            navigate(router, pathname, newQuery, 'push');
        },

        removePush: (keys: string | string[]) => {
            const keysArr = Array.isArray(keys) ? keys : [keys];
            let newQuery = { ...query };
            keysArr.forEach(key => {
                newQuery = omitProp(newQuery, key);
            });
            navigate(router, pathname, newQuery, 'push');
        },

        removeReplace: (key) => {
            const newQuery = omitProp(query, key);
            navigate(router, pathname, newQuery, 'replace');
        },

        replace: (key, value) => {
            const newQuery = {
                ...query,
                ...cleanState(),
                [key]: value
            };
            navigate(router, pathname, newQuery, 'replace');
        },

        mergeReplace: (obj) => {
            const newQuery = {
                ...cleanState(),
                ...state,
                ...obj
            };
            navigate(router, pathname, newQuery, 'replace');
        }
    };
};