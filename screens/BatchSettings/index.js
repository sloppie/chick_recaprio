import React, { PureComponent } from 'react';
import {
    View,
    ScrollView,
    SafeAreaView,
    Alert,
    ToastAndroid,
    NativeModules,
    StyleSheet,
    Dimensions
} from 'react-native';

import {
    Title,
    Card,
    TextInput,
    List,
    Colors,
} from 'react-native-paper';
import BottomSheet from 'reanimated-bottom-sheet';
import Theme from '../../theme';

import BatchManager from '../../utilities/BatchManager';
import SecurityManager from '../../utilities/SecurityManager';
import BalanceSheet from '../../utilities/BalanceSheet';

let context = "";
let activeCallback = () => {}


export default class BatchSettings extends PureComponent {

    constructor(props) {
        super(props);

        this.bottomSheetRef = React.createRef();
        this.renameBottomSheetRef = React.createRef();

        this.state = {
            activeBatches: null,
            fetched: false,
            newName: "",
        };
    }

    componentDidMount() {
        let activeBatches = NativeModules.FileManager.fetchBatchNames().split(",");
        activeBatches.pop();

        this.setState({
            activeBatches,
            fetched: true,
        });
    }

    setNewName = (newName) => {
        this.setState({
            newName
        });
    }

    submitRename = () => {
        let { newName } = this.state;
        let nameExists = NativeModules.FileManager.batchExists(newName);
        this.renameBottomSheetRef.current.snapTo(0);

        if(!nameExists) {
            Alert.alert(
                "Archive Batch",
                `The following batch will be renamed from: ${context} to: ${newName}`,
                [
                    {
                        text: "Deny",
                        onPress: () => {
                            console.log("User chose to opt out of archiving.");
                        }
                    },
                    {
                        text: "Confirm",
                        onPress: () => {
                            console.log("User chose to proceed with the action.");
                            BatchManager.renameBatch(context, newName);
                        }
                    },
                ],
            );
            
        }
    }

    renderHeader = () => {
        return (
            <Title>Rename Batch</Title>
        );
    }

    renderContent = () => {
        return (
            <View style={styles.bottomSheet}>
                <TextInput 
                    mode="outlined"
                    label="New name"
                    placeholder="Enter the new name"
                    onChangeText={this.setNewName}
                    style={styles.textInput}
                    onBlur={this.submitRename}
                    value={this.state.newName}
                />
            </View>
        );
    }

    renameBatch = (cntxt) => {
        context = cntxt;

        this.renameBottomSheetRef.current.snapTo(1);
    }

    archiveBatch = (cntxt) => {
        context = cntxt;

        Alert.alert(
            "Archive Batch",
            `The following batch will be archived: ${cntxt}.\nThis is to mean that the batch has been sold and/or not applicable for any normal chicken routines.`,
            [
                {
                    text: "Deny",
                    onPress: () => {
                        console.log("User chose to opt out of archiving.");
                    }
                },
                {
                    text: "Confirm",
                    onPress: () => {
                        console.log("User chose to proceed with the action.");
                        BatchManager.archive(cntxt);
                    }
                },
            ],
        );
    }

    deleteBatch = (cntxt) => {
        Alert.alert(
            "WARNING!",
            "This action is final. As such, if you confirm, there will be no way to retrieve the data once it is deleted.\nIf you wish to conserve the batch data, consider archiving the batch instead.\n\nConfirm deleting:",
            [
                {
                    text: "Deny",
                    onPress: () => {
                        console.log("User chose to opt out of deleting.");
                    }
                },
                {
                    text: "Confirm",
                    onPress: () => {
                        console.log("User chose to proceed with the action.");
                        BatchManager.delete(cntxt);
                    }
                },
            ],
        );
    }

    authenticate(authenticated) {
        if(authenticated == true) {
            activeCallback();
        } else {
            ToastAndroid.show("Unable to authenticate", ToastAndroid.SHORT);
        }
    }

    callBottomSheet(callback) {
        activeCallback = callback;

        this.bottomSheetRef.current.snapTo(1);
    }

    renderBatches() {
        let batches = [];
        let { activeBatches } = this.state;
        for(let i=0; i<activeBatches.length; i++) {
            let activeBatch = activeBatches[i];
            let renameBatchCallback = this.renameBatch.bind(this, activeBatch);
            let archiveBatchCallback = this.archiveBatch.bind(this, activeBatch);
            let deleteBatchCallback = this.deleteBatch.bind(this, activeBatch);
            batches.push(
                <List.Accordion 
                    key={activeBatches[i]}
                    theme={Theme.TEXT_INPUT_THEME}
                    title={activeBatches[i]} 
                    description={`Since: ${new BalanceSheet(activeBatches[i]).getInitialDate()}`}
                    left={props => <List.Icon {...props} icon="clipboard-outline" color={Theme.PRIMARY_COLOR}/>}
                >
                    <List.Item 
                        title="Rename batch"
                        description="Change the name of the batch"
                        left={props => <List.Icon {...props} icon="file-replace" color={Theme.PRIMARY_COLOR} />}
                        style={styles.itemIcons}
                        onPress={this.callBottomSheet.bind(this, renameBatchCallback)}
                    />
                    <List.Item 
                        title="Archive batch"
                        description="This means that the chicken have been sold by you wish to stil have the data sored in an archive"
                        descriptionNumberOfLines={3}
                        left={props => <List.Icon {...props} icon="archive" color={Theme.PRIMARY_COLOR} />}
                        style={styles.itemIcons}
                        onPress={this.callBottomSheet.bind(this, archiveBatchCallback)}
                    />
                    {/**Delete icon == "cancel" */}
                    <List.Item 
                        title="Delete batch"
                        description="This will completely remove all data pertaining to this batch from the database"
                        descriptionNumberOfLines={3}
                        left={props => <List.Icon {...props} icon="file-remove" color={Colors.red400} />}
                        style={styles.itemIcons}
                        onPress={this.callBottomSheet.bind(this, deleteBatchCallback)}
                    />
                </List.Accordion>
            );
        }

        return batches;
    }

    render() {
        return (
            <SafeAreaView style={styles.screen}>
                <ScrollView style={styles.scrollView} stickyHeaderIndices={[0]}>
                    <View style={styles.headerContainer}>
                        <Card style={styles.header}>
                            <Card.Title
                                style={styles.titleContainer}
                                title="Rename, archive and delete batches"
                                titleStyle={styles.headerTitle}
                                right={props => <List.Icon icon="cogs" color={Theme.PRIMARY_COLOR} />} />
                        </Card>
                    </View>
                    <List.Section title="Active Batches">
                        {this.state.fetched ? this.renderBatches() : <View />}
                    </List.Section>
                </ScrollView>
                { SecurityManager.runAuthenticationQuery(this.bottomSheetRef, this.authenticate) }
                <BottomSheet 
                    renderHeader={this.renderHeader}
                    renderContent={this.renderContent}
                    snapPoints={["0%", "50%", "80%"]}
                    initialSnap={0}
                    ref={this.renameBottomSheetRef}
                />
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        height: "100%",
        backgroundColor: Theme.PRIMARY_COLOR_DARK,
    },
    scrollView: {
        height: "100%",
        backgroundColor: Theme.WHITE,
    },
    headerContainer: {
        backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
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
    bottomSheet: {
        height: "100%",
        backgroundColor: "#fff"
    },
    textInput: {
        minWidth: (Dimensions.get("window").width - 32),
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        marginTop: 8,
        marginBottom: 8,
    },
    itemIcons: {
        marginStart: 32,
    },
});
