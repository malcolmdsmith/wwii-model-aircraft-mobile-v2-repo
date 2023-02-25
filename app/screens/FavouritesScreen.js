import React, { Component } from "react";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import localStorage from "@react-native-async-storage/async-storage";
import { ListItem, Icon } from "react-native-elements";
import ActivityIndicator from "../components/ActivityIndicator";

import { getFavourites } from "../api/aircraftApi";
import Text from "../components/Text";
import Link from "../components/Link";
import Screen from "../components/Screen";
import routes from "../navigation/routes";
import colors from "../config/colors";
import ErrorView from "../components/ErrorView";
import logger from "../utility/logger";

class FavouritesScreen extends Component {
	state = {
		aircrafts: [],
		loading: false,
		showErrorView: false,
	};

	async componentDidMount() {
		let favourites = [];
		try {
			this.setState({ loading: true });
			const jsonValue = await localStorage.getItem("@aircraft_favourites");
			if (jsonValue != null) favourites = JSON.parse(jsonValue);

			let items = [];
			if (favourites.length > 0) {
				let data = await getFavourites(favourites);
				items = data.data;
			}
			this.setState({ aircrafts: items, loading: false });
		} catch (e) {
			this.logError(e);
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

	deleteConfirmAlert = (aircraft) =>
		Alert.alert(
			"Confirm Remove",
			"Are you sure you wish to remove this favourite?",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{ text: "OK", onPress: () => this.handleRemove(aircraft) },
			]
		);

	deleteConfirmAlertAll = () =>
		Alert.alert(
			"Confirm Remove",
			"Are you sure you wish to remove all your favourite?",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{ text: "OK", onPress: () => this.handleRemoveAll() },
			]
		);

	handleItemSelect = async (item) => {
		try {
			await localStorage.setItem("@aircraft_id", item.aircraft_id.toString());
			this.props.navigation.navigate(routes.AIRCRAFT_DETAIL);
		} catch (err) {
			this.logError(err);
		}
	};

	handleRemove = async (aircraft) => {
		try {
			let jsonValue = await localStorage.getItem("@aircraft_favourites");
			let storageFavourites = [];
			if (jsonValue != null) storageFavourites = JSON.parse(jsonValue);

			const favourites = storageFavourites.filter(
				(item) => item !== aircraft.aircraft_id
			);
			jsonValue = JSON.stringify(favourites);
			await localStorage.setItem("@aircraft_favourites", jsonValue);
			const aircrafts = this.state.aircrafts.filter(
				(item) => item.aircraft_id !== aircraft.aircraft_id
			);
			this.setState({ aircrafts });
		} catch (error) {
			this.logError(error);
		}
	};

	handleRemoveAll = async () => {
		try {
			const favourites = [];
			const jsonValue = JSON.stringify(favourites);
			await localStorage.setItem("@aircraft_favourites", jsonValue);
			this.setState({ aircrafts: favourites });
		} catch (error) {
			this.logError(error);
		}
	};

	handleLinkSearchResults = () => {
		try {
			this.props.navigation.navigate(routes.AIRCRAFT_RESULTS);
		} catch (err) {
			this.logError(err);
		}
	};

	render() {
		const { aircrafts, loading, showErrorView } = this.state;

		return (
			<>
				<ActivityIndicator visible={loading} />
				<Screen>
					{showErrorView ? (
						<ErrorView onContinue={() => this.handleContinueError()} />
					) : (
						<ScrollView>
							<View style={styles.headingContainer}>
								<Text style={{ fontSize: 16 }}>
									<MaterialCommunityIcons
										name="cards-heart"
										size={16}
										color="red"
									/>{" "}
									Favourites
								</Text>
								<Link
									title="Remove All"
									icon="trash"
									onPress={() => this.deleteConfirmAlertAll()}
								/>
							</View>
							{aircrafts.map((aircraft, i) => (
								<ListItem key={i} bottomDivider>
									<Icon name="plane" type="font-awesome" />
									<ListItem.Content>
										<ListItem.Title
											style={{ color: colors.alternate }}
											onPress={() => this.handleItemSelect(aircraft)}
										>
											{aircraft.aircraft_name}
											<Link
												title="Remove"
												onPress={() => this.deleteConfirmAlert(aircraft)}
											/>
										</ListItem.Title>
									</ListItem.Content>
									<ListItem.Chevron />
								</ListItem>
							))}
						</ScrollView>
					)}
				</Screen>
			</>
		);
	}
}

export default FavouritesScreen;

const styles = StyleSheet.create({
	headingContainer: {
		flexDirection: "row",
		marginBottom: 20,
		justifyContent: "space-between",
	},
	resultslink: {
		alignItems: "flex-end",
		marginBottom: 20,
	},
});
