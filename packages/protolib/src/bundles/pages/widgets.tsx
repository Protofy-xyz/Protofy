import { ListItems } from '../../components/ListItems';
import { PageModel } from './pagesSchemas';

export const ListPages = ({ title, id }) => (
    <ListItems
        title={title}
        id={id}
        fetchFunc='/adminapi/v1/pages'
        model={PageModel}
        displayFields={[
            { label: "name", field: "name" },
            { label: "route", field: "route" },
        ]}
    />
);