import getBoardsBar from '@extensions/boards/ActionBar';
import getAssetsBar from '@extensions/assets/ActionBar';
import getActionsBar from '@extensions/actions/ActionBar';

export const processActionBar = (nextRouter, defaults = {}, generateEvent = (e) => {}) => {
    const contents = {
        "boards": () => getBoardsBar(generateEvent),
        "assets": () => getAssetsBar(generateEvent),
        "actions": () => getActionsBar(generateEvent),
    };

    const routes = {
        "/boards/*": contents.boards,
        "/assets": contents.assets,
        "/actions": contents.actions,
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