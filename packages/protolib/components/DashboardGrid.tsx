import { Responsive, WidthProvider } from "react-grid-layout";
import { Stack } from "@my/ui";
import { Tinted } from './Tinted';

const ResponsiveGridLayout = WidthProvider(Responsive);
    

export const DashboardGrid = ({ items = [], layouts = {}, borderRadius = 10, padding = 10, settings = {}, ...props }) => {
    return (
        <Tinted>
            <ResponsiveGridLayout
                // compactType={null}
                // allowOverlap={true}
                {...props}
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1500, md: 800, sm: 400, xs: 0 }}
                rowHeight={30}
                draggableCancel=".no-drag"
                style={{height: '100%', overflow: 'auto'}}
                {...settings}
                cols={{ lg: 24, md: 24, sm: 2, xs: 1 }}
            >
                {items.map((item) => (
                    <Stack flex={1} key={item.key}>{item.content}</Stack>
                ))}
            </ResponsiveGridLayout>
        </Tinted>
    );
};