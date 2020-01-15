import React, { PureComponent } from 'react';
import { 
    View, 
    Alert, 
    ToastAndroid, 
    StyleSheet, 
    Dimensions, 
} from 'react-native';

import { Card, TextInput, Button, List } from 'react-native-paper';
import PushNotification from 'react-native-push-notification';

import InventoryManager from '../../../utilities/InventoryManager';
import Theme from '../../../theme';


export default class PageOne extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            password: "",
            confirmPassword: "",
            feedsType: "",
            feedsNumber: 0,
            feedsPrice: 0,
            vibrationEnabled: true,
            ringtoneEnabled: true,
            eggVibrationEnabled: true,
            eggRingtoneEnabled: true,
        };

        this.scrollViewRef = React.createRef();
        PushNotification.requestPermissions()
    }

    scrollTo = (x) => {
        let scrollOptions = {
            x,
            y: 0,
            animated: true
        };
        this.props.scrollViewRef.current.scrollTo(scrollOptions);
    }

    getFeedType = (type) => {
        this.setState({
            feedsType: type,
        });
    }

    getFeedNumber = (number) => {
        this.setState({
            feedsNumber: Number(number),
        });
    }

    getFeedPrice = (price) => {
        this.setState({
            feedsPrice: Number(price),
        });
    }

    makeFeedsAlert = () => {
        Alert.alert(
            "Confirm Feed Information",
            `Confirm adding feeds type.\nName: ${this.state.feedsType}\nNumber in Stock: ${this.state.feedsNumber}`,
            [
                {
                    text: "Confirm",
                    onPress: () => {
                        let feedsObject = {
                            type: this.state.feedsType,
                            number: this.state.feedsNumber,
                            price: this.state.feedsPrice
                        };
                        // InventoryManager.addFeeds(feedsObject);
                        let width = Dimensions.get("window").width;
                        let nextPage = width * 2;
                        this.scrollTo(nextPage);
                    }
                },
            ],
        );
    }

    addFeeds = () => {
        let FTNE = (this.state.feedsType !== ""); // Feeds Type Not Empty
        let PNE = (this.state.feedsPrice > 0); // Price Not Empty
        let FNNE = (this.state.feedsNumber > 0); // Feeds Number Not Empty

        if(FTNE && PNE && FNNE) {
            this.makeFeedsAlert();
        } else {
            if(!FTNE) {
                ToastAndroid.show("Make sure the feeds type field is not empty", ToastAndroid.SHORT);
            } else if(!FNNE) {
                ToastAndroid.show("Make sure the number of feeds in inventory is more than 0", ToastAndroid.SHORT);
            } else {
                ToastAndroid.show("Make sure the price field value is greater than 0", ToastAndroid.SHORT);
            }
        }
    }

    render() {
        return (
            <View style={styles.screen}>
                <Card style={styles.header}>
                    <Card.Title 
                        style={styles.titleContainer}
                        title="Add your first feeds" 
                        titleStyle={styles.headerTitle} 
                        right={props => <List.Icon icon="plus" color={Theme.PRIMARY_COLOR}/>}/>
                </Card>
                <TextInput
                    theme={Theme.TEXT_INPUT_THEME}
                    label="Feed Type"
                    onChangeText={this.getFeedType}
                    mode="outlined"
                    value={this.state.feedsType}
                    style={styles.textInput2}
                    placeholder="Enter Feeds Name"
                    returnKeyType="next"
                />
                <TextInput
                    theme={Theme.TEXT_INPUT_THEME}
                    label="Feed Number"
                    onChangeText={this.getFeedNumber}
                    mode="outlined"
                    value={!this.state.feedsNumber ? "" : String(this.state.feedsNumber)}
                    style={styles.textInput2}
                    placeholder="Enter Feeds Number"
                    keyboardType="decimal-pad"
                    returnKeyType="next"
                />
                <TextInput
                    theme={Theme.TEXT_INPUT_THEME}
                    label="Feed Price"
                    onChangeText={this.getFeedPrice}
                    mode="outlined"
                    value={!this.state.feedsPrice ? "" : String(this.state.feedsPrice)}
                    style={styles.textInput2}
                    placeholder="Enter Feeds Price"
                    keyboardType="decimal-pad"
                />
                <Button
                    style={styles.secondButton}
                    onPress={this.addFeeds}
                    icon="plus"
                    color={Theme.SECONDARY_COLOR_DARK}
                >
                    Add New Feeds
                </Button>
                <List.Item
                    left={props => <List.Icon {...props} color={Theme.PRIMARY_COLOR_LIGHT} icon="information" />}
                    title={"Press the \"+\" button to add a feed type"}
                    description="Adds a new field for you to add a new type of feed type in your environment"
                />
                {/* <List.Item
                    left={props => <List.Icon {...props} icon="information" />}
                    title={"Press the \"+\" icon to add a feed type"}
                    description="Adds a new field for you to add a new type of feed type in your environment"
                /> */}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        height: "100%",
    },
    header: {
        elevation: 1,
        width: Dimensions.get("window").width,
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        paddingBottom: 0,
        marginBottom: 0,
    },
    titleContainer: {
        padding: 0,
        marginBottom: 0,
    },
    headerTitle: {
        // textAlign: "center",
        fontSize: 16,
        color: "#777"
    },
    container: {
        minWidth: (Dimensions.get("window").width - 32),
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        height: "100%",
    },
    textInput: {
        marginBottom: 8,
    },
    page: {
        minWidth: Dimensions.get("window").width,
        maxWidth: Dimensions.get("window").width,
        height: "100%",
    },
    button: {
        width: "60%",
        alignSelf: "center",
        padding: 8,
    },
    secondButton: {
        width: "60%",
        alignSelf: "center",
        padding: 8,
    },
    fab: {
        position: "absolute",
        right: 0,
        bottom: 0,
        margin: 16,
    },
    textInput2: {
        minWidth: (Dimensions.get("window").width - 32),
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        marginBottom: 8,
    },
});
