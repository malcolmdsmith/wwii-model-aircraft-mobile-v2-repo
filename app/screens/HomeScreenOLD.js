import React from "react";
import { StyleSheet, View, Dimensions, Image, ScrollView } from "react-native";
import HTMLView from "react-native-htmlview";
import { isTablet } from "react-native-device-detection";
import Constants from "expo-constants";

import Screen from "../components/Screen";
import Text from "../components/Text";
import Link from "../components/Link";
import { SponsorCard } from "../components/SponsorCard";
import routes from "../navigation/routes";
import { getSponsors } from "../api/sponsorsApi";
import ActivityIndicator from "../components/ActivityIndicator";
import ErrorView from "../components/ErrorView";
import logger from "../utility/logger";
import ImageViewer from "../components/ImageViewer";

class HomeScreen extends React.Component {
	constructor(props) {
		super(props);
		//console.log(props);
	}

	state = {
		sponsors: [],
		loading: false,
		showErrorView: false,
		appVersion: "",
	};

	async componentDidMount() {
		await this.loadScreen();
	}

	async loadScreen() {
		try {
			this.setState({ loading: true });

			const sponsors = await getSponsors();
			const appVersion = Constants.manifest.version;
			this.setState({ sponsors: sponsors.data, appVersion, loading: false });
		} catch (err) {
			this.logError(err);
		}
	}

	logError(error) {
		logger.log(error);
		this.setState({ loading: false, showErrorView: true });
	}

	handleContinueError = async () => {
		try {
			this.setState({ showErrorView: false });
			await this.loadScreen();
		} catch (e) {
			//console.log(e);
		}
	};

	handleAircraftSelect = (aircraft_id) => {
		//console.log(this.props);
		return;
		this.props.navigation.navigate("Search", {
			screen: "AircraftDetail",
			params: { id: aircraft_id },
		});
	};

	render() {
		const { sponsors, loading, showErrorView, appVersion } = this.state;

		let htmlcontent = "";
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

		const dimensions = Dimensions.get("window");
		const imageHeight = Math.round((dimensions.width * 3) / 4);
		const imageWidth = dimensions.width - 40;

		return (
			<>
				<ActivityIndicator visible={loading} />
				<Screen style={styles.container}>
					{showErrorView ? (
						<ErrorView onContinue={() => this.handleContinueError()} />
					) : (
						<ScrollView>
							<Text style={styles.heading}>Aircraft Modelling for WWII</Text>
							<ImageViewer onAircraftSelect={this.handleAircraftSelect} />
							<Text style={styles.assumptionHeading}>
								Assumptions in this library:
							</Text>
							<View>
								<HTMLView value={htmlcontent} />
							</View>
							{/* <View  style={{marginTop:20}}>
                <Link title="Feedback" icon="envelope" onPress={() => this.handleFeedbackLink()}></Link>
            </View> */}
							<View style={styles.sponsorsContainer}>
								<Text style={styles.sponsorHeading}>Sponsors</Text>
								{sponsors.map((sponsor, index) => (
									<SponsorCard key={index} sponsor={sponsor} />
								))}
								<View style={styles.line}></View>
							</View>
							<View style={styles.appVersion}>
								<Text>App Version: {appVersion}</Text>
							</View>
						</ScrollView>
					)}
				</Screen>
			</>
		);
	}
}

const styles = StyleSheet.create({
	appVersion: {
		marginTop: 30,
		marginBottom: 30,
	},
	assumptionHeading: {
		fontSize: 16,
		marginBottom: 20,
		textDecorationLine: "underline",
	},
	container: {
		flex: 1,
		paddingLeft: isTablet ? 20 : 10,
		marginTop: 20,
	},
	heading: {
		fontSize: isTablet ? 26 : 20,
		fontWeight: "bold",
	},
	line: {
		borderBottomColor: "lightgray",
		borderBottomWidth: 2,
	},
	sponsorsContainer: {
		marginTop: 15,
		marginBottom: 40,
	},
	sponsorHeading: {
		fontSize: 18,
		textDecorationLine: "underline",
		marginBottom: 15,
	},
});

export default HomeScreen;
