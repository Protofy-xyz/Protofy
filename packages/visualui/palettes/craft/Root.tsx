import React from "react";

const Root = (props) => {
    return (
        <>{props.children}</>
    )
}

const RootSettings = () => {
    return (
        <div>
 
        </div>
    )
};

Root.craft = {
    props: {},
    related: {
        settings: RootSettings
    }
}

export default Root