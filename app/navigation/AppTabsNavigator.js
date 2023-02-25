import React from "react";
//import { createBottomTabNavigator } from "react-navigation-bottom-tabs-no-warnings";@react-navigation/bottom-tabs
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";

import HomeScreen from "../screens/HomeScreen";
import FeedbackScreen from "../screens/FeedbackScreen";
import SearchContainerNavigator from "./SearchContainerNavigator";
import routes from "./routes";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
	return (
		<NavigationContainer>
			<Tab.Navigator
				initialRouteName="Home"
				screenOptions={{ headerShown: false }}
			>
				<Tab.Screen
					name="Home"
					component={HomeScreen}
					options={{
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="home" color={color} size={size} />
						),
					}}
				/>
				<Tab.Screen
					name="Search"
					component={SearchContainerNavigator}
					options={{
						tabBarIcon: ({ color, size }) => (
							<FontAwesome5 name="search" color={color} size={size} />
						),
					}}
				/>
				<Tab.Screen
					name="Feedback"
					component={FeedbackScreen}
					options={{
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="email" color={color} size={size} />
						),
					}}
				/>
			</Tab.Navigator>
		</NavigationContainer>
	);
};

export default AppNavigator;
