import React from "react";
import {
	StyleSheet,
	Linking,
	View,
	ScrollView,
	ImageBackground,
} from "react-native";
import * as Yup from "yup";
import qs from "qs";

import {
	ErrorMessage,
	Form,
	FormField,
	SubmitButton,
} from "../components/forms";
import Text from "../components/Text";
import Link from "../components/Link";
import Screen from "../components/Screen";
import ErrorView from "../components/ErrorView";
import logger from "../utility/logger";

const validationSchema = Yup.object().shape({
	name: Yup.string().required().label("Name"),
	email: Yup.string().required().email().label("Email"),
	message: Yup.string().required().min(4).label("Message"),
});

class FeedbackScreen extends React.Component {
	state = {
		name: "",
		email: "",
		message: "",
		error: "",
		showErrorView: false,
	};

	logError(error) {
		logger.log(error);
		this.setState({ loading: false, showErrorView: true });
	}

	handleContinueError = () => {
		try {
			this.props.navigation.navigate(routes.SEARCH_SELECT);
		} catch (e) {
			//console.log(e);
		}
	};

	handleSubmit = async (emailInfo, { resetForm }) => {
		try {
			//const to = 'kevindavson980@gmaiL.com'
			const to = "malcolms65@gmaiL.com";
			let url = `mailto:${to}`;
			const body = `Name: ${emailInfo.name}, Email: ${emailInfo.email}, Message: ${emailInfo.message}`;

			// Create email link query
			const query = qs.stringify({
				subject: "WWII Aircraft App - Feedback",
				body: body,
			});

			if (query.length) {
				url += `?${query}`;
			}

			// check if we can use this link
			const canOpen = await Linking.canOpenURL(url);

			if (!canOpen) {
				//console.log("Provided URL can not be handled");
			}

			Linking.openURL(url);
			resetForm();
		} catch (err) {
			this.logError(err);
		}
	};

	handleReset = () => {};

	render() {
		const { showErrorView } = this.state;

		return (
			<>
				{showErrorView ? (
					<ErrorView onContinue={() => this.handleContinueError()} />
				) : (
					<ImageBackground
						source={require("../assets/feedback.png")}
						style={{ flex: 1 }}
					>
						<View style={styles.container}>
							<Form
								initialValues={{ name: "", email: "", message: "" }}
								resetValues={{ name: "", email: "", message: "" }}
								onSubmit={this.handleSubmit}
								validationSchema={validationSchema}
								onHandleReset={this.handleReset}
							>
								{/* <ErrorMessage error={error} visible={error} /> */}
								<FormField
									autoCorrect={false}
									icon="account"
									name="name"
									placeholder="Name"
								/>
								<FormField
									autoCapitalize="none"
									autoCorrect={false}
									icon="email"
									keyboardType="email-address"
									name="email"
									placeholder="Email"
									textContentType="emailAddress"
								/>
								<FormField
									autoCapitalize="none"
									autoCorrect={false}
									icon="pencil"
									name="message"
									placeholder="Message"
									multiline={true}
									height={200}
									textAlignVertical="top"
								/>
								<View style={styles.submit}>
									<SubmitButton title="Submit" />
								</View>
							</Form>
						</View>
					</ImageBackground>
				)}
			</>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "space-evenly",
		paddingLeft: 20,
		paddingRight: 20,
	},
	submit: {
		alignSelf: "flex-end",
		width: "100%",
	},
});

export default FeedbackScreen;
