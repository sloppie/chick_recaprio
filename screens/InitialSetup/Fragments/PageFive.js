import React, { PureComponent } from 'react';
import { View, ActivityIndicator, Dimensions,StyleSheet } from 'react-native';
import { Card, List, Colors, Title } from 'react-native-paper';

import Theme from '../../../theme';

export default class PageFive extends PureComponent {

    render() {
        return (
            <View style={styles.screen}>
                <Card style={styles.header}>
                    <Card.Title 
                        style={styles.titleContainer}
                        title="Finishing setup" 
                        titleStyle={styles.headerTitle} 
                        right={props => <List.Icon icon="cogs" color={Theme.PRIMARY_COLOR}/>}
                    />
                </Card>
                <ActivityIndicator 
                    size="large"
                    style={styles.activityIndicator}
                    animating={true}
                    color={Colors.blue600}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%",
        justifyContent: "center",
    },
    header: {
        position: "absolute",
        top: 0,
        start: 0,
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
    activityIndicator: {
        fontSize: 600,
    },
    caption: {
        textAlign: "center",
        color: "#444"
    },
});
