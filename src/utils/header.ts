export const isHideHeader = (url: string): boolean => {
    const hideHeaderPages = [ 'login', 'signup'];
    const urlPage = url.split('/').pop() || "";
    return hideHeaderPages.includes(urlPage);
}