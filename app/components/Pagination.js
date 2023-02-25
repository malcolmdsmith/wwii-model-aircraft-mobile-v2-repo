import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

import PaginationButton from "../components/PaginationButton";
import Styles from "../config/styles";

class Pagination extends Component {
  state = {};

  handleButtonPress = (button) => {
    const { pageSize, itemsCount, currentPage } = this.props;
    const pagesCount = Math.ceil(itemsCount / pageSize);
    let page = 1;

    switch (button) {
      case "First":
        page = 1;
        break;
      case "Prev":
        if (currentPage > 1) page = currentPage - 1;
        else page = 1;
        break;
      case "Next":
        if (currentPage < pagesCount) page = currentPage + 1;
        else page = pagesCount;
        break;
      case "Last":
        page = pagesCount;
        break;
      default:
        break;
    }

    this.props.onPageChange(page);
  };

  render() {
    return (
      <View style={styles.container}>
        <PaginationButton
          title="First"
          onPress={() => this.handleButtonPress("First")}
          color={Styles.colors.Primary}
          fontSize={9}
          icon="step-backward"
        />
        <PaginationButton
          title="Prev"
          onPress={() => this.handleButtonPress("Prev")}
          color={Styles.colors.Primary}
          fontSize={9}
          icon="backward"
        />
        <PaginationButton
          title="Next"
          onPress={() => this.handleButtonPress("Next")}
          color={Styles.colors.Primary}
          fontSize={9}
          icon="forward"
          iconAfter={true}
        />
        <PaginationButton
          title="Last"
          onPress={() => this.handleButtonPress("Last")}
          color={Styles.colors.Primary}
          fontSize={9}
          icon="step-forward"
          iconAfter={true}
        />
      </View>
    );
  }
}

export default Pagination;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 60,
  },
});
