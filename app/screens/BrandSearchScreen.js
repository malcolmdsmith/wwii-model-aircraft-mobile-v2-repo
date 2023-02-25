import React, { Component } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import localStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import routes from "../navigation/routes";
import {
	Form,
	FormField,
	FormPicker as Picker,
	SubmitButton,
	ResetButton,
} from "../components/forms";
import AlphabetPicker from "../components/AlphabetPicker";
import Screen from "../components/Screen";
import { getGroups, getMedia, getScales } from "../api/aircraftSearchApi";
import {
	getKitmolds,
	getYearsActive,
	getCountriesOfOrigin,
	getRelatedBrands,
	getByAlpha,
} from "../api/brandSearchApi";
import ActivityIndicator from "../components/ActivityIndicator";
import isObject from "../utility/isObject";
import ErrorView from "../components/ErrorView";
import logger from "../utility/logger";

const searchData = {
	manufacturer_fullname: "",
	years_active: "",
	country_of_origin: "",
	aircraft_name: "",
	primary_group_id: 0,
	media_id: 0,
	scale_id: 0,
	related_brands_logos: "",
	kitmolds: "",
};

class BrandSearchScreen extends Component {
	state = {
		groups: [],
		yearsactive: [],
		countries: [],
		media: [],
		scales: [],
		relatedbrands: [],
		searchData: searchData,
		loading: false,
	};

	async componentDidMount() {
		try {
			this.setState({ loading: true });
			let groups, yearsActive, countries, media, scales, relatedBrands;
			await getGroups().then((data) => (groups = data.data));
			await getYearsActive().then((data) => (yearsActive = data.data));
			await getCountriesOfOrigin().then((data) => (countries = data.data));
			await getMedia().then((data) => (media = data.data));
			await getScales().then((data) => (scales = data.data));
			await getRelatedBrands().then((data) => (relatedBrands = data.data));

			this.setState({
				groups,
				yearsActive,
				countries,
				media,
				scales,
				relatedBrands,
			});

			await this.getLocalStorage();
			this.setState({ loading: false });
		} catch (err) {
			this.logError(err);
		}
	}

	logError(error) {
		localStorage.setItem("@brand_search_data", "");
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
			const jsonValue = await localStorage.getItem("@brand_search_data");
			searchData = jsonValue != null ? JSON.parse(jsonValue) : null;
			if (searchData) this.setState({ searchData });
		} catch (e) {
			this.logError(e);
		}
	}

	async setLocalStorage(searchData) {
		try {
			const jsonValue = JSON.stringify(searchData);
			await localStorage.setItem("@brand_search_data", jsonValue);
		} catch (e) {
			this.logError(e);
		}
	}

	handleReset = async () => {
		try {
			await this.setLocalStorage(searchData);
			this.setState(searchData);
			////console.log("reset: ", searchData);
		} catch (err) {
			this.logError(err);
		}
	};

	handleSubmit = async ({
		aircraft_name,
		manufacturer_fullname,
		years_active,
		country_of_origin,
		kitmolds,
		related_brands_logos,
		primary_group_id,
		media_id,
		scale_id,
	}) => {
		try {
			let searchData = {
				aircraft_name: "",
				manufacturer_fullname: "",
				years_active: "",
				country_of_origin: "",
				kitmolds: "",
				related_brands_logos: "",
				primary_group_id: 0,
				media_id: 0,
				scale_id: 0,
			};

			searchData.aircraft_name = aircraft_name;
			searchData.manufacturer_fullname = manufacturer_fullname;
			searchData.kitmolds = kitmolds;

			if (isObject(years_active))
				searchData.years_active = years_active.years_active;
			else searchData.years_active = years_active;

			if (isObject(country_of_origin))
				searchData.country_of_origin = country_of_origin.country_of_origin;
			else searchData.country_of_origin = country_of_origin;

			if (isObject(related_brands_logos))
				searchData.related_brands_logos =
					related_brands_logos.related_brands_logos;
			else searchData.related_brands_logos = related_brands_logos;

			if (isObject(primary_group_id))
				searchData.primary_group_id = primary_group_id.group_id;
			else searchData.primary_group_id = primary_group_id;

			if (isObject(media_id)) searchData.media_id = media_id.media_id;
			else searchData.media_id = media_id;

			if (isObject(scale_id)) searchData.scale_id = scale_id.scale_id;
			else searchData.scale_id = scale_id;

			this.setLocalStorage(searchData);

			this.props.navigation.navigate(routes.BRAND_RESULTS);
		} catch (err) {
			this.logError(err);
		}
	};

	handleAlphaChange = (char) => {
		let searchData = {
			alpha: char,
			aircraft_name: "",
			manufacturer_fullname: "",
			years_active: "",
			country_of_origin: "",
			kitmolds: "",
			related_brands_logos: "",
			primary_group_id: 0,
			media_id: 0,
			scale_id: 0,
		};
		this.setLocalStorage(searchData);

		this.props.navigation.navigate(routes.BRAND_RESULTS);
	};

	render() {
		const {
			groups,
			yearsActive,
			countries,
			media,
			scales,
			relatedBrands,
			searchData,
			loading,
			showErrorView,
		} = this.state;

		return (
			<>
				<ActivityIndicator visible={loading} />
				<Screen style={styles.container}>
					{showErrorView ? (
						<ErrorView onContinue={() => this.handleContinueError()} />
					) : (
						<ScrollView>
							<Form
								initialValues={searchData}
								onSubmit={this.handleSubmit}
								resetValues={{
									aircraft_name: "",
									manufacturer_fullname: "",
									years_active: "",
									country_of_origin: "",
									kitmolds: "",
									related_brands_logos: "",
									primary_group_id: 0,
									media_id: 0,
									scale_id: 0,
								}}
								onHandleReset={this.handleReset}
							>
								<View style={styles.fieldsContainer}>
									<Text style={styles.title}>
										<MaterialCommunityIcons name="star" size={22} /> BRANDS
									</Text>
									<Text style={styles.text}>Select search criteria:</Text>
									<FormField
										autoCapitalize="none"
										autoCorrect={false}
										icon="pencil"
										keyboardType="default"
										name="manufacturer_fullname"
										placeholder="Brand name"
									/>
									<FormField
										autoCapitalize="none"
										autoCorrect={false}
										icon="pencil"
										keyboardType="default"
										name="aircraft_name"
										placeholder="Aircraft name"
									/>
									<FormField
										autoCapitalize="none"
										autoCorrect={false}
										icon="hard-hat"
										keyboardType="default"
										name="kitmolds"
										placeholder="Kitmolds"
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
										items={yearsActive}
										icon="calendar-month"
										numberOfColumns={1}
										name="years_active"
										placeholder="Years Active"
										width="100%"
										valueProperty="years_active"
										textProperty="years_active"
									/>
									<Picker
										items={countries}
										icon="flag-checkered"
										numberOfColumns={1}
										name="country_of_origin"
										placeholder="Country of Origin"
										width="100%"
										valueProperty="country_of_origin"
										textProperty="country_of_origin"
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
										items={relatedBrands}
										icon="tools"
										numberOfColumns={1}
										name="related_brands_logos"
										placeholder="Related Brands Logos"
										width="100%"
										valueProperty="related_brands_logos"
										textProperty="related_brands_logos"
									/>
								</View>
								<AlphabetPicker
									onAlphaChange={this.handleAlphaChange}
									color="#06613B"
									includeNumbers={true}
								/>
								<SubmitButton title="Search" color="primary"></SubmitButton>
							</Form>
						</ScrollView>
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
		marginBottom: 20,
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

export default BrandSearchScreen;
