import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Title, DataTable, Surface, Portal, List } from 'react-native-paper';

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
            <ScrollView>
                <List.Item
                    title={`Week ${this.state.weekNumber}`}
                    description="Eggs collected during the whole week"
                />
                {this.renderDays()}
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
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
