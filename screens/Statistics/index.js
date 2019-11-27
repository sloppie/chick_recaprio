import React, { Component, PureComponent } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions,
    NativeModules,
} from 'react-native';
import BalanceSheet from '../../utilities/BalanceSheet';


export default class Statistics extends Component {

    constructor(props) {
        super(props);

        this.state = {
            batches: [],
            feedsSum: 0,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.totalSum != nextState.totalSum ||
            this.state.batches.length != nextState.batches.length
    }

    componentDidMount() {
        let batches = NativeModules.FileManager.fetchBatchNames();
        batches = batches.split(",");
        batches.pop();
        batches.forEach(batch => {
            this.state.batches.push(new BalanceSheet(batch));
        });

        let totalSum = 0;
        this.state.batches.forEach(batch => {
            totalSum += batch.balanceFeeds();
        });
        this.setState({
            totalSum
        })
    }

    generateBatchInfo = () => {
        let batches = [];
        this.state.batches.forEach((batch, index) => {
            batches.push(<BatchInfo batch={batch} key={index}/>);
        });

        return batches;
    }

    render() {
        let returns = BalanceSheet.balanceEggs();
        return (
            <ScrollView style={styles.screen}>
                <View style={styles.batchInformation}>
                    {this.generateBatchInfo()}
                </View>
                <View style={styles.chicken}>
                    <Text>Chicken</Text>
                    <Text>Price: {this.state.totalSum}</Text>
                    <Text>Returns: {returns}</Text>
                    <Text>Profit = {returns - this.state.totalSum}</Text>
                </View>
                <View style={styles.finance}></View>
            </ScrollView>
        );
    }

}


class BatchInfo extends PureComponent {

    render() {
        return (
            <View>
                <Text>{this.props.batch.context}</Text>
                <Text>{this.props.batch.eggPercentage()}</Text>
                <Text>{this.props.batch.balanceFeeds()}</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        height: Dimensions.get("window").height,
        flex: 1,
    },
    chicken: {
        marginBottom: 16,
        elevation: 1,
    },
    finance: {
        elevation: 1,
    },
});
