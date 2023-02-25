import React, { Component } from "react";
import qs from "qs";
import { StyleSheet, ScrollView, View } from "react-native";
import localStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { isTablet } from "react-native-device-detection";

import { getSearchResults } from "../api/aircraftSearchApi";
import Screen from "../components/Screen";
import config from "../config/styles";
import Text from "../components/Text";
import Link from "../components/Link";
import SearchResults from "../components/SearchResults";
import routes from "../navigation/routes";
import ActivityIndicator from "../components/ActivityIndicator";
import ErrorView from "../components/ErrorView";
import logger from "../utility/logger";

class AircraftResultsScreen extends Component {
	state = {
		searchData: {},
		results: [],
		itemsCount: 0,
		loading: false,
	};

	async componentDidMount() {
		try {
			this.setState({ loading: true });
			await this.getLocalStorage();
			await this.getPagedData(1);
			this.setState({ loading: false });
		} catch (err) {
			this.logError(err);
		}
	}

	async getPagedData(page) {
		try {
			const { searchData } = this.state;

			searchData.currentPage = page;
			const queryString = qs.stringify(searchData);
			const searchResults = await getSearchResults(queryString);
			const aircrafts = searchResults.data.aircrafts;
			const itemsCount = searchResults.data.totalCount;

			this.setState({ results: aircrafts, itemsCount, searchData });
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

	async getLocalStorage() {
		let searchData;

		try {
			const jsonValue = await localStorage.getItem("@aircraft_search_data");
			searchData = jsonValue != null ? JSON.parse(jsonValue) : null;
			searchData.pageSize = 30;
			this.setState({ searchData });
		} catch (e) {
			this.logError(e);
		}
	}

	handlePageChange = async (page) => {
		try {
			this.setState({ loading: true });
			await this.getPagedData(page);
			this.setState({ loading: false });
			this.scrollListReftop.scrollToEnd(); //.scrollTo({x: 0, y: 0, animated: true})
		} catch (err) {
			this.logError(err);
		}
	};

	handleItemSelect = async (item) => {
		try {
			await localStorage.setItem("@aircraft_id", item.aircraft_id.toString());
			this.props.navigation.navigate(routes.AIRCRAFT_DETAIL);
		} catch (err) {
			this.logError(err);
		}
	};

	handleRefineSearch = () => {
		try {
			this.props.navigation.navigate(routes.AIRCRAFT_SEARCH);
		} catch (err) {
			this.logError(err);
		}
	};

	render() {
		const { results, itemsCount, searchData, loading, showErrorView } =
			this.state;

		return (
			<>
				<ActivityIndicator visible={loading} />
				<Screen style={styles.container}>
					{showErrorView ? (
						<ErrorView onContinue={() => this.handleContinueError()} />
					) : (
						<ScrollView
							ref={(ref) => {
								this.scrollListReftop = ref;
							}}
						>
							<Text style={{ fontSize: isTablet ? 20 : 16 }}>
								<MaterialCommunityIcons name="format-list-bulleted" /> Search
								Results
							</Text>
							<View style={styles.headingContainer}>
								<Link
									title="Refine Search"
									icon="search"
									onPress={this.handleRefineSearch}
								/>
							</View>
							<View>
								<SearchResults
									results={results}
									itemsCount={itemsCount}
									onPageChange={this.handlePageChange}
									OnItemSelect={this.handleItemSelect}
									valueProperty="aircraft_id"
									textProperty="aircraft_name"
									icon="plane"
									currentPage={searchData.currentPage}
									pageSize={searchData.pageSize}
								/>
							</View>
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
	headingContainer: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "flex-end",
		marginBottom: 20,
	},
});

export default AircraftResultsScreen;
