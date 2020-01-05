import React, { PureComponent } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { List } from 'react-native-paper';

import SecurityManager from '../../utilities/SecurityManager';


export default class SecuritySettings extends PureComponent {

    render() {
        return (
            <View>
                <List.Section>
                    <List.Item 
                        title="Reset Password"
                        description="Change the current password"
                    />
                </List.Section>
            </View>
        );
    }

}
