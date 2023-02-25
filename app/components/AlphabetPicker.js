import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { isTablet } from "react-native-device-detection";

import AlphabetLink from "./AlphabetLink";
import colors from "../config/colors";

export default function AlphabetPicker({
  onAlphaChange,
  color = colors.tertiary,
  includeNumbers,
}) {
  const chars = includeNumbers
    ? "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <>
      <View style={[styles.container, { backgroundColor: color }]}>
        <ScrollView horizontal={true}>
          {chars.map((char, index) => (
            <AlphabetLink key={index} char={char} onPress={onAlphaChange} />
          ))}
        </ScrollView>
        <MaterialIcons
          name="arrow-right"
          size={Platform.OS === "ios" ? 30 : 42}
          color="white"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingLeft: 15,
    paddingBottom: 3,
    borderRadius: 25,
    marginRight: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
