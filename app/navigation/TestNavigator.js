import React, { Component } from "react";
import { createBottomTabNavigator } from "react-navigation-bottom-tabs-no-warnings";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import FeedbackScreen from "../screens/FeedbackScreen";
import SearchContainerNavigator from "./SearchContainerNavigator";

const Tab = createBottomTabNavigator();

<Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      return <Icon name={iconName} type={iconType} size={25} color={color} />;
    },
  })}
  tabBar={(props) => <BottomTabBar {...props}></BottomTabBar>}
>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Search" component={SearchContainerNavigator} />
</Tab.Navigator>;
