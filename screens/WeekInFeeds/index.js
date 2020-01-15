import React, { PureComponent } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';

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
            <SafeAreaView>
                {this.renderDataRows()}
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        height: "100%",
    },
});
