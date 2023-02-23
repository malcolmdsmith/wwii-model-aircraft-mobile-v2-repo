import APIKit from "./apiKit";

function getUrl(uri) {
	return `/${uri}`;
}

function imageUrl(aircraft_id) {
	return `/aircraftimages/mainimage/${aircraft_id}}`;
}

export function getImages(offset, imageCount) {
	const url = `aircraftimages/images?offset=${offset}&imageCount=${imageCount}`;
	return APIKit.get(getUrl(url));
}

export function getImageByAlpha(char) {
	const url = `aircraftimages/imagebyalpha?char=${char}`;
	return APIKit.get(getUrl(url));
}

export function getImageCount() {
	return APIKit.get(getUrl("aircraftimages/count"));
}

export function getAircraftImage(aircraft_id) {
	return APIKit.get(imageUrl(aircraft_id));
}

export function getPrimaryGroup(id) {
	return APIKit.get(getUrl(`groups/${id}`));
}

export function getAircraftDetails(aircraft_id) {
	return APIKit.get(getUrl(`aircraftDetails/${aircraft_id}`));
}

export function getBrandAircrafts(manufacturer_id) {
	return APIKit.get(getUrl(`aircrafts/manufacturer/${manufacturer_id}`));
}

export function getFavourites(favourites) {
	const querystring = require("querystring");
	const url =
		"aircrafts/favourites?" +
		querystring.stringify({ favourites: JSON.stringify(favourites) });
	//    //console.log(url)
	return APIKit.get(url);
}

export default {
	getAircraftImage,
	getPrimaryGroup,
	getAircraftDetails,
	getBrandAircrafts,
	getImages,
};
