export const isDev = () => !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const getApi = () => {
    if (!isDev()) {
        return "https://swim.phqsh.me/api/predict"
    } else {
        return "http://127.0.0.1:8000/predict"
    }
}