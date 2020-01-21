import React, { PureComponent } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import { Card, List } from 'react-native-paper';

import Theme from '../../theme';

import InventoryManager from '../../utilities/InventoryManager';


export default class WeekInFeeds extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            week: [],
            weekNumber: "",
        };
    }

    componentDidMount = () => {
        let week = this.props.navigation.getParam("week", {
            week: [],
        });
        let weekNumber = this.props.navigation.getParam("weekNumber", {
            weekNumber: 0,
        });

        this.setState({
            week,
            weekNumber
        });
    }

    //  * [ date:Date, number:Number, price:Number, type:String]
    renderDataRows = () => {
        let rows = [];
        let { week } = this.state;

        for (let i = 0; i < week.length; i++) {
            rows.push(
                <List.Accordion
                    title={week[i][0]}
                    left={props => <List.Icon {...props} icon="calendar"/>}
                    key={week[i][0]}
                    theme={Theme.TEXT_INPUT_THEME}
                    style={styles.accordion}
                >
                    <List.Item
                        title={week[i][3] != undefined ? InventoryManager.redoFeedsName(week[i][3]) : "feed type unavailable"}
                        description="Feed type"
                    />
                    <List.Item
                        title={week[i][1]}
                        description="Number of sacks given"
                    />
                    <List.Item
                        title={week[i][2]}
                        description="Price of the feeds"
                    />
                </List.Accordion>
            );
        }

        return rows;
    }

    render() {
        return (
            <SafeAreaView style={styles.screen}>
                <Card style={styles.header}>
                    <Card.Title
                        style={styles.titleContainer}
                        title={`Week ${this.state.weekNumber}`}
                        titleStyle={styles.headerTitle}
                        right={props => <List.Icon icon="clipboard-outline" color={Theme.PRIMARY_COLOR} />} />
                </Card>
                <ScrollView style={styles.container}>
                    {this.renderDataRows()}
                </ScrollView>
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        height: "100%",
        backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
    },
    container: {
        borderTopEndRadius: 30,
        borderTopStartRadius: 30,
        backgroundColor: Theme.WHITE,
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
        textAlign: "center",
        fontSize: 16,
        color: "#777"
    },
    accordion: {
        borderTopEndRadius: 30,
        borderTopStartRadius: 30,
    },
});
