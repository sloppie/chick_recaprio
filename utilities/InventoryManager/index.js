import {
    NativeModules,
} from 'react-native';

import DATE from '../Date';
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
                if (history[0][2] != tod) {
                    let newInv = new Matrix(eggsArray);
                    // add new Data to the eggs inventory using matrices
                    let suppossedDate = DATE.getDate();
                    // searches for the date in history before proceeding
                    let historyIndex = -1;

                    for(let i=0; i<history.length; i++) {// !WARNING: BRUTEFORCE
                        if(history[i][2] == suppossedDate) {
                            historyIndex = i;
                            break;
                        }
                    }

                    if(historyIndex < 0) {
                        console.log("we're in adding new block");
                        let oldInv = new Matrix(currentInventory[0]);
                        oldInv.add(newInv);
                        let newData = [[...oldInv.matrix], currentInventory[1], DATE.getDate()];
                        history.unshift(newData);
                        currentInventory[0] = newData[0];
                    } else {
                        for(let i=historyIndex; i>=0; i--) {
                            let oldInv = new Matrix(history[i][0]);
                            oldInv.add(newInv);
                            history[i][0] = oldInv.matrix;
                        }

                        currentInventory[0] = history[0][0];
                    }

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
                } else if ((history[0][2] == tod) && !todaysCollect) {
                    // This is the block that allows adding eggs for multiple batches per day
                    console.log("We're in the reeeeeaalllllly special block");
                    let currentBatchDay = DATE.getDate(); // helps add egg inventory to the correct date
                    let historyIndex = 0;
                    let newInv = new Matrix(eggsArray);
                    let previousCollect = history[0][0];
                    for (let i = 0; i < history.length; i++) {
                        if (history[i][2] == currentBatchDay) {
                            previousCollect = history[i][0];
                            historyIndex = i;
                            break;
                        }
                    }

                    let oldInv = new Matrix(previousCollect);
                    oldInv.add(newInv);
                    // all the data is retained from the previous history 
                    //except the eggs number which is adjusted accordingly
                    let newData = [[...oldInv.matrix], history[historyIndex][1], history[historyIndex][2]];
                    history[historyIndex] = newData;
                    // scrutinize code below for errors
                    for (let i = (historyIndex - 1); i >= 0; i--) {// loop goes front adding the eggs into inv that were not accounted for
                        let prevInv = new Matrix(history[i][0]);
                        prevInv.add(newInv);
                        history[i][0] = prevInv.matrix;
                    }
                    currentInventory[0] = history[0][0];
                    console.log(JSON.stringify(currentInventory, null, 2))

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
                data.price = feedsObject.price;

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
                currentInventory = [];
                currentInventory.push([]);
                currentInventory.push({});
                currentInventory[1][type] = data.number[0];
            }

            NativeModules.InventoryManager.addCurrentInventory(JSON.stringify(currentInventory));
        }
    }

    /**
     * This function takes the curren inventory and subtracts the number leaving only the eggs collected on the same day.
     * @param details contais the details on the price and misc. expenses e.g: 
     * ```js
     *  let details = {
     *      misc: 2000,
     *      price: {
     *          normalEggs: 280,
     *          smallerEggs: 250,
     *          brokenEggs: 200,
     *          largerEggs: 300,
     *      },
     *  };
     * ```
     */
    static addPickUp(details = null) {
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
            let price = null;
            let misc = null;
            if (details) {
                try {
                    // try-catch block because  this might throw ann error considering details.price may be *undefined*
                    misc = details.misc;
                    price = details.price;
                } catch {
                    price = null;
                    misc = null;
                }
            }

            let batch = {
                date,
                number,
                price,
                misc
            };

            pickUp.unshift(batch);

            NativeModules.InventoryManager.addPickUp(JSON.stringify(pickUp))
            NativeModules.InventoryManager.addCurrentInventory(JSON.stringify(currentInventory));
        }
    }

    /**
     * this function adds prices to the pickUp object much later after it's stored to allow for chance to actually sell the eggs
     * @param { Object } pU is the object containing the updated pickUp object that now contains the new price details 
     * 
     * example `pU` Object:
     * ```js
     *      let pU = {
     *          date: "Tue Nov 19 2019",
     *          number: {
     *              normalEggs: "500.24",
     *              largerEggs: "20.24",
     *              smallerEggs: "5.23",
     *              broken: "5.23",
     *          },
     *          price: {
     *              normalEggs: 280,
     *              largerEggs: 300,
     *              smallerEggs: 250,
     *              brokenEggs: 200,
     *          },
     *          misc: 2000,
     *      };
     * ```
     */
    static addPrices(pU) {
        let pickUp = pU;
        let all = JSON.parse(NativeModules.InventoryManager.fetchPickUp());
        let index;
        for (let i = 0; i < all.length; i++) {
            if (pickUp.date == all[i].date) {
                index = i;
                break;
            }
        }

        all[index] = pickUp;

        NativeModules.InventoryManager.addPickUp(JSON.stringify(all));
    }

    static previewPickUp() {
        let pickUp;
        let history;
        let today = DATE.getDate();
        let preview;
        try {
            pickUp = JSON.parse(NativeModules.InventoryManager.fetchPickUp());
            history = JSON.parse(NativeModules.InventoryManager.fetchHistory());
        } catch (err) {
            pickUp = null;
            history = null;
        }
        if (pickUp) {
            let stock;

            if (history[0][2] == today) {
                stock = history[1][0];
            } else {
                stock = history[0][0];
            }

            preview = {
                normalEggs: InventoryManager.findTrays(stock[0]),
                brokenEggs: InventoryManager.findTrays(stock[1]),
                smallerEggs: InventoryManager.findTrays(stock[2]),
                largerEggs: InventoryManager.findTrays(stock[3])
            };
        } else {
            preview = {
                normalEggs: "0.0",
                brokenEggs: "0.0",
                smallerEggs: "0.0",
                largerEggs: "0.0",
            }
        }

        return preview;
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
