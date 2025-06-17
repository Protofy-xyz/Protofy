import { YStack, Text } from '@my/ui';
import { BarChart as BarChartR, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { DashboardCard } from './DashboardCard';

interface BarChartProps {
    title: string;
    id: string;
    data: any[];
    dataKey: string;
    nameKey: string;
    colors: string[];
    tooltipFormatter?: (value: number) => string;
    isAnimationActive?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
    title,
    id,
    data,
    dataKey,
    nameKey,
    colors,
    tooltipFormatter = (value) => `${value} MB`,
    isAnimationActive = false,
}) => {
    return (
        <DashboardCard title={title} id={id}>
            <YStack borderRadius={10} backgroundColor="$bgColor" padding={10} flex={1} justifyContent='center' alignItems='center'>
                {data && data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChartR data={data}>
                            <XAxis dataKey={nameKey} />
                            <YAxis />
                            <Tooltip formatter={tooltipFormatter} />
                            <Legend />
                            <Bar
                                dataKey={dataKey}
                                isAnimationActive={isAnimationActive}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Bar>
                        </BarChartR>
                    </ResponsiveContainer>
                ) : (
                    <YStack>
                        <Text>No data available</Text>
                    </YStack>
                )}
            </YStack>
        </DashboardCard>
    );
};
