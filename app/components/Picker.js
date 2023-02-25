import React, { useState } from "react";
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Modal,
	FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Text from "./Text";
import defaultStyles from "../config/styles";
import PickerItem from "./PickerItem";
import Screen from "./Screen";
import Button from "./Button";
import isObject from "../utility/isObject";

function getSelectedItem(
	items,
	selectedItem,
	valueProperty,
	textProperty,
	placeholder
) {
	let result;
	if (items === undefined)
		return <Text style={styles.placeholder}>{placeholder}</Text>;

	if (selectedItem && isObject(selectedItem)) {
		result = <Text style={styles.text}>{selectedItem[textProperty]}</Text>;
	} else if (selectedItem && items) {
		result = (
			<Text style={styles.text}>
				{items &&
					items.filter((item) => item[valueProperty] === selectedItem)[0][
						textProperty
					]}
			</Text>
		);
	} else {
		result = <Text style={styles.placeholder}>{placeholder}</Text>;
	}

	return result;
}

function AppPicker({
	icon,
	items,
	numberOfColumns = 1,
	onSelectItem,
	onClearItem,
	PickerItemComponent = PickerItem,
	placeholder,
	selectedItem,
	width = "100%",
	textProperty,
	valueProperty,
}) {
	const [modalVisible, setModalVisible] = useState(false);
	////console.log("SelectedItem...", textProperty, selectedItem);
	////console.log("==", items.filter(item => item[valueProperty] === selectedItem)[0][textProperty]);
	////console.log(items);
	return (
		<>
			<TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
				<View style={[styles.container, { width }]}>
					{icon && (
						<MaterialCommunityIcons
							name={icon}
							size={20}
							color={defaultStyles.colors.medium}
							style={styles.icon}
						/>
					)}
					{getSelectedItem(
						items,
						selectedItem,
						valueProperty,
						textProperty,
						placeholder
					)}

					<MaterialCommunityIcons
						name="chevron-down"
						size={20}
						color={defaultStyles.colors.medium}
					/>
				</View>
			</TouchableWithoutFeedback>
			<Modal visible={modalVisible} animationType="slide">
				<Screen>
					<View style={styles.closeContainer}>
						<Button
							title="Close"
							color="tertiary"
							onPress={() => setModalVisible(false)}
						/>
					</View>
					{/* <View  style={styles.clearContainer}>
            <Button title="Clear" color="secondary" onPress={() => {
                      setModalVisible(false);
                      onSelectItem(null);
                      }} />
          </View> */}
					<FlatList
						data={items}
						keyExtractor={(item) => item[valueProperty].toString()}
						numColumns={numberOfColumns}
						renderItem={({ item }) => (
							<PickerItemComponent
								item={item}
								label={item[textProperty]}
								textProperty={textProperty}
								onPress={() => {
									setModalVisible(false);
									onSelectItem(item);
								}}
							/>
						)}
					/>
				</Screen>
			</Modal>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: defaultStyles.colors.fields,
		borderRadius: 25,
		flexDirection: "row",
		padding: 15,
		marginVertical: 10,
	},
	icon: {
		marginRight: 10,
	},
	clearContainer: {
		paddingLeft: 10,
		paddingRight: 10,
	},
	closeContainer: {
		paddingLeft: 10,
		paddingRight: 10,
	},
	placeholder: {
		color: defaultStyles.colors.medium,
		flex: 1,
	},
	text: {
		flex: 1,
	},
});

export default AppPicker;
