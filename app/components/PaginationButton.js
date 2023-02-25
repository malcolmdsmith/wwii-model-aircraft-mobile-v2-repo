import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import { getPaginationButtonWidth } from "../utility/dimensions";
import colors from "../config/colors";

function PaginationButton({
  title,
  onPress,
  color = "primary",
  width,
  icon,
  fontSize = 18,
  iconAfter = false,
}) {
  const getButton = (iconAfter, title, icon) => {
    if (iconAfter) return <FontAwesome5 name={icon} size={14} />;
    else return <FontAwesome5 name={icon} size={14} />;
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color] }, width]}
      onPress={onPress}
    >
      <Text style={[styles.text, { fontSize: fontSize }]}>
        {getButton(iconAfter, title, icon)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    width: getPaginationButtonWidth(),
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    //fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default PaginationButton;
