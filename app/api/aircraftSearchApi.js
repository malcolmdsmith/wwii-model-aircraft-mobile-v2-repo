import APIKit from "./apiKit";

function getUrl(uri) {
	return `/${uri}`;
}

function searchUrl(queryString) {
	return `/search?${queryString}`;
}

export function getSearchResults(queryString) {
	const url = searchUrl(queryString);
	////console.log(url);
	return APIKit.get(url);
}

export function getGroups() {
	return APIKit.get(getUrl("groups"));
}

export function getYears() {
	return APIKit.get(getUrl("aircrafts/years"));
}

export function getCountries() {
	return APIKit.get(getUrl("aircrafts/countries"));
}

export function getMedia() {
	return APIKit.get(getUrl("media"));
}

export function getScales() {
	return APIKit.get(getUrl("scales"));
}

export function getBrands() {
	return APIKit.get(getUrl("manufacturers/list"));
}

export function getKitMolds() {
	return APIKit.get(getUrl("aircraftmodels/kit_molds/list"));
}

export default {
	getGroups,
	getYears,
	getCountries,
	getMedia,
	getScales,
	getBrands,
	getKitMolds,
};
