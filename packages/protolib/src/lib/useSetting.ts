import {useEffect, useState} from 'react';
import { API } from 'protobase';

export const useSetting = (key, defaultValue = null) => {
    const [value, setValue] = useState(defaultValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSetting = async () => {
            try {
                setLoading(true);
                const url = `/api/core/v1/settings/${key}`;
                const response = await API.get(url);

                if (response.isError) {
                    throw new Error(response.error?.error || response.error);
                }
                setValue(response.data?.value);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSetting();
    }, [key, defaultValue]);

    return { value, loading, error };
};

export const useSettingValue = (key, defaultValue = null) => {
    const { value } = useSetting(key, defaultValue);

    return value
}