//transfers components from nextjs to the individual react renderers inside each react card
export const TransferComponent = (component, name) => {
    if (typeof window === 'undefined') {
        return;
    }
    
    if (!component || !name) {
        console.warn('transferComponent: component or name is missing');
        return;
    }

    //@ts-ignore
    if(!window.ProtoComponents) {
        //@ts-ignore
        window.ProtoComponents = {};
    }



    //@ts-ignore
    window.ProtoComponents[name] = component;
    
}