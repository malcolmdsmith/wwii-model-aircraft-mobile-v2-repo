import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";

import Button from "../components/Button";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import { isTablet } from "react-native-device-detection";

class SearchSelectScreen extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { navigation } = this.props;

		const dimensions = Dimensions.get("window");
		const imageHeight = Math.round((dimensions.width * 3) / 4);
		const imageWidth = dimensions.width - 40;

		return (
			<Screen>
				<View style={styles.container}>
					<Button
						title="Aircraft"
						color="primary"
						icon="paper-plane"
						onPress={() => navigation.navigate(routes.AIRCRAFT_SEARCH)}
					></Button>
					<Button
						title="Brand"
						color="primary"
						icon="star"
						onPress={() => navigation.navigate(routes.BRAND_SEARCH)}
					></Button>
					<Button
						title="Favourites"
						color="tertiary"
						icon="heart"
						onPress={() => navigation.navigate(routes.FAVOURITES)}
					></Button>
					<Image
						style={{
							width: imageWidth,
							height: imageHeight,
							borderRadius: 20,
							borderWidth: 1,
							borderColor: "black",
						}}
						source={require("../assets/selectScreen.jpg")}
					/>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "space-evenly",
	},
});

export default SearchSelectScreen;
