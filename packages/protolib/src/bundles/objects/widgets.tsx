import { YStack, Text } from '@my/ui';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { API } from 'protobase';
import { useState, useEffect } from 'react';
import { useRemoteStateList } from 'protolib/src/lib/useRemoteState';
import { ObjectModel } from './objectsSchemas';
import AsyncView from '../../components/AsyncView';
import { DashboardCard } from '../../components/DashboardCard';
import Link from 'next/link';
import { Box } from 'lucide-react';

const fetchObjects = async (fn) => {
    const objects = await API.get('/adminapi/v1/objects');
    fn(objects);
}

export const TotalObjects = ({ title, id }) => {
    const [objectsData, setObjectsData] = useRemoteStateList(undefined, fetchObjects, ObjectModel.getNotificationsTopic(), ObjectModel, true);
    const [totalObjects, setTotalObjects] = useState(0);

    useEffect(() => {
        if (objectsData?.data?.items) {
            const total = objectsData.data.total;
            setTotalObjects(total);
        }
    }, [objectsData]);

    return (
        <DashboardCard title={title} id={id}>
            <YStack borderRadius={10} backgroundColor="$bgColor" padding={10} flex={1} justifyContent='center' alignItems='center'>
                <AsyncView atom={objectsData}>
                    {objectsData?.data?.items && (
                        <Link href="./objects" className="no-drag">
                            <YStack alignItems="center" justifyContent="center">
                                <Box color="var(--color7)" size={48} strokeWidth={1.75} />
                                <Text mt={10} fontSize={48} fontWeight="bold" color="$primary">
                                    {totalObjects}
                                </Text>
                            </YStack>
                        </Link>
                    )}
                </AsyncView>
            </YStack>
        </DashboardCard>
    );
};