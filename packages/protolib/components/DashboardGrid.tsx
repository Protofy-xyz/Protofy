import { Responsive, WidthProvider } from "react-grid-layout";
import { Stack } from "@my/ui";
import { Tinted } from './Tinted';

const ResponsiveGridLayout = WidthProvider(Responsive);

export const gridSizes = {
    lg: { totalCols: 90, normalW: 30, normalH: 6, doubleW: 30, doubleH: 6 }, //24
    md: { totalCols: 64, normalW: 30, normalH: 6, doubleW: 30, doubleH: 6 }, //24
    sm: { totalCols: 2, normalW: 2, normalH: 6, doubleW: 2, doubleH: 6 },
    xs: { totalCols: 1, normalW: 1, normalH: 6, doubleW: 1, doubleH: 6 },
}

export const DashboardGrid = ({ items = [], layouts = {}, borderRadius = 10, padding = 10, settings = {}, ...props }) => {
    return (
        <Tinted>
            <ResponsiveGridLayout
                {...props}
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1500, md: 800, sm: 400, xs: 0 }}
                rowHeight={30}
                draggableCancel=".no-drag"
                style={{height: '100%', overflow: 'auto'}}
                {...settings}
                cols={{ lg: gridSizes.lg.totalCols, md: gridSizes.md.totalCols, sm: gridSizes.sm.totalCols, xs: gridSizes.xs.totalCols }}
            >
                {items.map((item) => (
                    <Stack flex={1} key={item.key}>{item.content}</Stack>
                ))}
            </ResponsiveGridLayout>
        </Tinted>
    );
};