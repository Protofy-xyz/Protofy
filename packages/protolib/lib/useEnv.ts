import { useRouter } from 'next/router';

export const useEnv = () => {
    const { query } = useRouter();
    const env = query.env;
    if(!env) {
        return "development"
    } else if(env == 'development') {
        return "development"
    } else if(env == 'production') {
        return "production"
    } else {
        return "development"
    }
}