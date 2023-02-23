import APIKit from './apiKit';

function getUrl(uri) {
    return `/${uri}`;
}

export function getSponsors() {
    return APIKit.get(getUrl(`sponsors`));
}

export default {
    getSponsors,
}