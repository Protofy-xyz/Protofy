import React from "react";
import { PanelResizeHandle } from "react-resizable-panels";
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
					height: '40px', width: '30px',
					borderTopLeftRadius: '12px',
					borderBottomLeftRadius: '12px',
					marginLeft: "-30px",
					background: "grey", position: "absolute",
					border: '1px solid grey',
					display: "flex",
					alignItems: 'center',
					pointerEvents: 'all',
					justifyContent: 'center'
				}}>
				{direction == "LEFT"
					? <ChevronLeft size={30} color="#252526" />
					: <ChevronRight size={30} color="#252526" />
				}
			</div>
		</PanelResizeHandle>
	);
}

export default ResizeHandle;