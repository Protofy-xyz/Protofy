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
		<PanelResizeHandle disabled={disabled} style={{ alignSelf: 'center', cursor: 'pointer', pointerEvents: 'all', position: 'relative' }}>
			<div
				onClick={onClick ? onClick : null}
				onDoubleClick={!disabled ? onTogglePanel : null}
				style={{
					height: '35px', width: '35px',
					borderRadius: '20px',
					position: 'absolute',
					right: '10px',
					marginLeft: "-30px",
					background: "#252526",
					display: "flex",
					alignItems: 'center',
					pointerEvents: 'all',
					justifyContent: 'center'
				}}>
				{direction == "LEFT"
					? <ChevronLeft size={25} style={{marginRight: '3px'}} color="white" />
					: <ChevronRight size={25} style={{marginLeft: '3px'}} color="white" />
				}
			</div>
		</PanelResizeHandle>
	);
}

export default ResizeHandle;