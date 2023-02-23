import APIKit from "./apiKit";

function getUrl(uri) {
	return `manufacturers/${uri}`;
}

function searchUrl(queryString) {
	return `manufacturers/search?${queryString}`;
}

export function getSearchResults(queryString) {
	const url = searchUrl(queryString);
	return APIKit.get(url);
}

export function getByAlpha(char) {
	return APIKit.get(getUrl(`alpha/${char}`));
}

export function getKitmolds() {
	return APIKit.get(getUrl("kitmolds"));
}

export function getYearsActive() {
	return APIKit.get(getUrl("yearsactive"));
}

export function getCountriesOfOrigin() {
	return APIKit.get(getUrl("countries"));
}

export function getRelatedBrands() {
	return APIKit.get(getUrl("brands"));
}

export default {
	getSearchResults,
	getKitmolds,
	getYearsActive,
	getCountriesOfOrigin,
	getRelatedBrands,
};
