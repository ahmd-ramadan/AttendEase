export interface ErrorResponse {
    success: boolean;
    msg: string;
    cause: number;
}

export const handleError = (error: any): ErrorResponse => {
    // console.log(error);

    const defaultError: ErrorResponse = { 
        success: false, 
        msg: 'لقد حدث خطأ',
        cause: 500
    };

    if (error.response) {
        // Server responded with an error
        const { msg } = error.response.data;

        return {
            success: false,
            msg,
            cause: error.response.status
        };
    } 
    return defaultError;
};