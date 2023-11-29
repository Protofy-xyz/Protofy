const modulesData = [
    { key: 'devicePages', path: 'protolib/bundles/devices/adminPages' },
    { key: 'filesPages', path: 'protolib/bundles/files/adminPages' },
    { key: 'usersPages', path: 'protolib/bundles/users/adminPages' },
    { key: 'groupsPages', path: 'protolib/bundles/groups/adminPages' },
    { key: 'eventsPages', path: 'protolib/bundles/events/adminPages' },
    { key: 'objectsPages', path: 'protolib/bundles/objects/adminPages' },
    { key: 'tasksPages', path: 'protolib/bundles/tasks/adminPages' },
    { key: 'messagesPages', path: 'protolib/bundles/messages/adminPages' },
    { key: 'pagesPages', path: 'protolib/bundles/pages/adminPages' },
    { key: 'apisPages', path: 'protolib/bundles/apis/adminPages' },
    { key: 'databasesPages', path: 'protolib/bundles/databases/adminPages' },
    { key: 'resourcesPages', path: 'protolib/bundles/resources/adminPages' },
    { key: 'customPages', path: './custom/pages' }
];

async function loadModule(path) {
    try {
        const module = await import(path);
        return module.default; 
    } catch (error) {
        console.error("Error al importar el módulo:", error);
        return null
    }
}

const loadBundlePages = async () => {
    const loadedModules = await Promise.all(modulesData.map(({ path }) => loadModule(path)));

    return loadedModules.reduce((acc, module, index) => {
        if (module !== null) {
            return {
                ...acc,
                ...module
            }
        }
        return acc;
    }, {});
}

export default loadBundlePages