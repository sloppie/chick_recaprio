import React, { Component, PureComponent } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions,
    NativeModules,
} from 'react-native';

import {
    Card,
    Title,
    Paragraph,
    Caption,
} from 'react-native-paper';

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

    generateBatchInfoCards = () => {
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
                <Card style={styles.summary}>
                    <Title>Chicken Total Finances</Title>
                    <View style={batchStyles.wrapper}>
                        <Caption style={batchStyles.caption}>Price: </Caption>
                        <Text style={batchStyles.exp}>Ksh{this.state.totalSum}</Text>
                    </View>
                    <View style={batchStyles.wrapper}>
                        <Caption style={batchStyles.caption}>Returns: </Caption>
                        <Text style={batchStyles.exp}>Ksh{returns}</Text>
                    </View>
                    <View style={batchStyles.wrapper}>
                        <Caption style={batchStyles.caption}>Profit: </Caption>
                        <Text style={batchStyles.exp}>Ksh{returns - this.state.totalSum}</Text>
                    </View>
                </Card>
                		<View style={styles.batchInformation}>
                    		{this.generateBatchInfoCards()}
                		</View>
                		<View style={styles.finance}></View>
            </ScrollView>
        );
    }

}


class BatchInfo extends PureComponent {

    render() {
        let batch:BalanceSheet = this.props.batch;

        return (
            <Card style={batchStyles.card}>
                <Title>{batch.context}</Title>
                <Caption >from {batch.getInitialDate()}</Caption>
                <Text style={batchStyles.exp}>{batch.eggPercentage()}%</Text>
								<View style={batchStyles.wrapper}>
                		<Caption style={batchStyles.caption}>Expenditure on Feeds:</Caption>
                		<Text style={batchStyles.exp}>Ksh{batch.balanceFeeds()}</Text>
								</View>
            </Card>
        );
    }

}

const batchStyles = StyleSheet.create({
		card: {
				padding: 8,
				maxWidth: (Dimensions.get("window").width - 32),
				minWidth: (Dimensions.get("window").width - 32),
				margin: 8,
		},
		wrapper: {
				flexDirection: "row",
		},
		caption: {
				textAlignVertical: "bottom",
		},
    exp: {
        fontSize: 25,
        fontWeight: "700",
        color: "red",
    },
});

const styles = StyleSheet.create({
    screen: {
				alignSelf: "center",
        height: Dimensions.get("window").height,
        flex: 1,
    },
		summary: {
				maxWidth: (Dimensions.get("window").width - 32),
				minWidth: (Dimensions.get("window").width - 32),
				alignSelf: "center",
				padding: 8,
		},
    chicken: {
        marginBottom: 16,
        elevation: 1,
    },
    finance: {
        elevation: 1,
    },
});
