import { Responsive, WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);
    

export const DashboardGrid = ({ items = [], layouts = {}, borderRadius = 10, padding = 10, backgroundColor }) => {
    return (
        <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
        >
            {items.map((item) => (
                <div key={item.key}>{item.content}</div>
            ))}

        </ResponsiveGridLayout>
    );
};