import getFloatingBar from '@extensions/boards/ActionBar';

export const processFloatingBar = (nextRouter, defaults = {}, generateEvent = (e) => { }) => {
    const contents = {
        "boards": [...getFloatingBar(generateEvent)]
    }

    const router = {
        "/boards/*": contents.boards,
    };

    const matchRoute = (path) => {
        for (const pattern in router) {
            const regex = new RegExp("^" + pattern.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, ".*") + "$");
            if (regex.test(path)) {
                return router[pattern];
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