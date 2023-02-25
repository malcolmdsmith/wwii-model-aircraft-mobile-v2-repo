import React, { Component } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import localStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import routes from "../navigation/routes";
import {
	Form,
	FormField,
	FormPicker as Picker,
	SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import {
	getGroups,
	getYears,
	getCountries,
	getMedia,
	getScales,
	getBrands,
	getKitMolds,
} from "../api/aircraftSearchApi";
import ActivityIndicator from "../components/ActivityIndicator";
import isObject from "../utility/isObject";
import ErrorView from "../components/ErrorView";
import logger from "../utility/logger";

const searchData = {
	aircraft_name: "",
	year_of_manufacture: 0,
	country_of_manufacturer: "",
	manufacturer_id: 0,
	primary_group_id: 0,
	media_id: 0,
	scale_id: 0,
	kit_mold: "",
	kit_no: "",
};

class AircraftSearchScreen extends Component {
	state = {
		groups: [],
		years: [],
		countries: [],
		media: [],
		scales: [],
		brands: [],
		kit_molds: [],
		searchData: searchData,
		loading: false,
		showErrorView: false,
	};

	async componentDidMount() {
		try {
			// //console.log("componentDidMount...");
			this.setState({ loading: true });
			let groups, years, countries, media, scales, brands;
			await getGroups().then((data) => (groups = data.data));
			await getYears().then((data) => (years = data.data));
			await getCountries().then((data) => (countries = data.data));
			await getMedia().then((data) => (media = data.data));
			await getScales().then((data) => (scales = data.data));
			await getBrands().then((data) => (brands = data.data));
			await getKitMolds().then((data) => (kit_molds = data.data));
			this.setState({
				groups,
				years,
				countries,
				media,
				scales,
				brands,
				kit_molds,
			});

			await this.getLocalStorage();
			this.setState({ loading: false });
		} catch (e) {
			this.logError(e);
		}
	}

	logError(error) {
		localStorage.setItem("@aircraft_search_data", "");
		logger.log(error);
		this.setState({ loading: false, showErrorView: true });
	}

	handleContinueError = () => {
		try {
			this.props.navigation.navigate(routes.SEARCH_SELECT);
		} catch (e) {
			//console.log(e);
		}
	};

	async getLocalStorage() {
		let searchData;

		try {
			const jsonValue = await localStorage.getItem("@aircraft_search_data");
			searchData = jsonValue != null ? JSON.parse(jsonValue) : null;
			//     //console.log("getLocalStorage...", searchData.country_of_manufacturer);
		} catch (e) {
			this.logError(e);
		}
		if (searchData) this.setState({ searchData });
	}

	async setLocalStorage(searchData) {
		try {
			const jsonValue = JSON.stringify(searchData);
			await localStorage.setItem("@aircraft_search_data", jsonValue);
			//      //console.log("setLocalStorage...", searchData.country_of_manufacturer);
		} catch (e) {
			this.logError(e);
		}
	}

	handleReset = async () => {
		try {
			await this.setLocalStorage(searchData);
			this.setState(searchData);
			//    //console.log("reset: ", searchData.country_of_manufacturer);
		} catch (err) {
			this.logError(err);
		}
	};

	handleSubmit = async ({
		aircraft_name,
		manufacturer_id,
		year_of_manufacture,
		country_of_manufacturer,
		primary_group_id,
		media_id,
		scale_id,
		kit_mold,
		kit_no,
	}) => {
		try {
			let searchData = {
				aircraft_name: "",
				year_of_manufacture: 0,
				country_of_manufacturer: "",
				manufacturer_id: 0,
				primary_group_id: 0,
				media_id: 0,
				scale_id: 0,
				kit_mold: "",
				kit_no: "",
			};
			////console.log("handleSubmit...", country_of_manufacturer);
			searchData.aircraft_name = aircraft_name;
			searchData.kit_no = kit_no;
			if (isObject(year_of_manufacture))
				searchData.year_of_manufacture =
					year_of_manufacture.year_of_manufacture;
			else searchData.year_of_manufacture = year_of_manufacture;
			if (isObject(country_of_manufacturer))
				searchData.country_of_manufacturer =
					country_of_manufacturer.country_of_manufacturer;
			else searchData.country_of_manufacturer = country_of_manufacturer;
			if (isObject(manufacturer_id))
				searchData.manufacturer_id = manufacturer_id.manufacturer_id;
			else searchData.manufacturer_id = manufacturer_id;
			if (isObject(primary_group_id))
				searchData.primary_group_id = primary_group_id.group_id;
			else searchData.primary_group_id = primary_group_id;
			if (isObject(media_id)) searchData.media_id = media_id.media_id;
			else searchData.media_id = media_id;
			if (isObject(scale_id)) searchData.scale_id = scale_id.scale_id;
			else searchData.scale_id = scale_id;
			if (isObject(kit_mold)) searchData.kit_mold = kit_mold.kit_mold;
			else searchData.kit_mold = kit_mold;

			await this.setLocalStorage(searchData);

			this.props.navigation.navigate(routes.AIRCRAFT_RESULTS);
		} catch (e) {
			this.logError(e);
		}
	};

	render() {
		const {
			groups,
			years,
			countries,
			media,
			scales,
			brands,
			kit_molds,
			searchData,
			loading,
			showErrorView,
		} = this.state;
		// //console.log("render: ", searchData.country_of_manufacturer);

		return (
			<>
				<ActivityIndicator visible={loading} />
				<Screen style={styles.container}>
					{showErrorView ? (
						<ErrorView onContinue={() => this.handleContinueError()} />
					) : (
						<View>
							<ScrollView>
								<Form
									initialValues={searchData}
									onSubmit={this.handleSubmit}
									resetValues={{
										aircraft_name: "",
										year_of_manufacture: 0,
										country_of_manufacturer: "",
										manufacturer_id: 0,
										primary_group_id: 0,
										media_id: 0,
										scale_id: 0,
										kit_mold: "",
										kit_no: "",
									}}
									onHandleReset={this.handleReset}
								>
									<View style={styles.fieldsContainer}>
										<Text style={styles.title}>
											<FontAwesome5 name="paper-plane" size={22} /> AIRCRAFT
										</Text>
										<Text style={styles.text}>Select search criteria:</Text>
										<FormField
											autoCapitalize="none"
											autoCorrect={false}
											icon="pencil"
											keyboardType="default"
											name="aircraft_name"
											placeholder="Aircraft name"
										/>
										<Picker
											items={groups}
											icon="airplane"
											numberOfColumns={1}
											name="primary_group_id"
											placeholder="Aircraft Type"
											width="100%"
											valueProperty="group_id"
											textProperty="group_name"
										/>
										<Picker
											items={brands}
											icon="tools"
											numberOfColumns={1}
											name="manufacturer_id"
											placeholder="Brand"
											width="100%"
											valueProperty="manufacturer_id"
											textProperty="manufacturer_fullname"
										/>
										<Picker
											items={years}
											icon="calendar-month"
											numberOfColumns={1}
											name="year_of_manufacture"
											placeholder="Year of manufacture"
											width="100%"
											valueProperty="year_of_manufacture"
											textProperty="year_of_manufacture"
										/>
										<Picker
											items={countries}
											icon="flag-checkered"
											numberOfColumns={1}
											name="country_of_manufacturer"
											placeholder="Country of manufact."
											width="100%"
											valueProperty="country_of_manufacturer"
											textProperty="country_of_manufacturer"
										/>
										<Picker
											items={media}
											icon="dna"
											numberOfColumns={1}
											name="media_id"
											placeholder="Model Media"
											width="100%"
											valueProperty="media_id"
											textProperty="media_name"
										/>
										<Picker
											items={scales}
											icon="scale-balance"
											numberOfColumns={1}
											name="scale_id"
											placeholder="Scale"
											width="100%"
											valueProperty="scale_id"
											textProperty="scale_range"
										/>
										<Picker
											items={kit_molds}
											icon="hard-hat"
											numberOfColumns={1}
											name="kit_mold"
											placeholder="Kit Mold"
											width="100%"
											valueProperty="kit_mold"
											textProperty="kit_mold"
										/>
										<FormField
											autoCapitalize="none"
											autoCorrect={false}
											icon="pencil"
											keyboardType="default"
											name="kit_no"
											placeholder="Kit No."
										/>
									</View>
									<SubmitButton title="Search" color="primary"></SubmitButton>
								</Form>
							</ScrollView>
						</View>
					)}
				</Screen>
			</>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	fieldsContainer: {
		borderWidth: 1,
		borderRadius: 10,
		borderColor: "darkgray",
		padding: 10,
	},
	text: {
		margin: 10,
		color: "darkgray",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "darkgray",
		padding: 5,
	},
});

export default AircraftSearchScreen;
