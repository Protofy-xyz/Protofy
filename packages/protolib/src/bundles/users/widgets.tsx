import { TotalItems } from '../../components/TotalItems';
import { UserModel } from './usersSchemas';
import { User2 } from 'lucide-react';

export const TotalUsers = () => (
    <TotalItems
        title="Total Users"
        id="totalusers"
        fetchFunc="/adminapi/v1/accounts"
        model={UserModel}
        icon={User2}
        link="./users"
    />
);
