import React, { PureComponent } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Title, List } from 'react-native-paper';


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
            <View>
                <List.Section title="Settings">
                    <List.Item
                        title="Notifications"
                        description="Default notificatiion time, daily ggg input reminder..."
                        onPress={this.notification}
                        left={props => <List.Icon {...props} icon="bell"/>}
                        />
                    <List.Item 
                        title="Security"
                        description="Reset Password, new authentication method, set up password"
                        onPress={this.security}
                        left={props => <List.Icon {...props} icon="security"/>}
                        />
                    <List.Item
                        title="Manage Batches"
                        description="Archive batches, delete batches, change names..."
                        onPress={this.batches}
                        left={ props=> <List.Icon { ...props } icon="folder-edit" /> }
                        />
                </List.Section>                
            </View>
        );
    }

}