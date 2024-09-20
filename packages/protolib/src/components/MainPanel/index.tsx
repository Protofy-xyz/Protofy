import React, { memo, useEffect, useRef } from "react"
import { Panel, PanelGroup } from "react-resizable-panels"
import SPanel from 'react-sliding-side-panel'
import { useWindowSize } from 'usehooks-ts'
import CustomPanelResizeHandle from './CustomPanelResizeHandle'

type Props = {
    actionContent?: React.Component | any
    rightPanelContent: React.Component | any
    leftPanelContent?: React.Component | any
    centerPanelContent: React.Component | any
    height?: React.Component | any
    rightPanelResizable?: boolean
    rightPanelVisible?: boolean
    openPanel?: boolean
    setOpenPanel?: any
    rightPanelWidth?: number
    rightPanelStyle?: any
    rightPanelSize?: number
    setRightPanelSize?: any
    borderLess?: boolean
}

export const MainPanel = ({
    borderLess,
    rightPanelSize,
    setRightPanelSize,
    rightPanelStyle = {},
    rightPanelWidth = 0,
    actionContent,
    rightPanelContent,
    leftPanelContent,
    centerPanelContent,
    rightPanelResizable = false,
    rightPanelVisible = true,
    openPanel,
    setOpenPanel = () => { },
    height = "100vh",
}: Props) => {
    const rightRef = useRef<any>()
    const size = useWindowSize()

    const getLeftWidth = () => {
        const totalWidth = Math.max(400, size.width)
        let percentage = (350 / totalWidth) * 100
        return percentage
    }

    const getRightWidth = () => {
        if (rightPanelSize) return rightPanelSize
        const totalWidth = Math.max(400, size.width)
        let percentage = (400 / totalWidth) * 100
        return percentage
    }

    useEffect(() => {
        if (rightRef.current) {
            rightRef.current.resize(rightPanelWidth ? rightPanelWidth : getRightWidth(), "percentages")
        }
    }, [rightPanelResizable])

    return (
        <div style={{ flex: 1, display: 'flex', maxWidth: '100%' }}>
            {leftPanelContent && (
                <div
                    id="sidebar-panel-container"
                    style={{
                        flex: 1,
                        display: openPanel ? 'flex' : 'none',
                        position: 'absolute',
                        width: getLeftWidth(),
                        zIndex: 99999999,
                    }}
                >
                    <SPanel
                        key="sidebar"
                        type={'left'}
                        isOpen={true}
                        size={getLeftWidth()}
                        backdropClicked={() => setOpenPanel(false)}
                    >
                        {leftPanelContent}
                    </SPanel>
                </div>
            )}
            {actionContent && (
                <div
                    id="left-actions-container"
                    style={{
                        display: openPanel ? "none" : "flex",
                        position: 'fixed',
                        zIndex: 99999999999999999999,
                        flexDirection: 'column',
                        left: '20px',
                        top: 'calc(50vh - 80px)',
                    }}
                >
                    {actionContent}
                </div>
            )}
            <PanelGroup direction="horizontal" style={{ height: '100%', display: 'flex' }}>
                <Panel>
                    <div style={{ display: 'flex', flex: 1, height: height }}>
                        {centerPanelContent}
                    </div>
                </Panel>
                <CustomPanelResizeHandle
                    direction="vertical"
                    borderLess={borderLess}
                    visible={rightPanelVisible}
                    resizable={rightPanelResizable}
                />
                <Panel
                    onResize={(size) => (setRightPanelSize ? setRightPanelSize(size) : null)}
                    ref={rightRef}
                    maxSize={80}
                    defaultSize={rightPanelWidth ? rightPanelWidth : getRightWidth()}
                    style={{
                        position: rightPanelVisible ? "relative" : "absolute",
                        zIndex: rightPanelVisible ? 100000 : -10,
                        display: 'flex',
                        ...rightPanelStyle,
                    }}
                >
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {rightPanelContent}
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    )
}

export default memo(MainPanel)