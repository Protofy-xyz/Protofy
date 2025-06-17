import { TransferComponent } from 'protolib/lib/transferComponent';
import { UsersView } from '@extensions/users/adminPages';
import { ServicesView } from '@extensions/services/adminPages';

export const transferExtensionComponents = () => {
    TransferComponent(UsersView, 'UsersView');
    TransferComponent(ServicesView, 'ServicesView');
}



