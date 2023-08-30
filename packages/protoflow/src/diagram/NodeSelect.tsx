import React from 'react';
import useTheme from './Theme';
import Select, { components } from 'react-select';

const NodeSelect = (props) => {
	const nodeFontSize = useTheme('nodeFontSize')

	return (<div style={{fontSize:nodeFontSize+'px', flex: 1, zIndex: 1000 }}>
		<Select {...props} />
	</div>
	);
}
export default NodeSelect
