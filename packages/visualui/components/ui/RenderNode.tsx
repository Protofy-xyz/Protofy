import { useNode, useEditor } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';
import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styles from "../../styles/Editor.module.css";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Icon, Text, Flex } from "native-base"

export const RenderNode = ({ render }) => {
    const enableEdit = true
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
        nodeId
    } = useNode((node) => {
        return (
            {
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

    const currentRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (dom) {
            if ((isActive || isHover) && enableEdit) dom.classList.add(styles.componentselected);
            else dom.classList.remove(styles.componentselected);
        }
    }, [dom, isActive, isHover, enableEdit]);

    const getPos = useCallback((dom: HTMLElement) => {
        const { top, left, bottom } = dom
            ? dom.getBoundingClientRect()
            : { top: 0, left: 0, bottom: 0 };
        return {
            top: `${top > 0 ? top : bottom}px`,
            left: `${left}px`,
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
            {(isHover || isActive) && enableEdit
                ? ReactDOM.createPortal(
                    <div
                        ref={currentRef}
                        style={{
                            left: getPos(dom).left,
                            top: getPos(dom).top,
                            zIndex: 9999,
                            position: "fixed",
                            backgroundColor: "#2680EB",
                            padding: "10px",
                            color: "white",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            height: "30px",
                            marginTop: "-29px",
                            pointerEvent: 'auto'
                        }}
                    >
                        <Text fontSize="xs" color="white" mr="10">{name}</Text>
                        <Flex direction="row">
                            {moveable ? (
                                <div
                                    ref={drag}
                                    style={{ cursor: "grab" }}
                                    title="Move"
                                >
                                    <Icon
                                        as={MaterialCommunityIcons}
                                        name="arrow-all"
                                        size="xs"
                                        color="white"
                                    />
                                </div>
                            ) : null}
                            {id !== ROOT_NODE && parent != "ROOT" ?
                                <div
                                    style={{ margin: "0px 8px 0px 8px", cursor: "pointer" }}
                                    title="Go to parent"
                                >
                                    <Icon
                                        onMouseDown={(e) => {
                                            actions.selectNode(parent);
                                            e.stopPropagation()
                                        }}
                                        as={MaterialCommunityIcons}
                                        name="arrow-up"
                                        size="xs"
                                        color="white"
                                    />
                                </div>
                                : null}
                            {childs.length ?
                                <div
                                    style={{ marginRight: parent != "ROOT" ? "8px" : "", cursor: "pointer" }}
                                    title="Go to first child"
                                >
                                    <Icon
                                        onMouseDown={(e) => {
                                            actions.selectNode(childs[0]);
                                            e.stopPropagation()
                                        }}
                                        as={MaterialCommunityIcons}
                                        name="arrow-down"
                                        size="xs"
                                        color="white"
                                    />
                                </div>
                                : null}
                            {nodeAndSiblings.length > 1 ?
                                <div
                                    style={{ margin: "0px 8px 0px 0px", cursor: "pointer" }}
                                    title="Go to next sibling"
                                >
                                    <Icon
                                        onMouseDown={(e) => {
                                            const currentIndex = nodeAndSiblings.indexOf(nodeId)
                                            const nextIndex = (currentIndex + 1) % nodeAndSiblings.length
                                            const nextNode = nodeAndSiblings[nextIndex]
                                            actions.selectNode(nextNode);
                                            e.stopPropagation()
                                        }}
                                        as={MaterialCommunityIcons}
                                        name="redo"
                                        size="xs"
                                        color="white"
                                    />
                                </div>
                                : null}
                            {deletable ? (
                                <div
                                    style={{ cursor: "pointer" }}
                                    title="Delete"
                                >
                                    <Icon
                                        onMouseDown={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            actions.delete(id);
                                        }}
                                        as={MaterialCommunityIcons}
                                        name="delete"
                                        size="xs"
                                        color="white"
                                    />
                                </div>
                            ) : null}

                        </Flex>
                    </div>,
                    document.querySelector('.page-container')
                )
                : null}
            {render}
        </>
    );
};
