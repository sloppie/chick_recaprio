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
import SecurityManager from '../../utilities/SecurityManager';


export default class EmptyInventory extends PureComponent {

    constructor(props) {
        super(props);

        this.bottomSheetRef = React.createRef();

        this.state = {
            misc: "",
            price: null
        };
    }

    getMisc = (value) => {
        this.setState({
            misc: Number(value),
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

    authenticate = (authenticated) => {
        if(authenticated == true) {
            this.restock();
        } else {
            ToastAndroid.show("Unable to verify password", ToastAndroid.SHORT);
            this.props.navigation.pop();
        }
    }

    callBottomSheet = () => {
        this.bottomSheetRef.current.snapTo(1);
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
                    style={styles.btn}
                    mode="outlined"
                    onPress={this.callBottomSheet}>
                    <Text>Empty Inventory</Text>
                </Button>
                { SecurityManager.runAuthenticationQuery(this.bottomSheetRef, this.authenticate) }
            </View>
        );
    }

}


const styles = StyleSheet.create({
    screen: {
        minHeight: "100%",
    },
    btn: {
        marginTop: 16,
    },
});
