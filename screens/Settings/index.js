import React, { PureComponent } from 'react';
import { View, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { Title, Card, List } from 'react-native-paper';
import Icon from 'react-native-ionicons';
import Theme from '../../theme';


export default class Settings extends PureComponent {

    componentDidMount() {
    }

    notification = () => {
        this.props.navigation.navigate("NotificationSettings");
    }

    security = () => {
        this.props.navigation.navigate("SecuritySettings");
    }

    batches = () => {
        this.props.navigation.navigate("BatchSettings");
    }

    render() {
        return (
            <SafeAreaView style={styles.screen}>
                <Card style={styles.header}>
                    <Card.Title
                        style={styles.titleContainer}
                        title="App settings"
                        titleStyle={styles.headerTitle}
                        right={props => <Icon style={styles.screenIcon} name="cog" color={Theme.PRIMARY_COLOR} />} />
                </Card>
                <View style={styles.container}>
                    {/* <List.Section title="Settings"> */}
                        <List.Item
                            title="Notifications"
                            description="Default notificatiion time, daily ggg input reminder..."
                            onPress={this.notification}
                            left={props => <List.Icon {...props} color={Theme.PRIMARY_COLOR} icon="bell" />}
                        />
                        <List.Item
                            title="Security"
                            description="Reset Password, new authentication method, set up password"
                            onPress={this.security}
                            left={props => <List.Icon {...props} color={Theme.SECONDARY_COLOR_DARK} icon="security" />}
                        />
                        <List.Item
                            title="Manage Batches"
                            description="Archive batches, delete batches, change names..."
                            onPress={this.batches}
                            left={props => <List.Icon {...props} color={Theme.PRIMARY_COLOR} icon="folder-edit" />}
                        />
                    {/* </List.Section>                 */}
                </View>
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
    },
    container: {
        backgroundColor: Theme.WHITE,
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
    screenIcon: {
        marginEnd: 32,
    },
});
