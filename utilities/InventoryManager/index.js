import {
    NativeModules,
} from 'react-native';

import { Matrix } from '../Matrix';

export default class InventoryManager {

    constructor() {
    }

    /**
     * 
     * @param { Array<Number> } eggsArray is the array containging eggs to be added the the current inventory:
     * @param { Array<Number> } todaysCollect is the array for the day in qustion if the user wants to re-enter the day's collection
     * `eggsArray` structure 
     * ```js 
     * [normalEggs:Number, brokenEggs:Number, smallerEggs:Number, largerEggs:Number]
     * ```
     */
    static addEggs(eggsArray, todaysCollect = null) {
        let currentInventory = [];
        let history = [];
        try {
            let cur = NativeModules.InventoryManager.fetchCurrentInventory();
            currentInventory = JSON.parse(cur);
            let hist = NativeModules.InventoryManager.fetchHistory();
            history = JSON.parse(hist);
        } catch (err) {
            history = null;
        }

        if (history != null) {
            console.log("This is history: ", history);
            if (history.length != 0) {
                let tod = new Date().toDateString();
                console.log(tod)
                if (history[0][2] != tod) {
                    // add new Data to the eggs inventory using matrices
                    console.log("we're in adding new block");
                    let newInv = new Matrix(eggsArray);
                    let oldInv = new Matrix(currentInventory[0]);
                    oldInv.add(newInv);
                    let newData = [[...oldInv.matrix], currentInventory[1], new Date().toDateString()];
                    history.unshift(newData);
                    currentInventory[0] = newData[0];

                    // Rewrite the data to local storage
                    NativeModules.InventoryManager.addCurrentInventory(JSON.stringify(currentInventory));
                    NativeModules.InventoryManager.addHistory(JSON.stringify(history));

                } else if (todaysCollect) { // added this case for rewriting when data for the day is already added
                    // !TODO This has to load the Inventory of eggs and reedit them, minus the old number, and add the new number
                    console.log("Were in the replacement block");
                    let newInv = new Matrix(eggsArray);
                    let oldInv = new Matrix(currentInventory[0]);
                    let col = new Matrix(todaysCollect);
                    oldInv.subtract(col);
                    oldInv.add(newInv);
                    let newData = [[...oldInv.matrix], currentInventory[1], new Date().toDateString()];
                    history[0] = newData;
                    currentInventory[0] = newData[0];

                    // Rewrite newData to loocal storage
                    NativeModules.InventoryManager.addCurrentInventory(JSON.stringify(currentInventory));
                    NativeModules.InventoryManager.addHistory(JSON.stringify(history));
                } else { // added this statement for the unique case of rewriting data on the first day of using the application
                    console.log("Were in special block")
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
     * @param {*} feedsObject object containing information on feeds used and other relevant information
     * 
     * example object:
     * ```js
     * {
     *      date<String>: "24-Oct-2019",
     *      number<Number>: 4,
     *      feedsName<String>: "Pembe Growers Mash",
     *      price<Number>: 2100,
     * }
     * ``` 
     */
    static restockFeeds(feedsObject) {
        let { type } = feedsObject;
        type = InventoryManager.normaliseFeedsName(type);

        if (NativeModules.InventoryManager.typeExists(type)) {
            let data = JSON.parse(NativeModules.InventoryManager.fetchFeeds(type));
            let { number } = data.number[0];
            let today = new Date().toDateString();
            let newNumber = number - feedsObject.number;
            let newStock = {
                date: today,
                number: newNumber
            }

            data.number.unshift(newStock);
            NativeModules.InventoryManager.addFeeds(type, JSON.stringify(data));

            // restock on the current running inventory:
            let currentInventory = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory());
            currentInventory[1][type] = newStock;
            NativeModules.InventoryManager.addCurrentInventory(JSON.stringify(currentInventory));
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
        if (NativeModules.InventoryManager.typeExists(type)) {
            try {
                data = JSON.parse(NativeModules.InventoryManager.fetchFeeds(type));
            } catch (err) {
                data = null;
            }
            if (data != null) {
                // fetch previous stock to allow for adding and manipulation
                let previousStock;
                if (data)
                    previousStock = data.number[0];
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
            let date = new Date().toDateString();
            let data = {
                name: type,
                number: [{
                    date,
                    number: feedsObject.number
                }],
                price: feedsObject.price
            }

            NativeModules.InventoryManager.addFeeds(type, JSON.stringify(data));

            let currentInventory = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory());
            if (currentInventory[1]) {
                currentInventory[1][type] = data.number[0];
            } else {
                currentInventory[0] = [];
                currentInventory[1] = {};
                currentInventory[1][type] = data.number[0];
            }

            NativeModules.InventoryManager.addCurrentInventory(JSON.stringify(currentInventory));
        }
    }

    static addPickUp() {
        let pickUp;
        try {
            pickUp = JSON.parse(NativeModules.InventoryManager.fetchPickUp());
        } catch (err) {
            pickUp = null;
        }

        if (pickUp != null) {
            let history = JSON.parse(NativeModules.InventoryManager.fetchHistory());
            let currentInventory;
            if (history[0][2] == new Date().toDateString()) {
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
        let fullTrays = Math.floor(number / 30);
        let basicTray = number % 30;
        let trays = `${fullTrays}.${basicTray}`;

        return trays;
    }

    static normaliseFeedsName(name) {
        let newName = name.toLowerCase();
        newName = newName.replace(/\s/gi, "_");
        return newName;
    }

    static redoFeedsName(name) {
        let newName = name.replace("_", " ");

        return newName;
    }

}
