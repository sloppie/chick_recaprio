import React, { PureComponent } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Card, List, DataTable, ActivityIndicator, TouchableRipple, Button } from 'react-native-paper';
import Theme from '../../../theme';


export default class PickUpCard extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            preview: [],
            rendered: true,
        };
    }

    componentDidMount() {
        let preview = {
            normalEggs: this.props.pickUp.number.normalEggs.split("."),
            smallerEggs: this.props.pickUp.number.smallerEggs.split("."),
            brokenEggs: this.props.pickUp.number.brokenEggs.split("."),
            largerEggs: this.props.pickUp.number.largerEggs.split(".")
        };

        this.setState({
            preview
        });
    }

    addPrices = () => {
        this.props.navigation.navigate("AddPrices", {
            pickUp: this.props.pickUp
        });
    }

    render() {
        if(this.state.preview.length == 0) {
            return (
                <View style={{justifyContent: "center"}}>
                    <ActivityIndicator
                        animating={true}
                        color={Theme.PRIMARY_COLOR}
                    />
                </View>
            );
        } else {
            return (
                <Card rippleColor={Theme.PRIMARY_COLOR} style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <DataTable style={styles.dataTable}>
                            <DataTable.Header>
                                <DataTable.Title >{this.props.pickUp.date}</DataTable.Title>
                                <DataTable.Title numeric>Full Trays</DataTable.Title>
                                <DataTable.Title numeric>Extra Eggs</DataTable.Title>
                            </DataTable.Header>
                            <DataTable.Row>
                                <DataTable.Cell style={styles.dataCell}>Normal Eggs</DataTable.Cell>
                                <DataTable.Cell style={styles.dataCell} numeric>{this.state.preview.normalEggs[0]}</DataTable.Cell>
                                <DataTable.Cell style={styles.dataCell} numeric>{this.state.preview.normalEggs[1]}</DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row>
                                <DataTable.Cell style={styles.dataCell}>Broken Eggs</DataTable.Cell>
                                <DataTable.Cell style={styles.dataCell} numeric>{this.state.preview.brokenEggs[0]}</DataTable.Cell>
                                <DataTable.Cell style={styles.dataCell} numeric>{this.state.preview.brokenEggs[1]}</DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row>
                                <DataTable.Cell style={styles.dataCell}>Smaller Eggs</DataTable.Cell>
                                <DataTable.Cell style={styles.dataCell} numeric>{this.state.preview.smallerEggs[0]}</DataTable.Cell>
                                <DataTable.Cell style={styles.dataCell} numeric>{this.state.preview.smallerEggs[1]}</DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row>
                                <DataTable.Cell style={styles.dataCell} borderless={true}>Larger Eggs</DataTable.Cell>
                                <DataTable.Cell style={styles.dataCell} numeric>{this.state.preview.largerEggs[0]}</DataTable.Cell>
                                <DataTable.Cell style={styles.dataCell} numeric>{this.state.preview.largerEggs[1]}</DataTable.Cell>
                            </DataTable.Row>
                        </DataTable>
                    </Card.Content>
                    <Card.Actions style={styles.cardActions}>
                        <Button
                            style={styles.button}
                            icon="tag"
                            color={Theme.SECONDARY_COLOR_DARK}
                        >
                            Add Price
                        </Button>
                    </Card.Actions>
                </Card>
            );
        }
    }
}

const styles = StyleSheet.create({
    dataTable: {
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.12)",
        margin: 0,
        padding: 0,
        width: (Dimensions.get("window").width - 32),
        alignSelf: "center",
    },
    button: {
        width: "100%",
    },
    card: {
        elevation: 0,
        alignSelf: "center",
        width: (Dimensions.get("window").width - 32),
        padding: 0,
        margin: 0,
    },
    cardContent: {
        padding: 0,
        margin: 0,
    },
    cardActions: {
        margin: 0,
    },
});
