import {
    NativeModules,
} from 'react-native';

import { Matrix } from '../Matrix';

export default class InventoryManager {

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

                } else if ((history[0][2] == tod) && todaysCollect) { // added this case for rewriting when data for the day is already added
                    // !TODO This has to load the Inventory of eggs and reedit them, minus the old number, and add the new number
                    console.log("Were in the replacement block");
                    let newInv = new Matrix(eggsArray);
                    let previousCollect = history[0][0];
                    let oldInv = new Matrix(previousCollect);
                    let col = new Matrix(todaysCollect);
                    oldInv.subtract(col);
                    oldInv.add(newInv);
                    let newData = [[...oldInv.matrix], currentInventory[1], new Date().toDateString()];
                    history[0] = newData;
                    currentInventory[0] = newData[0];
                    console.log(JSON.stringify(currentInventory, null, 2))

                    // Rewrite newData to loocal storage
                    NativeModules.InventoryManager.addCurrentInventory(JSON.stringify(currentInventory));
                    NativeModules.InventoryManager.addHistory(JSON.stringify(history));
                } else if((history[0][2] == tod) && !todaysCollect) {
                    // This is the block that allows adding eggs for multiple batches per day
                    console.log("We're in the reeeeeaalllllly special block");
                    let newInv = new Matrix(eggsArray);
                    let oldInv = new Matrix(currentInventory[0]);
                    oldInv.add(newInv);
                    let newData = [[...oldInv.matrix], currentInventory[1], new Date().toDateString()];
                    history[0] = newData;
                    currentInventory[0] = newData[0];

                    // Rewrite the data to local storage
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

    /**
     * This function takes the curren inventory and subtracts the number leaving only the eggs collected on the same day.
     */
    static addPickUp() {
        let pickUp;
        let currentInventory;
        let cim; //cim = currentInventoryMatrix

        try {
            pickUp = JSON.parse(NativeModules.InventoryManager.fetchPickUp());
            currentInventory = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory());
            cim = new Matrix(currentInventory[0]);
        } catch (err) {
            pickUp = null;
        }

        if (pickUp != null) {
            let history = JSON.parse(NativeModules.InventoryManager.fetchHistory());
            let stock;
            let stockMatrix;

            if (history[0][2] == new Date().toDateString()) {
                stock = history[1][0];
                stockMatrix = new Matrix(stock);
            } else {
                stock = history[0][0];
                stockMatrix = new Matrix(stock);
            }
            
            // subtracts only leaving out the eggs keyed in today
            cim.subtract(stockMatrix);

            currentInventory[0] = cim.matrix;

            let number = {
                normalEggs: InventoryManager.findTrays(stock[0]),
                brokenEggs: InventoryManager.findTrays(stock[1]),
                smallerEggs: InventoryManager.findTrays(stock[2]),
                largerEggs: InventoryManager.findTrays(stock[3])
            };
            let date = new Date().toDateString();
            let batch = {
                date,
                number
            };

            pickUp.unshift(batch);

            NativeModules.InventoryManager.addPickUp(JSON.stringify(pickUp))
            NativeModules.InventoryManager.addCurrentInventory(JSON.stringify(currentInventory));
        }
    }

    /**
     * Converts number fed in into tray equivalent number. 
     * Eg: `30.23` which translates to `30 trays` and `23 eggs`
     * @param {Number} number is the raw number of eggs to be converted to tray equivalent Number
     * 
     * @returns a string in the form declared above showing full trays and the extra on on top
     */
    static findTrays(number) {
        let fullTrays = Math.floor(number / 30);
        let basicTray = number % 30;
        let trays = `${fullTrays}.${basicTray}`;

        return trays;
    }

    /**
     * Converts tray number eg: `30.23` to the raw equivalent number
     * @param {string} trayNumber string showing full trays and the extra eggs e.g: `"30.23"`
     * 
     * @returns the sum of the input tray number
     */
    static traysToEggs(trayNumber) {
        let trays = trayNumber.split(".");
        let fullTrays = Number(trays[0]);
        let remains = Number(trays[1]);

        let sum = 0;
        sum += (fullTrays * 30) + remains;

        return sum;
    }

    /**
     * This function takes the string input and normalises it to allow for storage in the backend of the application.
     * eg. input: `Pembe Chick Mash` is normalised to `pembe_chick_mash`
     * @param { string } name is the feeds name to be formatted
     * 
     * @returns a normalised string of the feeds name as shown above
     */
    static normaliseFeedsName(name) {
        let newName = name.toLowerCase();
        newName = newName.replace(/\s/gi, "_");
        return newName;
    }

    /**
     * The function takes in a normalised string eg: `pembe_chick_mash` and redoes it to a name more readable name to the user.
     * i.e the output of the previous input will be: `Pembe Chick Mash`
     * @param { string } name is a string name that was normalised.
     * 
     * @returns string that has reversed the normalisatiion. e.g: `pembe_chick_mash` to `Pembe Chick Mash`
     */
    static redoFeedsName(name) {
        let newName = name.split("_");

        for (let i = 0; i < newName.length; i++) {
            let interrim = newName[i].split("");
            interrim[0] = interrim[0].toUpperCase();
            newName[i] = interrim.join("");
        }

        newName = newName.join(" ");

        return newName;
    }

}
