import { TransferComponent } from 'protolib/lib/transferComponent';
import { UsersView } from '@extensions/users/adminPages';
import { ServicesView } from '@extensions/services/adminPages';
import { PieChart } from 'protolib/components/PieChart';
import { BarChart } from 'protolib/components/BarChart';
import { LineChart } from 'protolib/components/LineChart';
import { AreaChart } from 'protolib/components/AreaChart';
import {RadarChart} from 'protolib/components/RadarChart';
import {Markdown} from 'protolib/components/Markdown';
import { RadialBarChart } from 'protolib/components/RadialBartChart';
import { KeySetter } from 'protolib/components/KeySetter';
import { InteractiveIcon } from 'protolib/components/InteractiveIcon';
import CanvasDraw from "react-canvas-draw"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { API } from 'protobase';
import { FileBrowser } from 'protolib/adminpanel/next/components/FileBrowser';
import { Spinner } from '@my/ui' 
import { ViewList } from 'protolib/components/ViewList';
import { JSONView } from 'protolib/components/JSONView';
import { ProtoThemeProvider } from 'protolib/components/ProtoThemeProvider';
import { CameraPreview } from 'protolib/components/vision/CameraPreview';
import { CameraCard } from 'protolib/components/vision/CameraCard';

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
    TransferComponent(Markdown, 'Markdown');
    TransferComponent(ReactMarkdown, 'ReactMarkdown');
    TransferComponent(remarkGfm, 'remarkGfm')
    TransferComponent(API, 'API');
    TransferComponent(FileBrowser, 'FileBrowser');
    TransferComponent(Spinner, 'Spinner');
    TransferComponent(ViewList, 'ViewList');
    TransferComponent(JSONView, 'JSONView');
    TransferComponent(ProtoThemeProvider, 'ProtoThemeProvider');
    TransferComponent(CameraPreview, 'CameraPreview');
    TransferComponent(CameraCard, 'CameraCard');
}



