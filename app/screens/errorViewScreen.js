import React, { Component } from "react";
import { StyleSheet, View, Image, Dimensions, Text } from "react-native";
// import { Restart } from "fiction-expo-restart";
import localStorage from "@react-native-async-storage/async-storage";

import Screen from "../components/Screen";
import Button from "../components/Button";

class ErrorView extends Component {
	handleRestart = async () => {
		await localStorage.removeItem("@aircraft_search_data");
		await localStorage.removeItem("@brand_search_data");
		await localStorage.removeItem("@aircraft_favourites");
		// Restart();
	};

	// This component will be displayed when an error boundary catches an error
	render() {
		const dimensions = Dimensions.get("window");
		const imageHeight = Math.round((dimensions.width * 3) / 4);
		const imageWidth = dimensions.width - 40;

		return (
			<Screen>
				<View
					style={{
						flex: 1,
						justifyContent: "space-evenly",
						alignItems: "center",
					}}
				>
					<View>
						<Image
							style={{
								width: imageWidth,
								height: imageHeight,
								marginTop: 10,
								borderRadius: 20,
							}}
							source={require("../../app/assets/errorScreen.jpg")}
						/>
					</View>
					<View style={{ marginTop: 30 }}>
						<Image
							style={{ width: 150, height: 150 }}
							source={require("../../app/assets/oops.png")}
						/>
					</View>
					<Text style={{ textAlign: "center" }}>
						Sorry but the operation could not be completed! Make sure you are
						connected to the internet!.
					</Text>
					<View style={{ width: "100%" }}>
						<Button
							title="RESTART"
							onPress={() => this.handleRestart()}
						></Button>
					</View>
				</View>
			</Screen>
		);
	}
}

export default ErrorView;
