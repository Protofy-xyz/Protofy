import { ListItems } from '../../components/ListItems';
import { PageModel } from './pagesSchemas';

export const ListPages = () => (
    <ListItems
        title="Pages"
        id="listpages"
        fetchFunc='/adminapi/v1/pages'
        model={PageModel}
        displayFields={[
            { label: "", field: "route" },
        ]}
    />
);