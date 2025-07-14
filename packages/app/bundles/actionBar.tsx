import getActionBar from '@extensions/boards/ActionBar';

export const processActionBar = (nextRouter, defaults = {}, generateEvent = (e) => {}) => {
    const contents = {
        "boards": () => getActionBar(generateEvent)
    };

    const routes = {
        "/boards/*": contents.boards,
    };

    const matchRoute = (path) => {
        for (const pattern in routes) {
            const regex = new RegExp("^" + pattern.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, ".*") + "$");
            if (regex.test(path)) {
                const actionBarFn = routes[pattern];
                return actionBarFn ? actionBarFn() : [];
            }
        }
        return [];
    };

    return {
        content: matchRoute(nextRouter.pathname),
        visible: true,
        ...defaults
    };
};