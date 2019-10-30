import {
    NativeModules,
    Alert,
} from 'react-native';

import { Matrix } from '../Matrix';

export default class InventoryManager {
    constructor() {
    }

    /**
     * 
     * @param { Array<Number> } eggsArray is the array containging eggs to be added the the current inventory:
     * `eggsArray` structure 
     * ```js 
     * [normalEggs:Number, brokenEggs:Number, smallerEggs:Number, largerEggs:Number]
     * ```
     */
    static addEggs(eggsArray) {
        let currentInventory = [];
        let history = [];
        try{
            currentInventory = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory());
            history = JSON.parse(NativeModules.InventoryManager.fetchHistory());
        } catch (err) {
            // pass
        } finally {
            if(history) {
                if(history[0][2] != new Date().toDateString()) {
                    // add new Data to the eggs inventory using matrices
                    let newInv = new Matrix(eggsArray);
                    let oldInv = new Matrix(currentInventory[0]);
                    oldInv.add(newInv);
                    let newData = [[...oldInv.matrix], currentInventory[1], new Date().toDateString()];
                    history.unshift(newData);
                    currentInventory[0] = newData[0];
        
                    // Rewrite the data to local storage
                    NativeModules.InventoryManager.addCurrentInventory(JSON.stringify(currentInventory));
                    NativeModules.InventoryManager.addHistory(JSON.stringify(history));
        
                } else if(history.length > 1) { // added this case for rewriting when data for the day is already added
                    // !TODO This has to load the Inventory of eggs and reedit them, minus the old number, and add the new number
                    currentInventory[0] = history[1][0];
                    let newInv = new Matrix(eggsArray);
                    let oldInv = new Matrix(currentInventory[0]);
                    oldInv.add(newInv);
                    let newData = [[...oldInv.matrix], currentInventory[1], new Date().toDateString()];
                    history[0] = newData;
                    currentInventory[0] = newData[0];
        
                    // Rewrite newData to loocal storage
                    NativeModules.InventoryManager.addCurrentInventory(JSON.stringify(currentInventory));
                    NativeModules.InventoryManager.addHistory(JSON.stringify(history));
                } else { // added this statement for the unique case of rewriting data on the first day of using the application
                    let newData = [[...eggsArray], currentInventory[1], new Date().toDateString()];
                    history[0] = newData;
                    currentInventory[0] = newData[0];

                    // Rewrite newData to local storage
                    NativeModules.InventoryManager.addCurrentInventory(JSON.stringify(currentInventory));
                    NativeModules.InventoryManager.addHistory(JSON.stringify(history));
                }
            } else {
                let newData = [[...eggsArray], [], new Date().toDateString()];
                history.unshift(newData);
                currentInventory[0] = newData[0];
                NativeModules.InventoryManager.addCurrentInventory(JSON.stringify(currentInventory));
                NativeModules.InventoryManager.addHistory(JSON.stringify(history));
            }
        }

    }

    /**
     * 
     * @param { Object } feedsObject is the object containing `price`, `number`, `type`
     * e.g:
     * ```js
     *  {
     *      type: "Pembe Growers Mash",
     *      price: 2100,
     *      number: 30
     *  }
     * ```
     * 
     * adds the stock of the specified type
     */
    static addFeeds(feedsObject) {
        // Check if the feed type exists
        let { type } = feedsObject;
        type = InventoryManager.normaliseFeedsName(type);
        let data;
        if(NativeModules.InventoryManager.typeExists(type)) {
            try {
                data = JSON.parse(NativeModules.InventoryManager.fetchFeeds(type));
            } catch (err) {
                // pass
            } finally {
                // fetch previous stock to allow for adding and manipulation
                let previousStock = data.number[0];
                let newStock = {
                    date: new Date().toDateString(),
                    number: (previousStock.number + feedsObject.number),
                }

                data.number.unshift(newStock);

                // add in the current inventory
                let currentInventory = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory());
                currentInventory[1][type] = newStock;

                NativeModules.InventoryManager.addCurrentInventory(JSON.stringify(currentInventory));
                NativeModules.InventoryManager.addFeeds(type, JSON.stringify(data));
            }
        } else {
            //price is added once to the feeds
            let data = {
                name: type,
                number: [{
                    date: new Date().toDateString(),
                    number: feedsObject.number
                }],
                price: feedsObject.price
            }
            function confirm() {
                NativeModules.InventoryManager.addFeeds(type, JSON.stringify(data));
            }

            function deny() {

            }

            Alert.alert(
                "Confirm adding new feed type",
                `Confirm adding new feed type: ${feedsObject.type}\nPrice: Kshs ${feedsObject.price}\nQuatity: ${feedsObject.number} sacks`,
                [
                    {
                        text: "Confirm",
                        onPress: confirm,
                    },
                    {
                        text: "Revoke",
                        onPress: deny
                    }
                ],
                {
                    cancelable: false
                }
            );
        }
    }

    static restockFeeds(feedsObject) {
        let type = InventoryManager.normaliseFeedsName(feedsObject.type);
        feedsInventory = JSON.parse(NativeModules.InventoryManager.fetchFeeds(type));
        let currentInventory = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory());

        let newInventory = {
            date: new Date().toDateString(), 
            number: (feedsInventory.number[0].number - feedsObject.number)
        };
        feedsInventory.number.unshift(newInventory);
        currentInventory[1][type] = newInventory;
        NativeModules.InventoryManager.addFeeds(type, JSON.parse(feedsInventory));
        NativeModules.InventoryManager.addCurrentInventory(JSON.parse(currentInventory));
    }

    static addPickUp() {
        let pickUp;
        try {
            pickUp = JSON.parse(NativeModules.InventoryManager.fetchPickUp());
        } catch (err) {
            // pass
        } finally {
            let history = JSON.parse(NativeModules.InventoryManager.fetchHistory());
            let currentInventory;
            if(history[0][2] == new Date().toDateString()) {
                currentInventory = history[1][0];
            } else {
                currentInventory = history[0][0];
            }

            let number = {
                normalEggs: InventoryManager.findTrays(currentInventory[0]),
                brokenEggs: InventoryManager.findTrays(currentInventory[1]),
                smallerEggs: InventoryManager.findTrays(currentInventory[2]),
                largerEggs: InventoryManager.findTrays(currentInventory[3])
            };
            let date = new Date().toDateString();
            let batch = {
                date,
                number
            };

            pickUp.unshift(batch);

            NativeModules.InventoryManager.addPickUp(JSON.stringify(pickup))
        }        
    }

    static findTrays(number) {
        let fullTrays = Math.floor(number/30);
        let basicTray = number % 30;
        let trays = `${fullTrays}.${basicTray}`;

        return trays;
    }

    static normaliseFeedsName(name) {
        let newName = name.toLowerCase();
        newName = newName.replace(/\s/gi, "_");
        return newName;
    }
}
