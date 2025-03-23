import axios from 'axios';
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const axiosInstance = axios.create({
    baseURL: SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export default axiosInstance;