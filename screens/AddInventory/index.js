import React, { Component } from 'react';
import {
    View,
    TextInput,
    Text,
    Alert,
    StyleSheet,
    Button,
    NativeModules,
    TouchableHighlight,
    Dimensions,
} from 'react-native';
import { Card, List } from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import FileManager from '../../utilities/FileManager';
import Theme from '../../theme';

import Casualties from './Fragments/Casualties';
import Feeds from './Fragments/Feeds';
import Eggs from './Fragments/Eggs';

// !TODO add an instructional View at the end of the AddInventory Component to help the user fill in data correctly

export default class AddInventory extends Component{
    constructor(props) {
        super(props);
        this.state = {
            exists: false,
            counterCheck: false,
        };
        this._isMounted = false;
        this.SESSION = NativeModules.Sessions.getCurrentSession();

        true && NativeModules.FileManager.fetchBrief(this.SESSION, (data) => {
            this.batchInformation = JSON.parse(data);
            let context = this.props.navigation.getParam('context', undefined);
            if(context != "casualties") {
                let confirmation = FileManager.checkForRecords(this.batchInformation, context.toLowerCase());
                this.setState({
                    exists: confirmation,
                    counterCheck: true,
                });
            } else {
                this.setState({
                    exists: false,
                    counterCheck: true
                });
            }
        });
    }

    UNSAFE_componentWillMount() {
    }

    componentDidMount(){
        this._isMounted = true;
    }

    displayForm = () => {
        this.setState({
            exists: false,
        });
    }

    renderPage = (context, batchInformation, navigation) => {
        if (this.state.exists || (this.state.counterCheck && this.state.exists)) {
            return (
                <View style={styles.container}>
                    <Card style={styles.header}>
                        <Card.Title
                            style={styles.titleContainer}
                            title="Data already input"
                            titleStyle={styles.headerTitle}
                            right={props => <List.Icon icon="clipboard-check" color={Theme.PRIMARY_COLOR} />} />
                    </Card>
                    <View style={styles.lockedPage}>
                        <TouchableHighlight
                            onPress={this.displayForm}
                        >
                            <Icon style={{ textAlign: "center" }} name="lock" size={50} color={Theme.SECONDARY_COLOR_DARK} />
                        </TouchableHighlight>
                        {/* <Text style={styles.info}>{`This icon appears because you already input data for today\nIf you would like to reenter the data, please press the lock icon`}</Text> */}
                    </View>
                </View>
            )
        } else {
            let page = context.toLowerCase();
            if(page == "eggs") 
                return (
                    <View>
                        <Eggs batchInformation={batchInformation} navigation={navigation} />
                    </View>
                );
            else if(page == "feeds")
                return (
                    <View>
                        <Feeds batchInformation={batchInformation} navigation={navigation} />
                    </View>
                );
            else
                return (
                    <View>
                        <Casualties batchInformation={batchInformation} navigation={navigation} />
                    </View>
                );
        }
    }

    render(){
        const { navigation } = this.props;
        let context = navigation.getParam("context", "Not Found");
        return (
            this.renderPage(context, this.batchInformation, navigation)
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
    },
    header: {
        top: 0,
        position: "absolute",
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
        textAlign: "center",
        fontSize: 16,
        color: "#777"
    },
    lockedPage: {
        minHeight: Dimensions.get("window").height,
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: Theme.WHITE,
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
    },
    info: {
        textAlign: "center",
        color: Theme.HEADER_COLOR,
        fontWeight: Theme.NORMAL_WEIGHT,
    },
    eggs: {
        borderBottomColor: Theme.PRIMARY_COLOR_DARK,
        borderBottomWidth: 2,
    },
    textInput: {
        borderBottomColor: Theme.PRIMARY_COLOR_DARK,
        borderBottomWidth: 2,
    },   
});



/**
 * ```js
 *  let weekData = {
 *      // week starts at monday
 *    eggs: {
 *      "monday": {
 *          normalEggs: 30.15,
 *          brokenEggs: 0.40,
 *          smallerEggs: 0.50,
 *          largerEggs: 0.30          
 *      },
 *      "tuesday": {
 *          normalEggs: 30.15,
 *          brokenEggs: 0.40,
 *          smallerEggs: 0.50,
 *          largerEggs: 0.30          
 *      },
 *      "wednesday": {
 *          normalEggs: 30.15,
 *          brokenEggs: 0.40,
 *          smallerEggs: 0.50,
 *          largerEggs: 0.30          
 *      },
 *      "thursday": {
 *          normalEggs: 30.15,
 *          brokenEggs: 0.40,
 *          smallerEggs: 0.50,
 *          largerEggs: 0.30          
 *      },
 *      "friday": {
 *          normalEggs: 30.15,
 *          brokenEggs: 0.40,
 *          smallerEggs: 0.50,
 *          largerEggs: 0.30          
 *      },
 *      "saturday": {
 *          normalEggs: 30.15,
 *          brokenEggs: 0.40,
 *          smallerEggs: 0.50,
 *          largerEggs: 0.30          
 *      },
 *      "sunday": {
 *          normalEggs: 30.15,
 *          brokenEggs: 0.40,
 *          smallerEggs: 0.50,
 *          largerEggs: 0.30          
 *      }
 *    },
 *    feeds: {
 *      "monday": 8,
 *      "wednesday": 7,
 *      "friday": 8,
 *      "sunday": 8,
 *    },  
 *  };
 * ```
 */
