import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';

import {
    TextInput, 
    Button,
} from 'react-native-paper';

// utilities
import InventoryManager from '../../utilities/InventoryManager';


export default class EmptyInventory extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            misc: 0,
            price: null
        };
    }

    getMisc = (value) => {
        this.setState({
            value: Number(value),
        });
    }

    lock = () => {
        let turnLock = this.props.navigation.getParam("lock", {
            lock: () => {}
        });

        turnLock();
    }

    confirm = () => {
        let { misc, price } = this.state;
        let details = {
            misc,
            price
        };

        InventoryManager.addPickUp(details);
        this.lock();
        this.props.navigation.pop();
    }

    render() {
        return (
            <View style={styles.screen}>
                <TextInput 
										value={String(this.state.misc)}
                    label="Misc."
                    keyboardType="decimal-pad"
                    onChangeText={this.getMisc}
                    />
                <Button 
                    mode="outlined">
                    <Text>Empty Inventory</Text>
                </Button>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    screen: {},
});
