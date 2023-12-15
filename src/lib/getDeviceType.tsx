export function getDeviceType() {
    const userAgent = navigator.userAgent;

    if (/Mobi|Android/i.test(userAgent) || /Tablet|iPad/i.test(userAgent)) {
        return 'mobile';
    } else {
        return 'desktop';
    }
}