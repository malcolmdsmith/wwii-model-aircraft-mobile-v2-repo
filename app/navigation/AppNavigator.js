import React from "react";
import { createBottomTabNavigator } from "react-navigation-bottom-tabs-no-warnings";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import FeedbackScreen from "../screens/FeedbackScreen";
import SearchContainerNavigator from "./SearchContainerNavigator";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Search">
      <Tab.Screen
        name="Home"
        children={() => <HomeScreen />}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        children={() => <SearchContainerNavigator />}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Feedback"
        children={() => <FeedbackScreen />}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="email" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
