import { YStack, Text } from '@my/ui';
import { PieChart as PieChartR, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";
import { DashboardCard } from './DashboardCard';

interface PieChartProps {
    title: string;
    data: any[];
    dataKey: string;
    nameKey: string;
    colors: string[];
    tooltipFormatter?: (value: number) => string;
    labelFormatter?: (props: any) => React.ReactNode;
    isAnimationActive?: boolean;
    aspect?: any
}

export const PieChart: React.FC<PieChartProps> = ({
    title,
    data,
    dataKey,
    nameKey,
    colors,
    tooltipFormatter = (value) => `${value}`,
    labelFormatter,
    isAnimationActive = false,
    aspect = 1
}) => {

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <Text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </Text>
        );
    };

    return Array.isArray(data) && data.length > 0 ? (
        <ResponsiveContainer aspect={parseFloat(aspect)}>
            <PieChartR>
                <Pie
                    data={data}
                    dataKey={dataKey}
                    nameKey={nameKey}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label={labelFormatter ?? renderCustomizedLabel}
                    labelLine={false}
                    isAnimationActive={isAnimationActive}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={tooltipFormatter} />
                <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{
                        marginTop: -100, // reduce la separación entre gráfico y leyenda
                        lineHeight: '20px'
                    }}
                />
            </PieChartR>
        </ResponsiveContainer>
    ) : (
        <YStack>
            <Text>No data available</Text>
        </YStack>
    )
};
