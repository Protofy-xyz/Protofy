import { TotalItems } from '../../components/TotalItems';
import { ListItems } from '../../components/ListItems';
import { UserModel } from './usersSchemas';
import { User2 } from 'lucide-react';

export const TotalUsers = ({ title, id }) => (
    <TotalItems
        title={title}
        id={id}
        fetchFunc="/api/core/v1/accounts"
        model={UserModel}
        icon={User2}
        link="./users"
    />
);


export const ListLatestUsers = ({ title, id }) => (
    <ListItems
        title={title}
        id={id}
        fetchFunc="/api/core/v1/accounts"
        model={UserModel}
        displayFields={[
            { label: "Username", field: "username" },
            { label: "Created at", field: "createdAt" },
            { label: "Type", field: "type" },
        ]}
        limit={5}
    />
);
