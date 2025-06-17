import { TransferComponent } from 'protolib/lib/transferComponent';
import { UsersView } from '@extensions/users/adminPages';
import { ServicesView } from '@extensions/services/adminPages';
import { PieChart } from 'protolib/components/PieChart';
import { BarChart } from 'protolib/components/BarChart';

export const transferExtensionComponents = () => {
    TransferComponent(UsersView, 'UsersView');
    TransferComponent(ServicesView, 'ServicesView');
    TransferComponent(PieChart, 'PieChart');
    TransferComponent(BarChart, 'BarChart');
}



