import React from 'react';
import { YStack, Text, XStack } from '@my/ui';

interface SimpleDataTableProps {
    columns: Array<{ name: string; selector: (row: any) => React.ReactNode }>;
    data: any[];
}

export const SimpleDataTable: React.FC<SimpleDataTableProps> = ({ columns, data }) => {
    return (
        <YStack>
            <XStack paddingBottom={5} borderBottomWidth={1} borderBottomColor="$borderColor">
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
                            {col.selector(row)}
                        </Text>
                    ))}
                </XStack>
            ))}
        </YStack>
    );
};
