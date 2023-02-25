import React, { Component } from "react";
import { StyleSheet, View, Image, Dimensions, Linking } from "react-native";

import Text from "./Text";
import Link from "./Link";
import colors from "../config/colors";

function getLink(sponsor) {
  let link = {};
  if (sponsor.sponsor_website === "") {
  } else {
    if (sponsor.sponsor_website.startsWith("http"))
      link = sponsor.sponsor_website;
    else link = `//${sponsor.sponsor_website}`;
    return (
      <Link
        title={sponsor.sponsor_website}
        onPress={() => {
          Linking.openURL(link);
        }}
      />
    );
  }
  return null;
}

function getImage(sponsor) {
  const dimensions = Dimensions.get("window");
  const imageWidth = dimensions.width - 40;
  let imageHeight = (sponsor.image_height / sponsor.image_width) * imageWidth;

  let image = {};
  if (sponsor.sponsor_logo)
    image = (
      <Image
        style={{ width: imageWidth, height: imageHeight, borderRadius: 10 }}
        source={{
          uri:
            "data:image/" +
            sponsor.sponsor_logo_format +
            ";base64," +
            sponsor.sponsor_logo,
        }}
      />
    );

  return image;
}

export function SponsorCard({ sponsor }) {
  return (
    <View style={styles.container}>
      <Text>{sponsor.sponsor_name}</Text>
      <View style={{ marginTop: 15, marginBottom: 15 }}>
        {getImage(sponsor)}
      </View>
      {getLink(sponsor)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: colors.medium,
    borderTopWidth: 1,
    marginTop: 10,
    paddingTop: 10,
  },
});
