import APIKit from './apiKit';

function getUrl(uri) {
    return `/${uri}`;
}

export function getBrand(brand_id) {
    return APIKit.get(getUrl(`manufacturers/${brand_id}`));
}

export function getBrandImage(brand_id) {
    return APIKit.get(getUrl(`brandimages/mainimage/${brand_id}`));
}

export default {
    getBrand,
    getBrandImage
}
