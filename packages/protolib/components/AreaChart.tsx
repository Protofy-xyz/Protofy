import { YStack, Text } from '@my/ui';
import {
    AreaChart as AreaChartR,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { DashboardCard } from './DashboardCard';

interface AreaChartProps {
    title: string;
    id: string;
    data: any[];
    dataKey: string;
    nameKey: string;
    colors: string[];
    tooltipFormatter?: (value: number) => string;
    isAnimationActive?: boolean;
    aspect?: any;
    color?: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({
    title,
    id,
    data,
    dataKey,
    nameKey,
    colors,
    color = '#8884d8',
    tooltipFormatter = (value) => `${value} MB`,
    isAnimationActive = false,
    aspect = 1,
}) => {
    return (
        <YStack
            borderRadius={10}
            backgroundColor="$bgColor"
            padding={10}
            flex={1}
            justifyContent="center"
            alignItems="center"
        >
            {Array.isArray(data) && data.length > 0 ? (
                <ResponsiveContainer aspect={parseFloat(aspect)}>
                    <AreaChartR data={data}>
                        <XAxis dataKey={nameKey} />
                        <YAxis />
                        <Tooltip formatter={tooltipFormatter} />
                        {/* <Legend /> */}
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            fill={color}
                            isAnimationActive={isAnimationActive}
                        />
                    </AreaChartR>
                </ResponsiveContainer>
            ) : (
                <YStack>
                    <Text>No data available</Text>
                </YStack>
            )}
        </YStack>
    );
};
