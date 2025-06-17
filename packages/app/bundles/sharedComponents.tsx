import { TransferComponent } from 'protolib/lib/transferComponent';
import { UsersView } from '@extensions/users/adminPages';

export const transferExtensionComponents = () => {
    TransferComponent(UsersView, 'UsersView');
}



