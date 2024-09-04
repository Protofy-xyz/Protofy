import { YStack } from '@my/ui';
import { PieChart as PieChartR, Pie, Tooltip, Cell, Legend } from "recharts";
import { DashboardCard } from './DashboardCard';

interface PieChartProps {
    title: string;
    id: string;
    data: any[];
    dataKey: string;
    nameKey: string;
    colors: string[];
    tooltipFormatter?: (value: number) => string;
    labelFormatter?: (props: any) => React.ReactNode;
    isAnimationActive?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({
    title,
    id,
    data,
    dataKey,
    nameKey,
    colors,
    tooltipFormatter = (value) => `${value} MB`,
    labelFormatter,
    isAnimationActive = false,
}) => {

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <DashboardCard title={title} id={id}>
            <YStack borderRadius={10} backgroundColor="$bgColor" padding={10} flex={1} justifyContent='center' alignItems='center'>
                {data && data.length > 0 ? (
                    <PieChartR width={450} height={400}>
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
                        <Legend />
                    </PieChartR>
                ) : (
                    <Text>No data available</Text>
                )}
            </YStack>
        </DashboardCard>
    );
};
