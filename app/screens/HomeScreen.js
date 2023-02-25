import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	Dimensions,
	Image,
	ScrollView,
	Linking,
} from "react-native";
import HTMLView from "react-native-htmlview";
import { isTablet } from "react-native-device-detection";
import Constants from "expo-constants";
//import * as Device from "expo-device";
import localStorage from "@react-native-async-storage/async-storage";

import Screen from "../components/Screen";
import Text from "../components/Text";
import Link from "../components/Link";
import { SponsorCard } from "../components/SponsorCard";
import { getFacebookUrl } from "../api/userApi";
import routes from "../navigation/routes";
import { getSponsors } from "../api/sponsorsApi";
import ActivityIndicator from "../components/ActivityIndicator";
import ErrorView from "../components/ErrorView";
import logger from "../utility/logger";
import ImageViewer from "../components/ImageViewer";
import colors from "../config/colors";
const titleImage = require("../assets/title.png");
const titleTabletImage = require("../assets/titleTablet.png");
const facbookIconImage = require("../assets/facebookicon.png");

function HomeScreen({ navigation }) {
	const [sponsors, setSponsors] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showErrorView, setShowErrorView] = useState(false);
	const [appVersion, setAppVersion] = useState("");
	const [facebookUrl, setFacebookUrl] = useState("");

	useEffect(() => {
		(async () => await loadScreen())();
	}, []);

	const loadScreen = async () => {
		try {
			setLoading(true);

			const sponsors = await getSponsors();
			const appVersion = Constants.manifest.version;
			const url = await getFacebookUrl();

			setSponsors(sponsors.data);
			setAppVersion(appVersion);
			setFacebookUrl(url.data);
			setLoading(false);
		} catch (err) {
			logError(err);
		}
	};

	const logError = (error) => {
		logger.log(error);
		setLoading(false);
		setShowErrorView(true);
	};

	const handleContinueError = async () => {
		try {
			setShowErrorView(false);
			await loadScreen();
		} catch (e) {
			//console.log(e);
		}
	};

	const handleAircraftSelect = async (aircraft_id) => {
		await localStorage.setItem("@aircraft_id", aircraft_id.toString());
		navigation.navigate(routes.SEARCH, {
			screen: "AircraftDetail",
		});
	};

	const handleFeedbackLink = () => {
		//console.log("handleFeedbackLink");
		navigation.navigate(routes.FEEDBACK);
	};

	const getHomeText = () => {
		let htmlcontent = "<h3>About</h3>";
		htmlcontent += `<p>This app has been developed to promote and enhance the hobby of`;
		htmlcontent +=
			" building models. All Company Names and logos are the property of";
		htmlcontent +=
			" the registered trademark owner and are used in this application";
		htmlcontent +=
			" for identification and reference only. This app has been created";
		htmlcontent +=
			" and published under the provisions of Australian Copyright Law.</p>";
		htmlcontent += "<h5>WORLD WAR II Aircraft</h5>";
		htmlcontent += "<ul>";
		htmlcontent +=
			"<li>All <b>Manned</b> aircraft that served a <b>Military purpose</b> during the <b>WWII era 1939-1945</b>.</li>";
		htmlcontent += "<li>Excludes <b>Military Prototypes of this era</b>.</li>";
		htmlcontent +=
			"<li>Separates Variants that are of a significant change in construction/production/role.</li>";
		htmlcontent += "</ul><br/>";
		htmlcontent += "<h5>SCALE MODELLING</h5>";
		htmlcontent += "<ul>";
		htmlcontent += "<li>Includes <b>Full Kits</b> only.</li>";
		htmlcontent +=
			"<li>Excludes <b>Coversion Kits and/or Detail Kits</b>.</li>";
		htmlcontent +=
			"<li>Includes models representing Military <b>aircraft only</b>.</li>";
		htmlcontent +=
			"<li>Excludes models representing WWII protoypes not produced or involved in Military action.</li>";
		htmlcontent +=
			"<li>Excludes Kits of Aircraft relating only to other conflicts.ie Korean War.</li>";
		htmlcontent +=
			"<li>To source Molding/Reboxing for individual kits, serial numbers, check out <b>www.scalemates.com</b>.</li>";
		htmlcontent +=
			"<li>Where confirmed, <b>Future Releases</b> have been included.</li>";
		htmlcontent +=
			"<li>Where confirmed, <b>Planned Releases that never eventuated</b> have obviously not been included.</li>";
		htmlcontent += "</ul><br/>";
		htmlcontent += "<p><b>Note: Information updated monthly</b>.</p>";
		//htmlcontent += "<p>Contact: <a href='mailto:kevindavson980@gmail.com'>kevindavson980@gmail.com</a></p>";
		return htmlcontent;
	};

	const dimensions = Dimensions.get("window");
	const width = dimensions.width - 40;

	return (
		<>
			<ActivityIndicator visible={loading} />
			<Screen style={styles.container}>
				{showErrorView ? (
					<ErrorView onContinue={() => handleContinueError()} />
				) : (
					<ScrollView>
						<View style={styles.titleContainer}>
							{isTablet ? (
								<Image source={titleTabletImage} />
							) : (
								<Image source={titleImage} style={{ width: width }} />
							)}
						</View>
						<ImageViewer onAircraftSelect={handleAircraftSelect} />

						<View style={styles.aboutContainer}>
							<View>
								<HTMLView value={getHomeText()} stylesheet={styles} />
							</View>
							<View style={{ marginTop: 20 }}>
								<Link
									title="Feedback"
									icon="envelope"
									onPress={handleFeedbackLink}
								></Link>
							</View>

							<View style={styles.facebookUrlContainer}>
								<Image
									source={facbookIconImage}
									style={{ width: 50, height: 50 }}
								/>
								<Text
									style={{
										color: colors.tertiary,
										fontWeight: "bold",
									}}
									onPress={() => Linking.openURL(facebookUrl)}
								>
									Connect with us on Facebook.
								</Text>
							</View>
						</View>
						<View style={styles.sponsorsContainer}>
							<Text style={styles.sponsorHeading}>Acknowledgements</Text>
							{sponsors.map((sponsor, index) => (
								<SponsorCard key={index} sponsor={sponsor} />
							))}
							<View style={styles.line}></View>
						</View>
						<View style={styles.appVersion}>
							<Text>App Version: {appVersion}</Text>
							<Text>13 Sept 2022</Text>
						</View>
					</ScrollView>
				)}
			</Screen>
		</>
	);
}

const styles = StyleSheet.create({
	p: {
		textAlign: "justify",
	},
	aboutContainer: {
		borderWidth: 1,
		borderColor: "darkgray",
		borderRadius: 5,
		padding: 10,
	},
	appVersion: {
		marginTop: 30,
		marginBottom: 30,
	},
	container: {
		flex: 1,
		// paddingLeft: isTablet ? 20 : 10,
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 20,
	},
	facebookUrlContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 20,
	},
	heading: {
		fontSize: isTablet ? 30 : 20,
		fontWeight: "bold",
		textAlign: "center",
	},
	line: {
		borderBottomColor: "lightgray",
		borderBottomWidth: 2,
	},
	sponsorsContainer: {
		marginTop: 65,
		marginBottom: 40,
	},
	sponsorHeading: {
		fontSize: 18,
		textDecorationLine: "underline",
		marginBottom: 15,
	},
	titleContainer: {
		alignItems: "center",
	},
});

export default HomeScreen;
