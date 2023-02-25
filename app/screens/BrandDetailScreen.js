import React, { Component } from "react";
import {
	StyleSheet,
	ScrollView,
	View,
	Image,
	Dimensions,
	Linking,
} from "react-native";
import { ListItem, Icon } from "react-native-elements";
import { isTablet } from "react-native-device-detection";
import localStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import ActivityIndicator from "../components/ActivityIndicator";

import { getBrandImage, getBrand } from "../api/brandApi";
import { getBrandAircrafts } from "../api/aircraftApi";

import Text from "../components/Text";
import Link from "../components/Link";
import Screen from "../components/Screen";
import routes from "../navigation/routes";
import colors from "../config/colors";
import ErrorView from "../components/ErrorView";
import logger from "../utility/logger";

class BrandDetailScreen extends Component {
	state = {
		loading: false,
		brand: {},
		aircrafts: [],
		image: "",
		image_format: "",
		image_width: 0,
		image_height: 0,
		showErrorView: false,
	};

	callLoadScreen = async () => {
		try {
			//console.log("callLoadScreen...");
			const id = await localStorage.getItem("@manufacturer_id");
			this.loadScreen(id);

			this.scrollListReftop.scrollTo({ x: 0, y: 0, animated: true });
		} catch (e) {
			this.logError(e);
		}
	};

	async componentDidMount() {
		try {
			let id = this.props.route.params;
			if (id === undefined) id = await localStorage.getItem("@manufacturer_id");
			//console.log(id);
			await this.loadScreen(id);

			const willFocus = this.props.navigation.addListener(
				"focus",
				(payload) => {
					this.callLoadScreen();
				}
			);
		} catch (err) {
			this.logError(err);
		}
	}

	async loadScreen(id) {
		try {
			this.setState({ loading: true });
			const brand = await getBrand(id);
			const aircrafts = await getBrandAircrafts(id);
			const image = await getBrandImage(id);

			if (image.data) {
				this.setState({
					brand: brand.data,
					aircrafts: aircrafts.data,
					image: image.data.brand_image,
					image_format: image.data.brand_image_format,
					image_width: image.data.image_width,
					image_height: image.data.image_height,
					loading: false,
				});
			} else
				this.setState({
					brand: brand.data,
					aircrafts: aircrafts.data,
					loading: false,
				});
		} catch (err) {
			this.logError(err);
		}
	}

	logError(error) {
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
		try {
			this.props.navigation.navigate(routes.BRAND_RESULTS);
		} catch (err) {
			this.logError(err);
		}
	};

	handleAircraftSelect = async (aircraft_id) => {
		try {
			await localStorage.setItem("@aircraft_id", aircraft_id.toString());
			this.props.navigation.navigate(routes.AIRCRAFT_DETAIL);
		} catch (err) {
			this.logError(err);
		}
	};

	render() {
		const {
			aircrafts,
			brand,
			image,
			image_format,
			image_width,
			image_height,
			loading,
			showErrorView,
		} = this.state;
		const dimensions = Dimensions.get("window");
		const width = dimensions.width - 40;
		const height = dimensions.width * (3 / 4);

		let brand_image = {};
		if (image)
			brand_image = (
				<Image
					style={{
						width: width,
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
			brand_image = (
				<Image
					style={{
						width: width - 20,
						height: height,
						borderRadius: 20,
						borderColor: "#000000",
						borderWidth: 1,
					}}
					source={require("../assets/brand.jpg")}
				/>
			);

		let wikipedia = null;
		if (brand.website)
			wikipedia = (
				<Link
					title="View Website"
					onPress={() => {
						Linking.openURL(brand.website);
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
								<Text style={styles.title}>{brand.manufacturer_fullname}</Text>
								{brand_image}
								{wikipedia}
							</View>
							<View style={styles.card}>
								<Text style={styles.heading}>
									<FontAwesome5 name="flag-usa" /> Country of Origin
								</Text>
								<Text style={styles.detail}>{brand.country_of_origin}</Text>
								<Text style={styles.heading}>
									<FontAwesome5 name="calendar-alt" /> Years Active
								</Text>
								<Text style={styles.detail}>{brand.years_active}</Text>
								<Text style={styles.heading}>
									<FontAwesome5 name="copyright" /> Related Brands
								</Text>
								<Text style={styles.detail}>{brand.related_brands_logos}</Text>
								<Text style={styles.heading}>
									<FontAwesome5 name="hard-hat" /> Kit Molds
								</Text>
								<Text style={styles.detail}>{brand.kitmolds}</Text>
							</View>
							<View style={styles.modelsContainer}>
								<Text style={styles.brandheading}>
									<FontAwesome5 name="plane" /> Brand Aircaft
								</Text>
								<View style={styles.line}></View>
								<View style={styles.aircraftContainer}>
									{aircrafts.map((aircraft, index) => (
										<ListItem key={index} bottomDivider>
											<Icon name="plane" type="font-awesome" />
											<ListItem.Content>
												<ListItem.Title
													style={{ color: colors.tertiary }}
													onPress={() =>
														this.handleAircraftSelect(aircraft.aircraft_id)
													}
												>
													{aircraft.aircraft_name}
												</ListItem.Title>
											</ListItem.Content>
											<ListItem.Chevron />
										</ListItem>
									))}
								</View>
							</View>
						</ScrollView>
					)}
				</Screen>
			</>
		);
	}
}

export default BrandDetailScreen;

const styles = StyleSheet.create({
	aircraftContainer: {
		marginBottom: 15,
	},
	card: {
		marginTop: 10,
	},
	line: {
		borderBottomColor: "lightgray",
		borderBottomWidth: 2,
		marginBottom: 10,
	},
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
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
		paddingTop: isTablet ? 10 : 13,
	},
	brandheading: {
		fontSize: isTablet ? 20 : 14,
		backgroundColor: colors.bglight,
		width: "100%",
		height: 70,
		paddingLeft: 15,
		paddingTop: 27,
	},
	detail: {
		fontWeight: "bold",
		fontSize: isTablet ? 18 : 12,
		color: colors.data,
		alignSelf: "center",
		minHeight: 30,
		paddingTop: isTablet ? 6 : 9,
	},
	resultslink: {
		alignItems: "flex-end",
		paddingRight: 10,
		marginBottom: 20,
	},

	modelsContainer: {
		marginTop: 0,
	},
});
