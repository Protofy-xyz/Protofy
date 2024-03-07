import { useNode, useEditor } from "@protocraft/core";
import { ROOT_NODE } from "@craftjs/utils";
import React, { useEffect, useRef, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import { ArrowDown, Trash2, Redo, ArrowUp, Move, MoreVertical } from 'lucide-react';
import { Popover } from '@my/ui'
import visualUItheme from "./Theme";

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
        custom
    } = useNode((node) => {
        return (
            {
                custom: node.data.custom,
                unknown: node.data.custom.unknown ?? false,
                nodeId: node.id,
                isHover: node.events.hovered,
                dom: node.dom,
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

        let topPos

        if (top > 100) topPos = top - 60
        else topPos = bottom - 50

        return {
            top: topPos,
            left: left,
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
                                backgroundColor: visualUItheme.nodeBackgroundColor,
                                border: border,
                                padding: "16px",
                                color: "white",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                height: barHeight,
                                pointerEvents: 'auto',
                                gap: 20
                            }}
                        >
                            <div style={{ fontSize: 14, color: 'white' }}>{name}{unknown ? ' (Unknown)' : ''}</div>
                            <div style={{ height: barHeight, borderLeft: border }}></div>
                            <div style={{ display: 'flex', flexDirection: "row", flex: 1, gap: "20px" }}>
                                {moveable ? (
                                    <div
                                        ref={drag}
                                        style={{ cursor: "grab" }}
                                        title="Move"
                                    >
                                        <Move
                                            color="white"
                                            size={iconSize}
                                        />
                                    </div>
                                ) : null}
                                {id !== ROOT_NODE && parent != "ROOT" ?
                                    <div
                                        style={{ cursor: "pointer" }}
                                        title="Select parent"
                                    >
                                        <ArrowUp
                                            onMouseDown={(e) => {
                                                actions.selectNode(parent);
                                                e.stopPropagation()
                                            }}
                                            color="white"
                                            size={iconSize}
                                        />
                                    </div>
                                    : null}
                                {childs.length ?
                                    <div
                                        style={{ cursor: "pointer" }}
                                        title="Select first child"
                                    >
                                        <ArrowDown
                                            onMouseDown={(e) => {
                                                actions.selectNode(childs[0]);
                                                e.stopPropagation()
                                            }}
                                            color="white"
                                            size={iconSize}
                                        />
                                    </div>
                                    : null}
                                {nodeAndSiblings?.length > 1 ?
                                    <div
                                        style={{ cursor: "pointer" }}
                                        title="Select next sibling"
                                    >
                                        <Redo
                                            onMouseDown={(e) => {
                                                const currentIndex = nodeAndSiblings.indexOf(nodeId)
                                                const nextIndex = (currentIndex + 1) % nodeAndSiblings.length
                                                const nextNode = nodeAndSiblings[nextIndex]
                                                actions.selectNode(nextNode);
                                                e.stopPropagation()
                                            }}
                                            color="white"
                                            size={iconSize}
                                        />
                                    </div>
                                    : null}
                                {deletable ? (
                                    <div
                                        style={{ cursor: "pointer" }}
                                        title="Delete"
                                        id='render-node-delete-btn'
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            actions.delete(id);
                                        }}
                                    >
                                        <Trash2
                                            color="white"
                                            size={iconSize}
                                        />
                                    </div>
                                ) : null}

                                {
                                    custom.options ?
                                        <Popover placement="top" onOpenChange={onEnableEvents}>
                                            <Popover.Trigger>
                                                <div
                                                    style={{ cursor: "pointer" }}
                                                    title="Delete"
                                                    id='render-node-delete-btn'
                                                >
                                                    <MoreVertical
                                                        color="white"
                                                        size={iconSize}
                                                    />
                                                </div>
                                            </Popover.Trigger>
                                            <Popover.Content gap="$4" br="$0" shadowRadius={"$4"} shadowColor={"black"} boc="gray" bw="1px" shadowOpacity={0.6} bc={visualUItheme.nodeBackgroundColor}>
                                                <div style={{ color: 'gray', alignSelf: 'flex-start' }}>Options</div>
                                                {
                                                    custom.options?.map((st) => (<div
                                                        style={{ cursor: "pointer", alignSelf: 'flex-start' }}
                                                        onClick={(e: React.MouseEvent) => {
                                                            e.stopPropagation();
                                                            st.action({ setProp, dom })
                                                        }}
                                                    >
                                                        <div>{st.name}</div>
                                                    </div>))
                                                }
                                            </Popover.Content>
                                        </Popover>

                                        : null
                                }
                            </div>
                        </div>,
                        document.querySelector('.page-container')
                    )
                    : null
            }
            {render}
        </>
    )
};
