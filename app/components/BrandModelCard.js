import React from "react";
import { View, StyleSheet } from "react-native";
import { isTablet } from "react-native-device-detection";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

import Text from "../components/Text";
import Link from "../components/Link";
import colors from "../config/colors";

function BrandModelCard({ model, onPress }) {
	return (
		<View style={styles.line}>
			<View style={styles.heading}>
				<Link
					title={model.manufacturer_fullname}
					onPress={onPress}
					fontSize={isTablet ? 18 : 14}
				/>
			</View>
			<Text style={styles.label}>
				<MaterialCommunityIcons name="flag-checkered" size={14} /> Country of
				Origin
			</Text>
			<Text style={styles.bold}>{model.country_of_origin}</Text>
			<Text style={styles.label}>
				<MaterialCommunityIcons name="dna" size={14} /> Media
			</Text>
			<Text style={styles.bold}>{model.media_name}</Text>
			<Text style={styles.label}>
				<MaterialCommunityIcons name="scale-balance" size={14} /> Scale
			</Text>
			<Text style={styles.bold}>{model.scale_range}</Text>
			<Text style={styles.label}>
				<MaterialCommunityIcons name="shield-airplane-outline" size={14} /> Kit
				Mold
			</Text>
			<Text style={styles.bold}>{model.kit_mold}</Text>
			<Text style={styles.label}>
				<FontAwesome name="hashtag" size={14} /> Kit No.
			</Text>
			<Text style={styles.bold}>{model.kit_no}</Text>
		</View>
	);
}

export default BrandModelCard;

const styles = StyleSheet.create({
	line: {
		borderTopColor: "darkgray",
		borderTopWidth: 2,
		marginBottom: 5,
	},
	bold: {
		fontWeight: "bold",
		fontSize: isTablet ? 18 : 12,
		color: colors.data,
		alignSelf: "center",
	},
	label: {
		fontSize: isTablet ? 18 : 12,
		backgroundColor: colors.bglight,
		width: "100%",
		height: 40,
		paddingLeft: 5,
		paddingTop: isTablet ? 11 : 14,
	},
	itemContainer: {
		flexDirection: "row",
	},
	heading: {
		height: 40,
		paddingTop: isTablet ? 11 : 13,
	},
});
