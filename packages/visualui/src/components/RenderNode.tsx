import { forwardRef, createElement, useState } from 'react'
import { useNode, useEditor } from "@protocraft/core";
import { ROOT_NODE } from "@craftjs/utils";
import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { ArrowDown, Trash2, Redo, ArrowUp, Move, MoreVertical, Copy } from 'lucide-react';
import { XStack } from '@my/ui'
import { useUITheme } from "./Theme";
import Icon from "./Icon";
import { v4 as uuidv4 } from 'uuid';
import { MenuOption, UIMenu } from './UIMenu';

const IconButton = forwardRef(({ icon, iconSize = 20, selected = false, dynamicIcon = undefined, ...props }: any, ref) => {
    const [hover, setHover] = useState(false)

    return <div
        ref={ref}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        {...props}
        style={{
            cursor: "pointer", padding: '6px', borderRadius: '2px',
            backgroundColor: selected ? useUITheme('textColor') : '',
            ...props.style
        }}
    >
        {dynamicIcon
            ? <Icon
                name={dynamicIcon}
                color={selected ? useUITheme('nodeBackgroundColor') : hover ? useUITheme('interactiveColor') : useUITheme('textColor')}
                size={iconSize}
            />
            : createElement(icon, { size: iconSize, color: hover ? useUITheme('interactiveColor') : useUITheme('textColor') })}
    </div>
})

export const RenderNode = ({ render, onEnableEvents }) => {
    const { id } = useNode();
    const { actions, query, isActive } = useEditor((_, query) => ({
        isActive: query.getEvent('selected').contains(id),
    }));

    const {
        isHover,
        dom,
        name,
        moveable,
        deletable,
        connectors: { drag },
        parent,
        childs,
        nodeAndSiblings,
        nodeId,
        unknown,
        setProp,
        custom,
        props,
        node
    } = useNode((node) => {
        return (
            {
                custom: node.data.custom,
                unknown: node.data.custom.unknown ?? false,
                nodeId: node.id,
                isHover: node.events.hovered,
                dom: node.dom,
                node,
                name: node.data.custom.displayName || node.data.displayName,
                moveable: query.node(node.id).isDraggable(),
                deletable: query.node(node.id).isDeletable() && query.node(node.id).isDraggable(),
                parent: node.data.parent,
                props: node.data.props,
                childs: node.data.nodes,
                nodeAndSiblings: node.data?.parent ? query.node(node.data?.parent).childNodes() : undefined
            }
        )
    });

    const enableDuplicate = childs.length == 0

    const componentColor = unknown ? "#EF9364" : "#2680EB"
    const iconSize = 20
    const border = '1px solid gray'
    const barHeight = 50

    const currentRef = useRef<HTMLDivElement>();
    useEffect(() => {
        if (dom) {
            if (isActive) {
                dom.style.boxShadow = "inset 0px 0px 0px 2px " + componentColor
            } else if (isHover) {
                dom.style.boxShadow = "inset 0px 0px 0px 1px " + componentColor
            }
            else dom.style.boxShadow = ""
        }
    }, [dom, isActive, isHover]);

    const getPos = useCallback((dom: HTMLElement) => {
        const { top, left, bottom } = dom
            ? dom.getBoundingClientRect()
            : { top: 0, left: 0, bottom: 0 };

        const margin = 5
        let topPos
        let leftPos = left < margin ? margin : left

        var body = document.body,
            html = document.documentElement;

        var height = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);

        if (top > 120) { // top
            topPos = top - 60
        } else if ((height - bottom) > 70 && bottom > 60) { // bottom
            topPos = bottom + 10
        } else if ((height - bottom) < 120 && bottom > 120) { // in
            topPos = bottom - (barHeight + margin)
            leftPos = margin
        } else { // hide
            topPos = -20000
        }

        return {
            top: topPos + "px",
            left: leftPos + "px",
        };
    }, []);

    const scroll = useCallback(() => {
        const { current: currentDOM } = currentRef;

        if (!currentDOM) return;
        const { top, left } = getPos(dom);
        currentDOM.style.top = top;
        currentDOM.style.left = left;
    }, [dom, getPos]);

    useEffect(() => {
        document
            ?.querySelector('.craftjs-renderer')
            ?.addEventListener('scroll', scroll);

        return () => {
            document
                ?.querySelector('.craftjs-renderer')
                ?.removeEventListener('scroll', scroll);
        };
    }, [scroll]);

    const Separator = (props) => <div style={{ height: barHeight, borderLeft: border }}></div>

    return (
        <>
            {
                (isActive)
                    ?
                    ReactDOM.createPortal(
                        <div
                            id="my-renderedNode"
                            ref={currentRef}
                            style={{
                                left: getPos(dom).left,
                                top: getPos(dom).top,
                                zIndex: 9999999999999999999999999999999,
                                position: "fixed",
                                backgroundColor: useUITheme('nodeBackgroundColor'),
                                border: border,
                                padding: "6px",
                                color: "white",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                height: barHeight,
                                pointerEvents: 'auto',
                                gap: "6px"
                            }}
                        >
                            <div style={{ fontSize: 14, color: useUITheme('textColor'), padding: '10px 20px' }}>{name}{unknown ? ' (Unknown)' : ''}</div>
                            <Separator />
                            <div style={{ display: 'flex', flexDirection: "row", flex: 1, gap: "6px", alignItems: 'center' }}>
                                {moveable ? (
                                    <IconButton
                                        ref={drag}
                                        style={{ cursor: "grab" }}
                                        title="Move"
                                        icon={Move}
                                    />
                                ) : null}
                                {id !== ROOT_NODE && parent != "ROOT" ?
                                    <IconButton
                                        title="Select parent"
                                        onMouseDown={(e) => {
                                            actions.selectNode(parent);
                                            e.stopPropagation()
                                        }}
                                        icon={ArrowUp}
                                    />
                                    : null}
                                {childs.length ?
                                    <IconButton
                                        title="Select first child"
                                        icon={ArrowDown}
                                        onMouseDown={(e) => {
                                            actions.selectNode(childs[0]);
                                            e.stopPropagation()
                                        }}
                                    />
                                    : null}
                                {nodeAndSiblings?.length > 1 ?
                                    <IconButton
                                        title="Select next sibling"
                                        icon={Redo}
                                        onMouseDown={(e) => {
                                            const currentIndex = nodeAndSiblings.indexOf(nodeId)
                                            const nextIndex = (currentIndex + 1) % nodeAndSiblings.length
                                            const nextNode = nodeAndSiblings[nextIndex]
                                            actions.selectNode(nextNode);
                                            e.stopPropagation()
                                        }}
                                    />
                                    : null}

                                <Separator />

                                {
                                    custom.shortcuts ?
                                        <XStack ai="center" gap="6px">
                                            {custom.shortcuts.map((shortcut, index) => {
                                                const isSelected = shortcut?.selected ? shortcut.selected(props) : false
                                                return (
                                                    <UIMenu
                                                        key={index}
                                                        onOpenChange={onEnableEvents}
                                                        trigger={
                                                            <IconButton
                                                                onClick={shortcut.action ? () => shortcut.action({ setProp, dom }) : null}
                                                                selected={isSelected}
                                                                dynamicIcon={shortcut.icon(props)}
                                                            />
                                                        }
                                                        content={
                                                            shortcut.menu
                                                                ? shortcut.menu?.map((sh) => (<MenuOption
                                                                    onClick={(e: React.MouseEvent) => {
                                                                        e.stopPropagation();
                                                                        sh.action({ setProp, dom })
                                                                    }}
                                                                    selected={sh?.selected ? sh.selected(props) : false}
                                                                    name={sh.name}
                                                                />
                                                                ))
                                                                : null
                                                        }
                                                    >
                                                    </UIMenu>
                                                )
                                            })}
                                            <Separator />
                                        </XStack>
                                        : null
                                }
                                {
                                    custom.options || enableDuplicate || deletable ?
                                        <UIMenu
                                            onOpenChange={onEnableEvents}
                                            trigger={
                                                <IconButton
                                                    title="Options"
                                                    id='render-node-options-btn'
                                                    icon={MoreVertical}
                                                />
                                            }
                                            content={
                                                <>
                                                    {enableDuplicate ? <MenuOption
                                                        onClick={(e: React.MouseEvent) => {
                                                            e.stopPropagation();
                                                            //TODO: Adds suport to duplicate nodes with childs
                                                            actions.add([
                                                                //@ts-ignore
                                                                {
                                                                    id: uuidv4(),
                                                                    rules: { ...node.rules },
                                                                    data: { ...node.data },
                                                                    events: node.events
                                                                }
                                                            ], parent, nodeAndSiblings.indexOf(nodeId) + 1)
                                                        }}
                                                        icon={Copy}
                                                        name={"Duplicate"}
                                                    />

                                                        : null}
                                                    {
                                                        custom.options?.map((st) => (<MenuOption
                                                            onClick={(e: React.MouseEvent) => {
                                                                e.stopPropagation();
                                                                st.action({ setProp, dom })
                                                            }}
                                                            name={st.name}
                                                        />))
                                                    }
                                                    {deletable ? <MenuOption
                                                        id='render-node-delete-btn'
                                                        onClick={(e: React.MouseEvent) => {
                                                            e.stopPropagation();
                                                            actions.delete(id);
                                                        }}
                                                        icon={Trash2}
                                                        name={"Delete"}
                                                    />
                                                        : null}
                                                </>
                                            }
                                        />
                                        : null
                                }
                            </div>
                        </div >,
                        document.querySelector('.page-container')
                    )
                    : null
            }
            {render}
        </>
    )
};
