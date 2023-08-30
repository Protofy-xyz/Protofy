import React from "react";
import { useNode } from "@craftjs/core";
import { getStyleConfs, getPropConfs, Conf } from "visualui/components/conf";
import UIBox, { defaultBoxProps } from 'baseapp/palettes/uikit/Box'
import { getEmptyBoxStyle } from "visualui/utils/utils";
import { dumpComponentProps } from "../../utils/utils";

const Box = (props) => {
	let {
		connectors: { connect, drag },
		custom
	} = useNode(node => ({
		selected: node.events.selected,
		custom: node.data.custom
	}));

	const emptyStyle = getEmptyBoxStyle(props.children)

	const newProps = { ...props, ...dumpComponentProps(props, custom) }

	return <UIBox
		ref={(ref) => connect(drag(ref))}
		{...newProps}
		style={{
			...newProps.style,
			...emptyStyle,
		}}
	>
	</UIBox>
}

const BoxSettings = () => {
	let { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
		props: node.data.props,
		custom: node.data.custom,
	}));

	const combinedProps = {
		...defaultBoxProps,
		...props
	}

	return (
		<div>
			<Conf caption={'Mode'} type={'select'} prop={'flexDir'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} params={[
				{ value: 'column', caption: 'Column' },
				{ value: 'row', caption: 'Row' }
			]} />
			<Conf caption={'Color'} type={'color'} prop={'bgColor'} props={combinedProps} setProp={setProp} custom={custom} setCustom={setCustom} />
			{getStyleConfs(props, setProp, custom, setCustom)}
			{getPropConfs(props, setProp, custom, setCustom)}
		</div>
	)
};

Box.craft = {
	related: {
		settings: BoxSettings
	},
	props: {},
	custom: {
		moduleSpecifier: '"baseapp/palettes/uikit/Box"',
		defaultImport: "Box"
	}
}

export default Box