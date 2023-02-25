import React, { Component } from "react";
import b64ToFile from "b64-to-file";

import Text from "../components/Text";
import Button from "../components/Button";
import { getBrandImage, getBrand } from "../api/brandApi";

class WebPConverter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleConvert = () => {
    const ids = this.getImagesIDs();

    const image = getBrandImage(ids[0]);
    const base64 = "data:image/webp;base64," + image.brand_image;
    let filename = ids[0].toString() + ".webp";
    const convertedFile = b64ToFile(base64, filename);
  };

  getImagesIDs() {
    const ids = [];

    ids.push("8710");
    ids.push("9567");
    ids.push("9336");
    ids.push("9563");

    return ids;
  }

  render() {
    return (
      <Button title="Convert" onPress={() => this.handleConvert()}></Button>
    );
  }
}

export default WebPConverter;
