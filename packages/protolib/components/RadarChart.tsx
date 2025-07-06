import { YStack, Text } from '@my/ui';
import {
  RadarChart as RadarChartR,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DashboardCard } from './DashboardCard';

interface RadarChartProps {
  title: string;
  id: string;
  data: any[];
  dataKey: string;
  nameKey: string;
  colors: string[];
  color?: string;
  tooltipFormatter?: (value: number) => string;
  isAnimationActive?: boolean;
  aspect?: any;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  title,
  id,
  data,
  dataKey,
  nameKey,
  colors,
  color = '#8884d8',
  tooltipFormatter = (value) => `${value}`,
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
          <ResponsiveContainer aspect={aspect}>
            <RadarChartR data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey={nameKey} />
              <PolarRadiusAxis />
              <Tooltip formatter={tooltipFormatter} />
              {/* <Legend /> */}
              <Radar
                name={title}
                dataKey={dataKey}
                stroke={color}
                fill={color}
                fillOpacity={0.6}
                isAnimationActive={isAnimationActive}
              />
            </RadarChartR>
          </ResponsiveContainer>
        ) : (
          <YStack>
            <Text>No data available</Text>
          </YStack>
        )}
      </YStack>
  );
};
