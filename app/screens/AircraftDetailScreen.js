import React, { Component } from "react";
import {
	StyleSheet,
	ScrollView,
	View,
	Image,
	Dimensions,
	Linking,
} from "react-native";
import localStorage from "@react-native-async-storage/async-storage";
import { isTablet } from "react-native-device-detection";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import { getAircraftImage, getAircraftDetails } from "../api/aircraftApi";
import Text from "../components/Text";
import Link from "../components/Link";
import BrandModelCard from "../components/BrandModelCard";
import Screen from "../components/Screen";
import routes from "../navigation/routes";
import colors from "../config/colors";
import ActivityIndicator from "../components/ActivityIndicator";
import ErrorView from "../components/ErrorView";
import logger from "../utility/logger";
import isObject from "../utility/isObject";

class AircraftDetailScreen extends Component {
	state = {
		loading: false,
		aircraftDetails: [],
		image: "",
		image_format: "",
		image_width: 0,
		image_height: 0,
		showErrorView: false,
	};

	callLoadScreen = async () => {
		try {
			const id = await localStorage.getItem("@aircraft_id");
			this.loadScreen(id);

			if (this.scrollListReftop)
				this.scrollListReftop.scrollTo({ x: 0, y: 0, animated: true });
		} catch (e) {
			this.logError(e);
		}
	};

	async componentDidMount() {
		try {
			let id = 0;
			let param = this.props.route.params;
			if (param === undefined) id = await localStorage.getItem("@aircraft_id");
			else id = param;

			await this.loadScreen(id);

			const willFocus = this.props.navigation.addListener(
				"focus",
				(payload) => {
					this.callLoadScreen();
				}
			);
		} catch (e) {
			this.logError(e);
		}
	}

	async loadScreen(id) {
		try {
			this.setState({ loading: true });
			const details = await getAircraftDetails(id);
			const image = await getAircraftImage(id);

			if (image.data)
				this.setState({
					aircraftDetails: details.data,
					image: image.data.aircraft_image,
					image_format: image.data.aircraft_image_format,
					image_width: image.data.image_width,
					image_height: image.data.image_height,
					loading: false,
				});
			else
				this.setState({
					aircraftDetails: details.data,
					image: "",
					image_format: "",
					image_height: 0,
					image_width: 0,
					loading: false,
				});
		} catch (err) {
			this.logError(err);
		}
	}

	logError(error) {
		//console.log("logError called");
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

	handleLinkSearchResults = () => {
		this.props.navigation.navigate(routes.AIRCRAFT_RESULTS);
	};

	handleBrandSelect = async (manufacturer_id) => {
		try {
			await localStorage.setItem(
				"@manufacturer_id",
				manufacturer_id.toString()
			);
			this.props.navigation.navigate(routes.BRAND_DETAIL);
		} catch (err) {
			this.logError(err);
		}
	};

	handleFavourites = async (aircraft_id) => {
		try {
			let jsonValue = await localStorage.getItem("@aircraft_favourites");
			let favourites = [];
			if (jsonValue != null) favourites = JSON.parse(jsonValue);
			////console.log(favourites);
			if (!favourites.includes(aircraft_id)) favourites.push(aircraft_id);
			jsonValue = JSON.stringify(favourites);
			await localStorage.setItem("@aircraft_favourites", jsonValue);
			this.props.navigation.push(routes.FAVOURITES);
		} catch (err) {
			this.logError(err);
		}
	};

	render() {
		const {
			aircraftDetails,
			image,
			image_format,
			image_width,
			image_height,
			loading,
			showErrorView,
		} = this.state;

		if (!aircraftDetails[0]) return null;

		const dimensions = Dimensions.get("window");
		const imageWidth = dimensions.width - 40;

		let aircraft_image = {};
		if (image)
			aircraft_image = (
				<Image
					style={{
						width: imageWidth,
						height: undefined,
						borderRadius: 20,
						borderColor: "#000000",
						borderWidth: 1,
						aspectRatio: image_width / image_height,
					}}
					source={{ uri: "data:image/" + image_format + ";base64," + image }}
				/>
			);
		else
			aircraft_image = (
				<Image
					style={{
						width: 280,
						height: 280,
						borderRadius: 20,
						borderColor: "#000000",
						borderWidth: 1,
					}}
					source={require("../assets/plane.png")}
				/>
			);
		let wikipedia = null;
		if (aircraftDetails[0].wikilink)
			wikipedia = (
				<Link
					title="Wikipedia"
					fontSize={isTablet ? 20 : 14}
					onPress={() => {
						Linking.openURL(aircraftDetails[0].wikilink);
					}}
				/>
			);

		return (
			<>
				<ActivityIndicator visible={loading} />
				<Screen>
					{showErrorView ? (
						<ErrorView onContinue={() => this.handleContinueError()} />
					) : (
						<ScrollView
							ref={(ref) => {
								this.scrollListReftop = ref;
							}}
						>
							<View style={styles.resultslink}>
								<Link
									title="Search Results"
									icon="list-ul"
									onPress={this.handleLinkSearchResults}
								/>
							</View>
							<View style={styles.container}>
								<Text style={styles.title}>
									{aircraftDetails[0].aircraft_name}
								</Text>
								{aircraft_image}
								<View style={styles.favouritesContainer}>
									<Link
										title="Add to Favourites"
										icon="heart"
										fontSize={isTablet ? 20 : 14}
										onPress={() =>
											this.handleFavourites(aircraftDetails[0].aircraft_id)
										}
									/>
									{wikipedia}
								</View>
							</View>
							<View style={styles.card}>
								<Text style={styles.heading}>
									<FontAwesome5 name="plane" /> Primary Group
								</Text>
								<Text style={styles.detail}>
									{aircraftDetails[0].group_name}
								</Text>
								<Text style={styles.heading}>
									<FontAwesome5 name="calendar-alt" /> Year of Manufacture
								</Text>
								<Text style={styles.detail}>
									{aircraftDetails[0].year_of_manufacture}
								</Text>
								<Text style={styles.heading}>
									<FontAwesome5 name="flag-usa" /> Country of Manufacturer
								</Text>
								<Text style={styles.detail}>
									{aircraftDetails[0].country_of_manufacturer}
								</Text>
								<Text style={styles.heading}>
									<FontAwesome5 name="user-friends" /> Operators during WWII
								</Text>
								<Text style={styles.detail}>
									{aircraftDetails[0].operators_during_wwii}
								</Text>
							</View>
							<View style={styles.modelsContainer}>
								<Text style={styles.brandheading}>
									<MaterialCommunityIcons name="star" size={16} /> Brand Models
								</Text>
								{aircraftDetails.map((model, index) => (
									<BrandModelCard
										model={model}
										key={index}
										onPress={() =>
											this.handleBrandSelect(model.manufacturer_id)
										}
									></BrandModelCard>
								))}
								<View style={styles.line}></View>
							</View>
						</ScrollView>
					)}
				</Screen>
			</>
		);
	}
}

export default AircraftDetailScreen;

const styles = StyleSheet.create({
	card: {
		marginTop: 20,
	},
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: isTablet ? 20 : 16,
		fontWeight: "bold",
		marginBottom: 10,
		textAlign: "center",
	},
	heading: {
		fontSize: isTablet ? 18 : 12,
		backgroundColor: colors.bglight,
		width: "100%",
		height: 38,
		paddingLeft: 5,
		paddingTop: isTablet ? 10 : 11,
	},
	brandheading: {
		fontSize: isTablet ? 18 : 12,
		backgroundColor: colors.bglight,
		width: "100%",
		height: 70,
		paddingLeft: 5,
		paddingTop: 30,
	},
	detail: {
		fontSize: isTablet ? 18 : 12,
		fontWeight: "bold",
		color: colors.data,
		alignSelf: "center",
		minHeight: 30,
		paddingTop: isTablet ? 6 : 7,
	},
	lastdetail: {
		fontSize: isTablet ? 18 : 12,
		fontWeight: "bold",
		color: colors.data,
		alignSelf: "center",
		minHeight: 30,
	},
	line: {
		borderBottomColor: "lightgray",
		borderBottomWidth: 2,
		marginBottom: 5,
	},
	resultslink: {
		alignItems: "flex-end",
		marginBottom: 20,
	},
	favouritesContainer: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-between",
		width: "100%",
		marginTop: 20,
	},
	modelsContainer: {
		marginBottom: 50,
	},
});
