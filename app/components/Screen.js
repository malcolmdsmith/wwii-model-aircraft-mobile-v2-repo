import React from "react";
import Constants from "expo-constants";
import { StyleSheet, SafeAreaView, View, Platform } from "react-native";
import { isTablet } from "react-native-device-detection";

function Screen({ children, style }) {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={[styles.view, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    marginTop: Constants.statusBarHeight + 20,
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  view: {
    flex: 1,
    paddingLeft: isTablet || Platform.OS === "ios" ? 20 : 0,
    paddingRight: isTablet || Platform.OS === "ios" ? 20 : 0,
  },
});

export default Screen;
