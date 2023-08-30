import React, { } from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, Conf, getPropConfs } from "visualui/components/conf";
import UIAvatar, {defaultAvatarProps} from 'baseapp/palettes/uikit/Avatar'
import { dumpComponentProps } from "../../utils/utils";

const Avatar = (props) => {
    let {
        connectors: { connect },
        custom
    } = useNode((node) => ({
        selected: node.events.selected,
        custom: node.data.custom
    }));
    const newProps = { ...props, ...dumpComponentProps(props, custom) }

    return (
        <UIAvatar ref={connect} {...newProps}/>
    )
}

const AvatarSettings = () => {
    let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));

    const combinedProps = {
		...defaultAvatarProps,
		...props
	}

    return (
        <div>
            <Conf caption={'URL'} type={'text'} prop={'url'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom}/>
            <Conf caption={'Size'} type={'select'} prop={'size'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
                { value: "xs", caption: "Extra Small" },
                { value: "sm", caption: "Small" },
                { value: "md", caption: "Medium" },
                { value: "lg", caption: "Large" },
                { value: "xl", caption: "Extra Large" },
                { value: "2xl", caption: "Double Extra Large" }
            ]} />
            {getStyleConfs(props, setProp, custom, setCustom)}
            {getPropConfs(props, setProp, custom, setCustom)}
        </div>
    )
};

Avatar.craft = {
    related: {
        settings: AvatarSettings
    },
    props: {},
    custom: {
        moduleSpecifier: '"baseapp/palettes/uikit/Avatar"',
        defaultImport: "Avatar"
    }
}

export default Avatar