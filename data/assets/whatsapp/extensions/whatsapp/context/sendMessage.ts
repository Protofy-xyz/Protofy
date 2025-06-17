
import axios from "axios";
import protoInfraUrls from '@extensions/protoinfra/utils/protoInfraUrls'

export const sendMessage = async (phone: string, message: string) => {
    const response = axios.post(protoInfraUrls.whatsapp.api+'/sendMessage', {phone, message});
    // console.log("response", response);
}