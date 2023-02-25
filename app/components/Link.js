import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { isTablet } from "react-native-device-detection";

import colors from "../config/colors";

function AppLink({ title, icon, onPress, fontSize = isTablet ? 20 : 16 }) {
  return (
    <TouchableOpacity style={[styles.button]} onPress={onPress}>
      <Text style={[styles.text, { fontSize: fontSize }]}>
        <FontAwesome5 name={icon} /> {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    // borderRadius: 25,
    // justifyContent: "center",
    // alignItems: "center",
    // padding: 15,
    //width: "100%",
    // marginVertical: 10,
    //backgroundColor: "green",
  },
  text: {
    color: colors.tertiary,
    textAlign: "center",
  },
});

export default AppLink;
