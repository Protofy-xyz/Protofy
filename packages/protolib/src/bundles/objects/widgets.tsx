import { TotalItems } from '../../components/TotalItems';
import { ObjectModel } from './objectsSchemas';
import { Box } from 'lucide-react';
import { API } from 'protobase';

export const TotalObjects = () => (
    <TotalItems
        title="Total Objects"
        id="totalobjects"
        fetchFunc='/adminapi/v1/objects'
        model={ObjectModel}
        icon={Box}
        link="./objects"
    />
);