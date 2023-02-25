import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SearchSelectScreen from "../screens/SearchSelectScreen";
import AircraftSearchScreen from "../screens/AircraftSearchScreen";
import AircraftResultsScreen from "../screens/AircraftResultsScreen";
import AircraftDetailScreen from "../screens/AircraftDetailScreen";
import BrandSearchScreen from "../screens/BrandSearchScreen";
import BrandResultsScreen from "../screens/BrandResultsScreen";
import BrandDetailScreen from "../screens/BrandDetailScreen";
import FavouritesScreen from "../screens/FavouritesScreen";

const Stack = createStackNavigator();

const SearchContainerNavigator = () => (
	<Stack.Navigator
		screenOptions={{ headerShown: false }}
		initialRouteName="SearchSelect"
	>
		<Stack.Screen name="SearchSelect" component={SearchSelectScreen} />
		<Stack.Screen name="AircraftSearch" component={AircraftSearchScreen} />
		<Stack.Screen name="AircraftResults" component={AircraftResultsScreen} />
		<Stack.Screen name="AircraftDetail" component={AircraftDetailScreen} />
		<Stack.Screen name="BrandSearch" component={BrandSearchScreen} />
		<Stack.Screen name="BrandResults" component={BrandResultsScreen} />
		<Stack.Screen name="BrandDetail" component={BrandDetailScreen} />
		<Stack.Screen name="Favourites" component={FavouritesScreen} />
	</Stack.Navigator>
);

export default SearchContainerNavigator;
