import React, { Component } from "react";
import { StyleSheet, View, Dimensions, Image, Text } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import { getImages, getImageCount } from "../api/aircraftApi";
import Link from "../components/Link";
import colors from "../config/colors";

export default class ImageViewer extends Component {
  state = {
    totalImages: 0,
    cachedImageCount: 6,
    images: [],
    currentImage: 0,
    currentCached: 0,
    imageCount: 6,
    loading: false,
  };

  async componentDidMount() {
    const totalImages = await getImageCount();
    this.setState({ totalImages: totalImages.data[0].imageCount });
  }

  handleNextImage = async () => {
    let {
      totalImages,
      currentImage,
      currentCached,
      imageCount,
      cachedImageCount,
    } = this.state;

    if (currentImage === totalImages) return;
    if (currentImage === 0) return;
    ////console.log("cc:", currentImage, totalImages);
    let images = [];

    currentImage += 1;
    if (currentCached < imageCount) currentCached += 1;

    if (currentImage === 1 || currentCached === cachedImageCount) {
      images = await getImages(currentImage, cachedImageCount);
      if (images.data.length < cachedImageCount)
        imageCount = images.data.length;
      currentCached = 1;

      this.setState({
        currentImage,
        currentCached,
        images: images.data,
      });
    } else {
      this.setState({ currentImage, currentCached });
    }
  };

  handlePrevImage = async () => {
    let { currentImage, currentCached, cachedImageCount } = this.state;

    if (currentImage === 0) return;

    let images = [];
    currentImage -= 1;
    if (currentCached > 1) currentCached -= 1;

    if (currentCached === 0) {
      currentImage -= cachedImageCount;
      if (currentImage < 0) {
        currentImage = 0;
        this.setState(currentImage, currentCached);
      }

      images = await getImages(currentImage, cachedImageCount);
      currentCached = 5;
      ////console.log(images.data.length);
      this.setState({
        currentImage,
        currentCached,
        images: images.data,
      });
    } else {
      this.setState({ currentImage, currentCached });
    }
  };

  handleFirstImage = () => {
    const currentImage = 0;
    const currentCached = 0;

    this.setState({ currentImage, currentCached });
  };

  handleLastImage = async () => {
    const { cachedImageCount } = this.state;

    const result = await getImageCount();
    const totalImages = result.data[0].imageCount;
    const currentImage = Math.ceil(totalImages / cachedImageCount);
    let images = [];

    images = await getImages(currentImage, cachedImageCount);
    let currentCached = images.data.length - 1;
    //console.log("==", currentCached, images.data.length);
    this.setState({
      currentImage: totalImages,
      currentCached,
      images: images.data,
    });
  };

  handleAircraftSelect = (aircraft_id) => {
    this.props.onAircraftSelect(aircraft_id);
  };

  render() {
    const { totalImages, images, currentImage, currentCached } = this.state;
    //console.log(
      totalImages,
      currentImage,
      currentCached,
      images.length > 0 ? images[currentCached].aircraft_id : 0
    );

    const dimensions = Dimensions.get("window");
    const imageHeight = Math.round((dimensions.width * 3) / 4);
    const imageWidth = dimensions.width - 40;

    return (
      <View style={styles.container}>
        <Image
          style={{
            width: imageWidth,
            height: imageHeight,
            marginTop: 20,
            marginBottom: 10,
            borderRadius: 10,
          }}
          source={
            currentImage === 0
              ? require("../assets/mobilescreen.jpg")
              : {
                  uri:
                    "data:image/" +
                    images[currentCached].aircraft_image_format +
                    ";base64," +
                    images[currentCached].aircraft_image,
                }
          }
        />
        {currentCached === 0 ? (
          <Text>Kittyhawk</Text>
        ) : (
          //   <Link
          //     title={images[currentCached].aircraft_name}
          //     onPress={() =>
          //       this.handleAircraftSelect(images[currentCached].aircraft_id)
          //     }
          //   ></Link>
          <View>
            <Text>{images[currentCached].aircraft_name}</Text>
            <Text>{images[currentCached].aircraft_id}</Text>
          </View>
        )}
        <View style={styles.links}>
          <Link
            title="First"
            icon="step-backward"
            onPress={() => this.handleFirstImage()}
          ></Link>
          <View style={styles.spacer}></View>
          {currentImage > 0 ? (
            <Link
              title="Previous"
              icon="backward"
              onPress={() => this.handlePrevImage()}
            ></Link>
          ) : (
            <Text style={styles.disabledlink}>
              <FontAwesome5 name="backward" /> Previous
            </Text>
          )}
          <View style={styles.spacer}></View>
          {currentImage < totalImages ? (
            <Link
              title="Next"
              icon="forward"
              onPress={() => this.handleNextImage()}
            ></Link>
          ) : (
            <Text style={styles.disabledlink}>
              <FontAwesome5 name="forward" /> Next
            </Text>
          )}
          <View style={styles.spacer}></View>
          <Link
            title="Last"
            icon="step-forward"
            onPress={() => this.handleLastImage()}
          ></Link>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  aircraft_title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  links: {
    flexDirection: "row",
    marginTop: 20,
  },
  disabledlink: {
    color: colors.medium,
  },
  spacer: {
    width: 20,
  },
});
