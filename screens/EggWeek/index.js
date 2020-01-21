import React, { Component } from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Card, Title, DataTable, Surface, Portal, List } from 'react-native-paper';

import DATE from '../../utilities/Date';
import InventoryManager from '../../utilities/InventoryManager';

let renderedDays = null;


export default class EggWeek extends Component {

    constructor(props) {
        super(props);

        this.state = {
            weekNumber: "",
            rendered: false,
            eggs: [],
        };
    }

    componentDidMount () {
        let weekNumber = this.props.navigation.getParam("weekNumber", {
            weekNumber: 0,
        });

        let eggs = this.props.navigation.getParam("week", {
            week: [],
        });

        this.setState({
            weekNumber,
            eggs,
        });

        this.forceUpdate();
    }

    forceUpdate = () => {
        // renderedDays = this.renderDays();
    }

    renderDays = () => {
        let weekOrder = this.props.navigation.getParam("weekOrder", {
            weekOrder: DATE.days,
        });
        let { eggs } = this.state;

        let days = [];
        let counterDays = 6;

        for(let i=0; i<eggs.length; i++) {
            let eggTypes = [];

            for(let x=0; x<4; x++) {
                eggTypes.push(InventoryManager.findTrays(eggs[i][x]).split("."));
            }

            days.push(
                <Surface style={styles.surface}>
                    <DataTable style={styles.dataTable}>
                        <DataTable.Header>
                            <DataTable.Title>{weekOrder[counterDays]}</DataTable.Title>
                            <DataTable.Title numeric>Full Trays</DataTable.Title>
                            <DataTable.Title numeric>Extra</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Row>
                            <DataTable.Cell>Normal Eggs</DataTable.Cell>
                            <DataTable.Cell numeric>{eggTypes[0][0]}</DataTable.Cell>
                            <DataTable.Cell numeric>{eggTypes[0][1]}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>Broken Eggs</DataTable.Cell>
                            <DataTable.Cell numeric>{eggTypes[1][0]}</DataTable.Cell>
                            <DataTable.Cell numeric>{eggTypes[1][1]}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>Smaller Eggs</DataTable.Cell>
                            <DataTable.Cell numeric>{eggTypes[2][0]}</DataTable.Cell>
                            <DataTable.Cell numeric>{eggTypes[2][1]}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>Larger Eggs</DataTable.Cell>
                            <DataTable.Cell numeric>{eggTypes[3][0]}</DataTable.Cell>
                            <DataTable.Cell numeric>{eggTypes[3][1]}</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable>
                </Surface>
            );

            counterDays--;
        }

        return days;
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
                    <List.Item
                        title={`Week ${this.state.weekNumber}`}
                        description="Eggs collected during the whole week"
                    />
                    {this.renderDays()}
                </ScrollView>
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
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
    title: {
        textAlign: "center",
    },
    surface: {
        elevation: 1,
        margin: 8,
    },
    dataTable: {
        minWidth: (Dimensions.get("window").width - 32),
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
    },
});
