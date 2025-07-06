import { YStack, Text } from '@my/ui';
import {
  RadialBarChart as RadialBarChartR,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { DashboardCard } from './DashboardCard';

interface RadialBarChartProps {
  title: string;
  id: string;
  data: any[];
  dataKey: string;
  nameKey: string;
  colors: string[];
  tooltipFormatter?: (value: number) => string;
  isAnimationActive?: boolean;
  displayLegend?: any;
  startAngle?: any;
  endAngle?: any;
  aspect?: any;
  displayTooltip?: any;
  displayLabel?: any;
  innerRadius?: any;
  outerRadius?: any;
}

export const RadialBarChart: React.FC<RadialBarChartProps> = ({
  title,
  id,
  data,
  dataKey,
  nameKey,
  colors,
  tooltipFormatter = (value) => `${value}`,
  isAnimationActive = false,
  displayLegend = true,
  displayTooltip = true,
  displayLabel = true,
  startAngle = 90,
  endAngle = -270,
  aspect = 1.7,
  innerRadius = '50%',
  outerRadius = '100%',
}) => {
  const legendStyle = {
    top: '50%',
    right: 0,
    transform: 'translateY(-50%)',
    lineHeight: '24px',
  } as React.CSSProperties;

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
          <ResponsiveContainer aspect={parseFloat(aspect, 10)}>
            <RadialBarChartR
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              barSize={10}
              data={data}
              startAngle={parseFloat(startAngle)}
              endAngle={parseFloat(endAngle)}
            >
              <RadialBar
                {...(displayLabel && displayLabel !== 'false' ? { label: { position: 'insideStart', fill: '#fff' } } : {})}
                background={{ fill: '#ddd' }}
                dataKey={dataKey}
                isAnimationActive={isAnimationActive}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </RadialBar>
              {displayLegend && displayLegend !== 'false' && <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={legendStyle}
              />}
              {displayTooltip && displayTooltip !== 'false' && <Tooltip formatter={tooltipFormatter} />}
            </RadialBarChartR>
          </ResponsiveContainer>
        ) : (
          <YStack>
            <Text>No data available</Text>
          </YStack>
        )}
      </YStack>
  );
};
