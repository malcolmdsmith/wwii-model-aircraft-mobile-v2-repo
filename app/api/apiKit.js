import axios from "axios";
import getCurrentSettings from "../config/settings";

// Create axios client, pre-configured with baseURL
let APIKit = axios.create({
	baseURL: "https://wwii-model-aircraft-api-13442.nodechef.com/api",
	timeout: 10000,
});

axios.interceptors.response.use(function (response) {
	//console.log("==========", response.data.data);
	return response.data;
});

// Set JSON Web Token in Client to be included in all calls
export const setClientToken = (token) => {
	APIKit.interceptors.request.use(function (config) {
		config.headers.Authorization = `Bearer ${token}`;
		return config;
	});
};

export default APIKit;
