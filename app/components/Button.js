import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import colors from "../config/colors";

function AppButton({
  title,
  onPress,
  color = "primary",
  width = "100%",
  fontSize = 18,
  icon = "",
  iconAfter = false,
}) {
  const getButton = (iconAfter, title, icon) => {
    if (iconAfter)
      return (
        <Text>
          {title} <FontAwesome5 name={icon} />
        </Text>
      );
    else
      return (
        <Text>
          <FontAwesome5 name={icon} /> {title}
        </Text>
      );
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color] }, width]}
      onPress={onPress}
    >
      {icon != "" ? (
        <Text style={[styles.text, { fontSize: fontSize }]}>
          {getButton(iconAfter, title, icon)}
        </Text>
      ) : (
        <Text style={[styles.text, { fontSize: fontSize }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
