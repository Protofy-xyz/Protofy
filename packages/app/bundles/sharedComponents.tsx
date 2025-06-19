import { TransferComponent } from 'protolib/lib/transferComponent';
import { UsersView } from '@extensions/users/adminPages';
import { ServicesView } from '@extensions/services/adminPages';
import { PieChart } from 'protolib/components/PieChart';
import { BarChart } from 'protolib/components/BarChart';
import { LineChart } from 'protolib/components/LineChart';
import { AreaChart } from 'protolib/components/AreaChart';
import {RadarChart} from 'protolib/components/RadarChart';
import { RadialBarChart } from 'protolib/components/RadialBartChart';
import { KeySetter } from 'protolib/components/KeySetter';
import { InteractiveIcon } from 'protolib/components/InteractiveIcon';
import CanvasDraw from "react-canvas-draw"

export const transferExtensionComponents = () => {
    TransferComponent(UsersView, 'UsersView');
    TransferComponent(ServicesView, 'ServicesView');
    TransferComponent(PieChart, 'PieChart');
    TransferComponent(BarChart, 'BarChart');
    TransferComponent(LineChart, 'LineChart');
    TransferComponent(AreaChart, 'AreaChart');
    TransferComponent(RadarChart, 'RadarChart');
    TransferComponent(RadialBarChart, 'RadialBarChart');
    TransferComponent(KeySetter, 'KeySetter');
    TransferComponent(InteractiveIcon, 'InteractiveIcon');
    TransferComponent(CanvasDraw, 'CanvasDraw');
}



