import { getData } from './apiService';
import { ITokenPayload, verifyToken } from './token';

export const getTokenCookiesData = async (): Promise<ITokenPayload | null> => {
    try {
        const { cookies }: any = await getData({
            endpoint: '/auth/get-cookies'
        });

        const token = cookies.filter((c: { name: string, value: string}) => c.name === 'jwt').pop();
        if (token) {
            const decoded: Promise<ITokenPayload | null> = verifyToken(token.value);
            if(decoded) return decoded;
            else return null;
        } else {
            return null
        }    
    } catch (error) {
        console.log("Error on geting cookies data: ", error);
        return null
    }
}
  