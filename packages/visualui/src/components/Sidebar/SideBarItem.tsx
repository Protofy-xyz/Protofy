import React from 'react';
import styled from 'styled-components';
import { ChevronDown, ChevronUp } from 'lucide-react'
import { YStack } from '@my/ui';

const SidebarItemDiv = styled.div<{ visible?: boolean; height?: string }>`
  height: ${(props) =>
        props.visible && props.height && props.height !== 'full'
            ? `${props.height}`
            : 'auto'};
  flex: ${(props) =>
        props.visible && props.height && props.height === 'full' ? `1` : 'unset'};
  color: #545454;
`;

export type SidebarItemProps = {
    title: string;
    height?: string;
    icon: any;
    visible?: boolean;
    onChange?: (bool: boolean) => void;
    children?: React.ReactNode;
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
    visible,
    icon,
    title,
    children,
    height,
    onChange,
}) => {
    return (
        <SidebarItemDiv visible={visible} height={height} style={{ display: 'flex', flexDirection: 'column' }}>
            <div
                onClick={() => {
                    if (onChange) onChange(!visible);
                }}
                style={{ cursor: 'pointer', backgroundColor: '#191919', borderBottom: "1px solid #cccccc20", alignItems: 'center', padding: "10px", flexDirection: 'row', display: 'flex' }}
            >
                <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                    {React.createElement(icon, { size: 18, color: 'white' })}
                    <div style={{ fontSize: 18, marginLeft: '10px', color: 'white' }}>{title}</div>
                </div>
                {visible ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            <YStack
                style={{ display: visible ? 'flex' : 'none', flex: 1, flexDirection: 'column', overflowY: "scroll" }}
            >
                {children}
            </YStack>
        </SidebarItemDiv>
    );
};