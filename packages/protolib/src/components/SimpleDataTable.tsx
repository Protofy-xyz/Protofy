import React from 'react';
import { YStack, Text, XStack } from '@my/ui';
import { Chip } from './Chip';
import { CheckCircle, XCircle } from '@tamagui/lucide-icons';

interface SimpleDataTableProps {
    columns: Array<{ name: string; selector: (row: any) => React.ReactNode }>;
    data: any[];
    maxHeight?: number;
}

export const SimpleDataTable: React.FC<SimpleDataTableProps> = ({ columns, data, maxHeight }) => {
    return (
        <YStack>
            <XStack padding={10} borderBottomWidth={1} borderBottomColor="$borderColor">
                {columns.map((col, index) => (
                    <Text 
                        key={index} 
                        fontWeight="600" 
                        color="$color9" 
                        style={{ textAlign: 'left', flex: 1 }}
                    >
                        {col.name}
                    </Text>
                ))}
            </XStack>

            <YStack 
                style={{ 
                    maxHeight: maxHeight || 300, 
                    overflowY: 'auto'
                }}
            >
                {data.map((row, rowIndex) => (
                    <XStack 
                        key={rowIndex} 
                        padding={10} 
                    >
                        {columns.map((col, colIndex) => (
                            <Text 
                                key={colIndex} 
                                color="$primary"
                                style={{ textAlign: 'left', flex: 1 }}
                            >
                                {Array.isArray(col.selector(row)) ? (
                                    <XStack space={5}>
                                        {col.selector(row).map((item, chipIndex) => (
                                            <Chip key={chipIndex} color="$color5">
                                                {item}
                                            </Chip>
                                        ))}
                                    </XStack>
                                ) : (
                                    typeof col.selector(row) === 'boolean' ? (
                                        col.selector(row) ? (
                                            <CheckCircle color="$color9" size={20} />
                                        ) : (
                                            <XCircle color="red" size={20} />
                                        )
                                    ) : (
                                        col.selector(row)
                                    )
                                )}
                            </Text>
                        ))}
                    </XStack>
                ))}
            </YStack>
        </YStack>
    );
};