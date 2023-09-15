import React from "react";
import { PanelResizeHandle } from "react-resizable-panels";
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

type ResizeHandleProps = {
	direction: "RIGHT" | "LEFT",
	onTogglePanel?: Function | any,
	onClick?: Function | any,
	disabled?: boolean
}

function ResizeHandle({ direction = "LEFT", onTogglePanel, disabled, onClick }: ResizeHandleProps) {
	return (
		<PanelResizeHandle disabled={disabled} style={{ alignSelf: 'center', cursor: 'pointer', pointerEvents: 'all' }}>
			<div
				onClick={onClick ? onClick : null}
				onDoubleClick={!disabled ? onTogglePanel : null}
				style={{
					height: '50px', width: '30px',
					borderTopLeftRadius: '10px',
					borderBottomLeftRadius: '10px',
					marginLeft: "-30px",
					background: "white", position: "absolute",
					border: '1px solid rgba(0,0,0,0.3)',
					display: "flex",
					alignItems: 'center',
					pointerEvents: 'all',
					justifyContent: 'center'
				}}>
				{direction == "LEFT"
					? <BiChevronLeft size={30} color="rgba(0,0,0,0.3)" />
					: <BiChevronRight size={30} color="rgba(0,0,0,0.3)" />
				}
			</div>
		</PanelResizeHandle>
	);
}

export default ResizeHandle;