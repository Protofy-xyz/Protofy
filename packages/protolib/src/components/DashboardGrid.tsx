import { Responsive, WidthProvider } from "react-grid-layout";
import { Stack } from "@my/ui";
import { Tinted } from './Tinted';

const ResponsiveGridLayout = WidthProvider(Responsive);
    

export const DashboardGrid = ({ items = [], layouts = {}, borderRadius = 10, padding = 10, backgroundColor, ...props }) => {
    return (
        <Tinted>
            <ResponsiveGridLayout
                // compactType={null}
                // allowOverlap={true}
                {...props}
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 0 }}
                cols={{ lg: 12 }}
                rowHeight={30}
                draggableCancel=".no-drag"
                style={{height: '100%', overflow: 'auto'}}
            >
                {items.map((item) => (
                    <Stack flex={1} key={item.key}>{item.content}</Stack>
                ))}
            </ResponsiveGridLayout>
        </Tinted>
    );
};